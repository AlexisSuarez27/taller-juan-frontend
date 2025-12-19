import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../setupAxios";
import logo from "../imagen/logo_Taller.jpeg";
import '../styles/login.css';

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!usuario.trim()) tempErrors.usuario = "El campo usuario es obligatorio.";
    if (!password.trim()) tempErrors.password = "La contraseña es obligatoria.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      const res = await axios.post("/auth/login", { usuario, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("rol", res.data.rol);
      if (res.data.rol === "admin") navigate("/admin");
      else if (res.data.rol === "tecnico") navigate("/tecnico");
    } catch (err) {
      const msg = err.response?.data?.msg || "Credenciales inválidas";
      alert(msg);
    }
  };

  return (
    <Box className="loginContainer">
      <Paper className="loginPaper">
        <Box className="loginLeft">
          <Box component="img" src={logo} alt="Logo Taller Juan" className="loginLogo" />
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            Taller Juan
          </Typography>
        </Box>
        <Box className="loginRight">
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
            Iniciar Sesión
          </Typography>
          <TextField
            fullWidth label="Usuario" variant="outlined" sx={{ mb: 2 }}
            value={usuario} onChange={(e) => { setUsuario(e.target.value); if (errors.usuario) setErrors({ ...errors, usuario: "" }); }}
            error={!!errors.usuario} helperText={errors.usuario}
          />
          <TextField
            fullWidth label="Contraseña" type="password" variant="outlined" sx={{ mb: 3 }}
            value={password} onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: "" }); }}
            error={!!errors.password} helperText={errors.password}
          />
          <Button variant="contained" fullWidth className="loginButton" onClick={handleLogin}>
            Iniciar Sesión
          </Button>
          <Typography className="clientLink">
            ¿Eres cliente? <a href="/cliente">Consultar reparación</a>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}