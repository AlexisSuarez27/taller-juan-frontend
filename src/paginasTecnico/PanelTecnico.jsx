import { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BuildIcon from "@mui/icons-material/Build";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import axios from "../setupAxios";
import '../styles/pageLayout.css';

export default function PanelTecnico() {
  const [stats, setStats] = useState({
    totalAsignadas: 0,
    enReparacion: 0,
    recibidas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/tecnico/ordenes")
      .then((res) => {
        const ordenes = res.data;
        const enReparacion = ordenes.filter(o => o.estado === "En reparación").length;
        const recibidas = ordenes.filter(o => o.estado === "Recibido").length;
        setStats({
          totalAsignadas: ordenes.length,
          enReparacion,
          recibidas
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box className="pageContainer">
      <Typography variant="h4" className="pageTitle">
        Panel del Técnico
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Bienvenido. Aquí tienes un resumen de tus órdenes actuales.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: "center", height: "100%" }} elevation={4}>
            <AssignmentIcon color="primary" sx={{ fontSize: 60 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>Total Asignadas</Typography>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {stats.totalAsignadas}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: "center", height: "100%" }} elevation={4}>
            <BuildIcon color="warning" sx={{ fontSize: 60 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>En Reparación</Typography>
            <Typography variant="h3" fontWeight="bold" color="warning.main">
              {stats.enReparacion}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: "center", height: "100%" }} elevation={4}>
            <DoneAllIcon color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>Pendientes por Iniciar</Typography>
            <Typography variant="h3" fontWeight="bold" color="success.main">
              {stats.recibidas}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}