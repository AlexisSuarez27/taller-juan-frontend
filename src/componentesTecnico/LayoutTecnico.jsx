import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import BarraLateralTecnico from "./BarraLateralTecnico";
import EncabezadoTecnico from "./EncabezadoTecnico";
import '../styles/layoutTecnico.css';

export default function LayoutTecnico() {
  return (
    <Box className="layoutTecnicoContainer">
      <BarraLateralTecnico />
      <Box className="layoutTecnicoMain">
        <EncabezadoTecnico />
        <Box component="main" className="layoutTecnicoContent">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}