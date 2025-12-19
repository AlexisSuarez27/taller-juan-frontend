import { Box, Paper, Typography, TextField, Button, Divider } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/pageLayout.css';

export default function Configuracion() {
  const navigate = useNavigate();
  const [taller] = useState({
    nombre: "Taller Juan",
    telefono: "0922864719",
    correo: "tallerjuan@gmail.com",
    direccion: "Guayaquil, Ecuador"
  });

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box className="pageContainer">
      <Paper className="mainPaper" sx={{ maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" className="pageTitle">
          Configuración
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>Datos del taller</Typography>
        <TextField fullWidth margin="dense" label="Nombre del taller" value={taller.nombre} InputProps={{ readOnly: true }} />
        <TextField fullWidth margin="dense" label="Teléfono" value={taller.telefono} InputProps={{ readOnly: true }} />
        <TextField fullWidth margin="dense" label="Correo" value={taller.correo} InputProps={{ readOnly: true }} />
        <TextField fullWidth margin="dense" label="Dirección" value={taller.direccion} InputProps={{ readOnly: true }} />
        <Divider sx={{ my: 4 }} />
        <Button variant="contained" color="error" fullWidth onClick={cerrarSesion}>
          Cerrar sesión
        </Button>
      </Paper>
    </Box>
  );
}