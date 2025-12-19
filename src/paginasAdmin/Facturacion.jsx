import { useState, useEffect, useCallback } from "react";
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Divider, Chip
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "../setupAxios";
import '../styles/pageLayout.css';
import '../styles/components.css';

export default function Facturacion() {
  const [facturas, setFacturas] = useState([]);
  const [open, setOpen] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [filtros, setFiltros] = useState({ desde: "", hasta: "" });

  const cargarFacturas = useCallback(() => {
    const params = new URLSearchParams();
    if (filtros.desde) params.append("desde", filtros.desde);
    if (filtros.hasta) params.append("hasta", filtros.hasta);
    axios.get(`/facturas?${params.toString()}`)
      .then(res => setFacturas(res.data))
      .catch(() => alert("Error al cargar facturas"));
  }, [filtros]);

  useEffect(() => {
    cargarFacturas();
  }, [cargarFacturas]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const verFactura = (factura) => {
    setFacturaSeleccionada(factura);
    setOpen(true);
  };

  const generarPDF = () => {
    if (!facturaSeleccionada) return;

    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 15;
    let yPos = margin;

    doc.setFont("helvetica");
    doc.setFontSize(20);
    doc.setTextColor(25, 118, 210);
    doc.text(`FACTURA N° ${facturaSeleccionada.id_orden}`, margin, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Fecha: ${formatearFecha(facturaSeleccionada.fecha)}`, margin, yPos);
    yPos += 6;

    doc.setTextColor(46, 125, 50);
    doc.text("ESTADO: ENTREGADA", margin, yPos);
    yPos += 12;

    doc.setDrawColor(25, 118, 210);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, 200 - margin, yPos);
    yPos += 8;

    // DATOS DEL CLIENTE
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text("DATOS DEL CLIENTE", margin, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nombre: ${facturaSeleccionada.cliente_nombre}`, margin, yPos);
    yPos += 6;
    doc.text(`Cédula: ${facturaSeleccionada.cedula}`, margin, yPos);
    yPos += 6;
    doc.text(`Teléfono: ${facturaSeleccionada.telefono || 'No registrado'}`, margin, yPos);
    yPos += 6;
    doc.text(`Correo: ${facturaSeleccionada.correo || 'No registrado'}`, margin, yPos);
    yPos += 12;

    // SERVICIOS REALIZADOS
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text("SERVICIOS REALIZADOS", margin, yPos);
    yPos += 10;

    const serviciosData = [];

    if (facturaSeleccionada.reparaciones.length > 0) {
      facturaSeleccionada.reparaciones.forEach((r, index) => {
        serviciosData.push([
          index + 1,
          r.nombre,
          `$${parseFloat(r.precio_mano_obra).toFixed(2)}`
        ]);
      });
    } else if (facturaSeleccionada.repuestos_usados.length > 0) {
      serviciosData.push([
        1,
        "Venta de repuestos",
        `$${parseFloat(facturaSeleccionada.total_repuestos).toFixed(2)}`
      ]);
    }

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Descripción del Servicio', 'Precio']],
      body: serviciosData,
      margin: { left: margin, right: margin },
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [25, 118, 210], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      tableWidth: 'wrap',
      columnStyles: {
        0: { cellWidth: 15 },
        2: { cellWidth: 30, halign: 'right' }
      }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // REPUESTOS - siempre "Repuestos" (sin importar el tipo de orden)
    if (facturaSeleccionada.repuestos_usados.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(25, 118, 210);
      doc.text("REPUESTOS", margin, yPos);  // ← Siempre "REPUESTOS"
      yPos += 10;

      const repuestosData = facturaSeleccionada.repuestos_usados.map((rep, index) => [
        index + 1,
        rep.nombre,
        rep.cantidad,
        `$${parseFloat(rep.precio).toFixed(2)}`,
        `$${(parseFloat(rep.precio) * rep.cantidad).toFixed(2)}`
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['#', 'Repuesto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
        body: repuestosData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [25, 118, 210], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        tableWidth: 'wrap',
        columnStyles: {
          0: { cellWidth: 15 },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 35, halign: 'right' },
          4: { cellWidth: 35, halign: 'right' }
        }
      });

      yPos = doc.lastAutoTable.finalY + 15;
    }

    // TOTALES
    doc.setDrawColor(25, 118, 210);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, 200 - margin, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text("Mano de obra:", 200 - margin - 80, yPos, { align: 'right' });
    doc.text(`$${facturaSeleccionada.total_mano_obra}`, 200 - margin, yPos, { align: 'right' });
    yPos += 8;

    doc.text("Repuestos:", 200 - margin - 80, yPos, { align: 'right' });
    doc.text(`$${facturaSeleccionada.total_repuestos}`, 200 - margin, yPos, { align: 'right' });
    yPos += 12;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 118, 210);
    doc.text("TOTAL GENERAL:", 200 - margin - 80, yPos, { align: 'right' });
    doc.text(`$${facturaSeleccionada.total_general}`, 200 - margin, yPos, { align: 'right' });

    // Comentario técnico
    if (facturaSeleccionada.comentario_tecnico) {
      yPos += 20;
      doc.setFontSize(12);
      doc.setTextColor(25, 118, 210);
      doc.text("COMENTARIO DEL TÉCNICO", margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const comentarioLines = doc.splitTextToSize(facturaSeleccionada.comentario_tecnico, 180 - (margin * 2));
      doc.text(comentarioLines, margin, yPos);
    }

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const fechaGeneracion = new Date().toLocaleString('es-EC');
    doc.text(`Generado el: ${fechaGeneracion}`, margin, 290);
    doc.text(`Página 1 de 1`, 200 - margin, 290, { align: 'right' });

    const nombreArchivo = `Factura_${facturaSeleccionada.id_orden}_${facturaSeleccionada.cliente_nombre.replace(/\s+/g, '_')}.pdf`;
    doc.save(nombreArchivo);
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "Sin fecha";
    return new Date(fechaISO).toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const totalFacturado = facturas.reduce((sum, f) => sum + parseFloat(f.total_general || 0), 0);

  return (
    <Box className="pageContainer">
      <Paper className="mainPaper">
        <Typography variant="h4" className="pageTitle">
          Facturación
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }} alignItems="end">
          <Grid item xs={12} sm={4} md={3}>
            <TextField fullWidth label="Desde" type="date" name="desde" value={filtros.desde} onChange={handleFiltroChange} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField fullWidth label="Hasta" type="date" name="hasta" value={filtros.hasta} onChange={handleFiltroChange} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Button variant="contained" onClick={cargarFacturas} fullWidth>Aplicar Filtro</Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" align="right">
              Total facturado: <strong>${totalFacturado.toFixed(2)}</strong>
            </Typography>
          </Grid>
        </Grid>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead className="tableHead">
              <TableRow>
                <TableCell className="tableHeadCell">Factura #</TableCell>
                <TableCell className="tableHeadCell">Fecha</TableCell>
                <TableCell className="tableHeadCell">Cliente</TableCell>
                <TableCell className="tableHeadCell">Equipo</TableCell>
                <TableCell className="tableHeadCell">Total</TableCell>
                <TableCell className="tableHeadCell">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facturas.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center">No hay facturas finalizadas en el rango seleccionado</TableCell></TableRow>
              ) : (
                facturas.map((factura) => (
                  <TableRow key={factura.id_orden} hover>
                    <TableCell>{factura.id_orden}</TableCell>
                    <TableCell>{formatearFecha(factura.fecha)}</TableCell>
                    <TableCell>{factura.cliente_nombre}<br /><small>{factura.cedula}</small></TableCell>
                    <TableCell>{factura.nombre_equipo}<br /><small>{factura.marca} {factura.modelo}</small></TableCell>
                    <TableCell><strong>${parseFloat(factura.total_general || 0).toFixed(2)}</strong></TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => verFactura(factura)}
                        className="actionButton"
                      >
                        Ver Factura
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal de detalle */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#1976D2", color: "white", py: 3 }}>
          <Typography variant="h5" component="div">
            FACTURA N° {facturaSeleccionada?.id_orden}
          </Typography>
          <Typography variant="subtitle1">
            Fecha: {formatearFecha(facturaSeleccionada?.fecha)}
          </Typography>
          <Chip label="ENTREGADA" color="success" sx={{ mt: 1 }} />
        </DialogTitle>

        <DialogContent dividers className="dialogContent">
          {facturaSeleccionada && (
            <>
              <Typography variant="h6" gutterBottom>Datos del Cliente</Typography>
              <Typography><strong>Nombre:</strong> {facturaSeleccionada.cliente_nombre}</Typography>
              <Typography><strong>Cédula:</strong> {facturaSeleccionada.cedula}</Typography>
              <Typography><strong>Teléfono:</strong> {facturaSeleccionada.telefono || 'No registrado'}</Typography>
              <Typography><strong>Correo:</strong> {facturaSeleccionada.correo || 'No registrado'}</Typography>

              <Divider sx={{ my: 3 }} />

              {/* Solo mostrar equipo si hay reparaciones */}
              {facturaSeleccionada.reparaciones.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>Equipo Reparado</Typography>
                  <Typography>
                    <strong>
                      {facturaSeleccionada.nombre_equipo}
                      {(facturaSeleccionada.marca || facturaSeleccionada.modelo) &&
                        ` (${[facturaSeleccionada.marca, facturaSeleccionada.modelo].filter(Boolean).join(' ')})`
                      }
                    </strong>
                  </Typography>
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Servicios Realizados */}
              <Typography variant="h6" gutterBottom>Servicios Realizados</Typography>
              {facturaSeleccionada.reparaciones.length > 0 ? (
                facturaSeleccionada.reparaciones.map((r, i) => (
                  <Typography key={i}>• {r.nombre} — ${parseFloat(r.precio_mano_obra).toFixed(2)}</Typography>
                ))
              ) : (
                <Typography>• Venta de repuestos — ${facturaSeleccionada.total_repuestos}</Typography>
              )}

              {/* Lista de repuestos - siempre "Repuestos" */}
              {facturaSeleccionada.repuestos_usados.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Repuestos</Typography>
                  {facturaSeleccionada.repuestos_usados.map((rep, i) => (
                    <Typography key={i}>
                      • {rep.nombre} x{rep.cantidad} — ${(parseFloat(rep.precio) * rep.cantidad).toFixed(2)}
                    </Typography>
                  ))}
                </>
              )}

              <Box sx={{ mt: 5, borderTop: "4px solid #1976D2", pt: 3 }}>
                <Typography align="right" variant="h6">Mano de obra: ${facturaSeleccionada.total_mano_obra}</Typography>
                <Typography align="right" variant="h6">Repuestos: ${facturaSeleccionada.total_repuestos}</Typography>
                <Typography align="right" variant="h4" fontWeight="bold" color="primary">
                  TOTAL: ${facturaSeleccionada.total_general}
                </Typography>
              </Box>

              {facturaSeleccionada.comentario_tecnico && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Comentario del Técnico</Typography>
                  <Typography>{facturaSeleccionada.comentario_tecnico}</Typography>
                </>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={generarPDF} color="secondary" variant="contained" startIcon={<PictureAsPdfIcon />}>
            Generar PDF
          </Button>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}