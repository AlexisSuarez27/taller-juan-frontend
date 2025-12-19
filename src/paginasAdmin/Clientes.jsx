import { useState, useEffect } from "react";
import { Box, Paper, Typography, Table, TableRow, TableCell, TableHead, TableBody } from "@mui/material";
import axios from "../setupAxios";
import '../styles/pageLayout.css';
import '../styles/components.css';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    axios.get("/clientes")
      .then((res) => setClientes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box className="pageContainer">
      <Paper className="mainPaper">
        <Typography variant="h4" className="pageTitle">
          Clientes
        </Typography>
        <Table>
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableHeadCell">Nombre</TableCell>
              <TableCell className="tableHeadCell">Cedula</TableCell>
              <TableCell className="tableHeadCell">Teléfono</TableCell>
              <TableCell className="tableHeadCell">Correo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id_cliente}>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.cedula}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
                <TableCell>{cliente.correo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}