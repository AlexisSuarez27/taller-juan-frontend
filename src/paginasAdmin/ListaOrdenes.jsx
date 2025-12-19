import { useState, useEffect } from "react";
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import axios from "../setupAxios";
import '../styles/pageLayout.css';
import '../styles/components.css';

export default function ListaOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [open, setOpen] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [ordenAEliminar, setOrdenAEliminar] = useState(null);

  useEffect(() => {
    axios.get("/ordenes")
      .then((res) => setOrdenes(res.data))
      .catch((err) => console.error(err));
  }, []);

  const verOrden = async (id) => {
    try {
      const res = await axios.get(`/ordenes/${id}`);
      setOrdenSeleccionada(res.data);
      setOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmarEliminar = (id) => {
    setOrdenAEliminar(id);
    setOpenDelete(true);
  };

  const eliminarOrden = async () => {
    try {
      await axios.delete(`/ordenes/${ordenAEliminar}`);
      setOpenDelete(false);
      setOrdenAEliminar(null);
      const res = await axios.get("/ordenes");
      setOrdenes(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'Fecha no disponible';
    const date = new Date(fechaISO);
    const opciones = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'
    };
    return date.toLocaleDateString('es-EC', opciones); 
  };

  return (
    <Box className="pageContainer">
      <Paper className="mainPaper">
        <Typography variant="h4" className="pageTitle">
          Lista de órdenes de reparación
        </Typography>
        <TableContainer>
          <Table>
            <TableHead className="tableHead">
              <TableRow>
                <TableCell className="tableHeadCell">ID</TableCell>
                <TableCell className="tableHeadCell">Cliente</TableCell>
                <TableCell className="tableHeadCell">Equipo</TableCell>
                <TableCell className="tableHeadCell">Estado</TableCell>
                <TableCell className="tableHeadCell">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordenes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay órdenes de reparación pendientes
                  </TableCell>
                </TableRow>
              ) : (
                ordenes.map((orden) => (
                  <TableRow key={orden.id_orden}>
                    <TableCell>{orden.id_orden}</TableCell>
                    <TableCell>{orden.cliente_nombre}</TableCell>
                    <TableCell>{orden.nombre_equipo || 'Sin equipo'}</TableCell>
                    <TableCell>{orden.estado}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        className="actionButton"
                        onClick={() => verOrden(orden.id_orden)}
                      >
                        Ver
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        className="actionButton"
                        onClick={() => confirmarEliminar(orden.id_orden)}
                      >
                        Borrar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalle de Orden #{ordenSeleccionada?.id_orden}</DialogTitle>
        <DialogContent dividers className="dialogContent">
          {ordenSeleccionada && (
            <>
              <Typography variant="h6" gutterBottom>Datos del cliente</Typography>
              <Typography><strong>Nombre:</strong> {ordenSeleccionada.cliente_nombre}</Typography>
              <Typography><strong>Cédula:</strong> {ordenSeleccionada.cedula}</Typography>
              <Typography><strong>Teléfono:</strong> {ordenSeleccionada.telefono || 'No registrado'}</Typography>
              <Typography><strong>Correo:</strong> {ordenSeleccionada.correo || 'No registrado'}</Typography>

              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>Datos del equipo</Typography>
              <Typography><strong>Equipo:</strong> {ordenSeleccionada.nombre_equipo || 'Sin equipo'}</Typography>
              <Typography><strong>Marca/Modelo:</strong> {ordenSeleccionada.marca} {ordenSeleccionada.modelo}</Typography>
              <Typography>
                <strong>Fecha de ingreso:</strong> {formatearFecha(ordenSeleccionada.fecha)}
              </Typography>
              <Typography><strong>Estado:</strong> {ordenSeleccionada.estado}</Typography>

              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>Reparaciones</Typography>
              {ordenSeleccionada.reparaciones.map((r, i) => (
                <Typography key={i}>
                  • {r.nombre} - Mano de obra: ${parseFloat(r.precio_mano_obra).toFixed(2)}
                </Typography>
              ))}

              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>Repuestos utilizados</Typography>
              {ordenSeleccionada.repuestos_usados.length > 0 ? (
                ordenSeleccionada.repuestos_usados.map((rep, i) => (
                  <Typography key={i}>
                    • {rep.nombre} x{rep.cantidad} - ${parseFloat(rep.precio).toFixed(2)} c/u
                  </Typography>
                ))
              ) : (
                <Typography color="text.secondary">Ningún repuesto registrado</Typography>
              )}

              <Box sx={{ mt: 4, borderTop: '2px solid #000', pt: 2 }}>
                <Typography align="right"><strong>Mano de obra:</strong> ${ordenSeleccionada.total_mano_obra}</Typography>
                <Typography align="right"><strong>Repuestos:</strong> ${ordenSeleccionada.total_repuestos}</Typography>
                <Typography align="right" variant="h5" fontWeight="bold">
                  Total: ${ordenSeleccionada.total_general}
                </Typography>
              </Box>

              {ordenSeleccionada.comentario_tecnico && (
                <>
                  <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>Comentario técnico</Typography>
                  <Typography>{ordenSeleccionada.comentario_tecnico}</Typography>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>¿Eliminar orden?</DialogTitle>
        <DialogContent>
          <Typography>Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button color="error" onClick={eliminarOrden}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}