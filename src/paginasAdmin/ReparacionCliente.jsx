import { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Alert } from "@mui/material";
import axios from "../setupAxios";
import '../styles/pageLayout.css';
import '../styles/components.css';

export default function ReparacionCliente() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [fetchError, setFetchError] = useState("");

  const handleConsultar = async () => {
    if (!query.trim()) {
      setValidationError("Por favor, ingresa el número de orden o la cédula.");
      setResultados([]);
      setFetchError("");
      return;
    }

    setValidationError("");
    setLoading(true);
    setFetchError("");
    setResultados([]);

    try {
      const res = await axios.get(`/public/consulta/${query.trim()}`);
      setResultados(res.data);
    } catch (err) {
      const msg = err.response?.data?.msg || "Error al consultar";
      setFetchError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", pt: 10, background: "linear-gradient(135deg, #e8f3ff 0%, #f5faff 100%)" }}>
      <Paper className="mainPaper" sx={{ width: { xs: "95%", sm: 700 } }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{ mb: 4 }}>
          Consulta el estado de tu reparación
        </Typography>
        <TextField
          label="Número de orden o cédula del cliente"
          fullWidth
          variant="outlined"
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (validationError) setValidationError(""); }}
          onKeyPress={(e) => e.key === "Enter" && handleConsultar()}
          sx={{ mb: 3 }}
          error={!!validationError}
          helperText={validationError}
        />
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleConsultar}
          disabled={loading}
          sx={{ py: 1.5, backgroundColor: "#0B4F9F", "&:hover": { backgroundColor: "#083c7a" } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Consultar"}
        </Button>

        {fetchError && <Alert severity="warning" sx={{ mt: 3 }}>{fetchError}</Alert>}

        {resultados.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Reparaciones encontradas ({resultados.length})
            </Typography>
            <Table>
              <TableHead className="tableHead">
                <TableRow>
                  <TableCell className="tableHeadCell">ID Orden</TableCell>
                  <TableCell className="tableHeadCell">Equipo</TableCell>
                  <TableCell className="tableHeadCell">Marca / Modelo</TableCell>
                  <TableCell className="tableHeadCell">Estado</TableCell>
                  <TableCell className="tableHeadCell">Comentario Técnico</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultados.map((orden) => (
                  <TableRow key={orden.id_orden}>
                    <TableCell>{orden.id_orden}</TableCell>
                    <TableCell>{orden.nombre_equipo}</TableCell>
                    <TableCell>{orden.marca} {orden.modelo}</TableCell>
                    <TableCell>
                      <strong>
                        {orden.estado === "Recibido" && "🕐 Recibido"}
                        {orden.estado === "En reparación" && "🔧 En reparación"}
                        {orden.estado === "Finalizada" && "✅ Finalizada"}
                      </strong>
                    </TableCell>
                    <TableCell>{orden.comentario_tecnico || "Sin comentarios aún"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </Paper>
    </Box>
  );
}