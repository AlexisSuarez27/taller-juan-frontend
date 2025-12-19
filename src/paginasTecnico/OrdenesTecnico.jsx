import { useState, useEffect } from "react";
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Select, MenuItem, Button, Chip, Box, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Divider, List, ListItem, ListItemText
} from "@mui/material";
import axios from "../setupAxios";
import '../styles/pageLayout.css';
import '../styles/components.css';

export default function OrdenesTecnico() {
  const [ordenes, setOrdenes] = useState([]);
  const [open, setOpen] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    try {
      const res = await axios.get("/tecnico/ordenes");
      setOrdenes(res.data);
    } catch (err) {
      alert("Error al cargar las órdenes asignadas");
    }
  };

  const cambiarEstado = (index, nuevoEstado) => {
    const copia = [...ordenes];
    copia[index].estado = nuevoEstado;
    setOrdenes(copia);
  };

  const cambiarComentario = (index, texto) => {
    const copia = [...ordenes];
    copia[index].comentario_tecnico = texto;
    setOrdenes(copia);
  };

  const guardarCambios = async (id_orden, estado, comentario) => {
    try {
      await axios.put(`/tecnico/ordenes/${id_orden}`, { estado, comentario_tecnico: comentario || "" });
      alert("Cambios guardados correctamente");
      if (estado === "Finalizada") cargarOrdenes();
    } catch (err) {
      alert("Error al guardar: posiblemente no hay suficiente stock de repuestos.");
    }
  };

  const verDetalle = (orden) => {
    setOrdenSeleccionada(orden);
    setOpen(true);
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
          Mis Órdenes de Reparación
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Aquí ves todas las órdenes que te han sido asignadas.
        </Typography>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead className="tableHead">
              <TableRow>
                <TableCell className="tableHeadCell">#</TableCell>
                <TableCell className="tableHeadCell">Cliente</TableCell>
                <TableCell className="tableHeadCell">Equipo</TableCell>
                <TableCell className="tableHeadCell">Reparaciones</TableCell>
                <TableCell className="tableHeadCell">Estado</TableCell>
                <TableCell className="tableHeadCell">Comentario</TableCell>
                <TableCell className="tableHeadCell">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordenes.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center">No tienes órdenes pendientes</TableCell></TableRow>
              ) : (
                ordenes.map((orden, index) => (
                  <TableRow key={orden.id_orden} hover>
                    <TableCell>{orden.id_orden}</TableCell>
                    <TableCell>{orden.cliente_nombre}</TableCell>
                    <TableCell>
                      <strong>{orden.nombre_equipo}</strong><br />
                      <small>{orden.marca} {orden.modelo}</small>
                    </TableCell>
                    <TableCell>
                      <List dense disablePadding>
                        {orden.reparaciones.map((r) => (
                          <ListItem key={r.id_reparacion} disablePadding sx={{ py: 0 }}>
                            <ListItemText primary={r.nombre} secondary={`$${r.precio_mano_obra}`} />
                          </ListItem>
                        ))}
                      </List>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={orden.estado}
                        className={
                          orden.estado === "Finalizada" ? "chipSuccess" :
                          orden.estado === "En reparación" ? "chipWarning" : "chipDefault"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Escribe tu comentario..."
                        value={orden.comentario_tecnico || ""}
                        onChange={(e) => cambiarComentario(index, e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Button variant="outlined" size="small" onClick={() => verDetalle(orden)}>
                          Ver Detalle
                        </Button>
                        <Select
                          size="small"
                          value={orden.estado || "Recibido"}
                          onChange={(e) => cambiarEstado(index, e.target.value)}
                        >
                          <MenuItem value="Recibido">Recibido</MenuItem>
                          <MenuItem value="En reparación">En reparación</MenuItem>
                          <MenuItem value="Finalizada">Finalizada</MenuItem>
                        </Select>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => guardarCambios(orden.id_orden, orden.estado, orden.comentario_tecnico)}
                        >
                          Guardar
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Detalle de Orden #{ordenSeleccionada?.id_orden}</DialogTitle>
          <DialogContent dividers className="dialogContent">
            {ordenSeleccionada && (
              <>
                <Typography variant="h6">Cliente</Typography>
                <Typography><strong>Nombre:</strong> {ordenSeleccionada.cliente_nombre}</Typography>
                <Typography><strong>Teléfono:</strong> {ordenSeleccionada.telefono || 'No registrado'}</Typography>
                <Typography><strong>Correo:</strong> {ordenSeleccionada.correo || 'No registrado'}</Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Equipo</Typography>
                <Typography><strong>{ordenSeleccionada.nombre_equipo}</strong> ({ordenSeleccionada.marca} {ordenSeleccionada.modelo})</Typography>
                <Typography>
                  <strong>Fecha de ingreso:</strong> {formatearFecha(ordenSeleccionada.fecha)}
                </Typography>
                <Typography><strong>Estado actual:</strong> {ordenSeleccionada.estado}</Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Reparaciones a realizar</Typography>
                {ordenSeleccionada.reparaciones.map((r) => (
                  <Typography key={r.id_reparacion}>• {r.nombre} → ${r.precio_mano_obra}</Typography>
                ))}

                {ordenSeleccionada.repuestos_usados.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mt: 2 }}>Repuestos necesarios</Typography>
                    {ordenSeleccionada.repuestos_usados.map((rep) => (
                      <Typography key={rep.id_repuesto}>
                        • {rep.nombre} x{rep.cantidad} → ${rep.precio}
                      </Typography>
                    ))}
                  </>
                )}

                {ordenSeleccionada.comentario_tecnico && (
                  <>
                    <Typography variant="h6" sx={{ mt: 3 }}>Tu comentario</Typography>
                    <Typography>{ordenSeleccionada.comentario_tecnico}</Typography>
                  </>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} variant="contained">Cerrar</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}