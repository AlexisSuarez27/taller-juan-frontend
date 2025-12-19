import { useState, useEffect } from "react";
import {
  Box, Paper, Typography, TextField, Button, Grid,
  Select, MenuItem, FormControl, InputLabel, Chip, Checkbox,
  ListItemText, OutlinedInput} from "@mui/material";
import axios from "../setupAxios";
import { useNavigate } from "react-router-dom";
import '../styles/pageLayout.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
      width: 320,
    },
  },
};

export default function RegistrarOrden() {
  const [formData, setFormData] = useState({
    nombre_cliente: "", cedula: "", telefono: "", correo: "",
    nombre_equipo: "", marca: "", modelo: "",
    reparaciones: [], repuestos_extras: [], fecha: ""
  });
  const [reparacionesList, setReparacionesList] = useState([]);
  const [repuestosList, setRepuestosList] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/reparaciones").then(res => setReparacionesList(res.data));
    axios.get("/repuestos").then(res => setRepuestosList(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleReparacionesChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      reparaciones: typeof value === "string" ? value.split(",") : value
    });
  };

  const handleRepuestosChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      repuestos_extras: typeof value === "string" ? value.split(",") : value
    });
  };

  const validateForm = () => {
    let temp = {};
    if (!formData.nombre_cliente.trim()) temp.nombre_cliente = "Obligatorio";
    if (!formData.cedula.trim()) temp.cedula = "Obligatorio";
    if (!formData.fecha) temp.fecha = "Obligatorio";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const dataToSend = {
      ...formData,
      repuestos_extras: formData.repuestos_extras.map(id => ({
        id_repuesto: parseInt(id),
        cantidad: 1
      }))
    };

    try {
      await axios.post("/ordenes", dataToSend);
      alert("Orden registrada con éxito");
      navigate("/admin/ordenes");
    } catch (err) {
      alert(err.response?.data?.msg || "Error al registrar");
    }
  };

  return (
    <Box className="pageContainer">
      <Paper className="mainPaper">
        <Typography variant="h4" className="pageTitle">
          Registrar orden de reparación o venta de repuestos
        </Typography>

        <Typography variant="h6" sx={{ mb: 2 }}>Datos del cliente</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre del cliente *"
              name="nombre_cliente"
              value={formData.nombre_cliente}
              onChange={handleChange}
              error={!!errors.nombre_cliente}
              helperText={errors.nombre_cliente}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cédula *"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              error={!!errors.cedula}
              helperText={errors.cedula}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Correo" name="correo" type="email" value={formData.correo} onChange={handleChange} />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Datos del equipo (opcional)</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nombre del equipo"
              name="nombre_equipo"
              value={formData.nombre_equipo}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Marca" name="marca" value={formData.marca} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Modelo" name="modelo" value={formData.modelo} onChange={handleChange} />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Tipo de reparación (opcional)</Typography>
        <FormControl fullWidth>
          <InputLabel>Seleccionar tipos de reparación</InputLabel>
          <Select
            multiple
            value={formData.reparaciones}
            onChange={handleReparacionesChange}
            input={<OutlinedInput label="Seleccionar tipos de reparación" />}
            MenuProps={MenuProps}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selected.map(value => {
                  const rep = reparacionesList.find(r => r.id_reparacion === value);
                  return <Chip key={value} label={rep?.nombre} />;
                })}
              </Box>
            )}
          >
            {reparacionesList.map(rep => (
              <MenuItem key={rep.id_reparacion} value={rep.id_reparacion}>
                <Checkbox checked={formData.reparaciones.includes(rep.id_reparacion)} />
                <ListItemText primary={rep.nombre} secondary={`$${rep.precio_mano_obra}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Repuestos extras (opcional)</InputLabel>
          <Select
            multiple
            value={formData.repuestos_extras}
            onChange={handleRepuestosChange}
            input={<OutlinedInput label="Repuestos extras (opcional)" />}
            MenuProps={MenuProps}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selected.map(value => {
                  const rep = repuestosList.find(r => r.id_repuesto === value);
                  return <Chip key={value} label={rep?.nombre} />;
                })}
              </Box>
            )}
          >
            {repuestosList.map(rep => (
              <MenuItem key={rep.id_repuesto} value={rep.id_repuesto}>
                <Checkbox checked={formData.repuestos_extras.includes(rep.id_repuesto)} />
                <ListItemText primary={rep.nombre} secondary={`$${rep.precio} | Stock: ${rep.stock}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid item xs={12} md={6} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Fecha *"
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={!!errors.fecha}
            helperText={errors.fecha}
          />
        </Grid>

        <Box sx={{ mt: 5, textAlign: "right" }}>
          <Button variant="contained" size="large" onClick={handleSubmit}>
            Registrar orden
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}