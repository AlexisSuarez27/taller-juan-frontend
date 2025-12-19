import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import BarraLateral from "./componentesAdmin/BarraLateral";
import Encabezado from "./componentesAdmin/Encabezado";

import Login from "./paginasAdmin/Login";
import ReparacionCliente from "./paginasAdmin/ReparacionCliente";
import PanelPrincipal from "./paginasAdmin/PanelPrincipal";
import RegistrarOrden from "./paginasAdmin/RegistrarOrden";
import ListaOrdenes from "./paginasAdmin/ListaOrdenes";
import Clientes from "./paginasAdmin/Clientes";
import Configuracion from "./paginasAdmin/Configuracion";
import Facturacion from "./paginasAdmin/Facturacion";

import PanelTecnico from "./paginasTecnico/PanelTecnico";
import OrdenesTecnico from "./paginasTecnico/OrdenesTecnico";
import LayoutTecnico from "./componentesTecnico/LayoutTecnico";

import ProtectedRoute from "./utils/ProtectedRoute";
import { Box } from "@mui/material";
import './styles/pageLayout.css';

function LayoutAdmin({ children }) {
  return (
    <>
      <BarraLateral />
      <Encabezado />
      <Box
        className="pageContainer"
        sx={{
          marginLeft: "280px",     
          marginTop: "64px",       
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {children}
      </Box>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cliente" element={<ReparacionCliente />} />

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<LayoutAdmin><PanelPrincipal /></LayoutAdmin>} />
          <Route path="/admin/registrar" element={<LayoutAdmin><RegistrarOrden /></LayoutAdmin>} />
          <Route path="/admin/ordenes" element={<LayoutAdmin><ListaOrdenes /></LayoutAdmin>} />
          <Route path="/admin/facturacion" element={<LayoutAdmin><Facturacion /></LayoutAdmin>} />
          <Route path="/admin/clientes" element={<LayoutAdmin><Clientes /></LayoutAdmin>} />
          <Route path="/admin/configuracion" element={<LayoutAdmin><Configuracion /></LayoutAdmin>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["tecnico"]} />}>
          <Route path="/tecnico/*" element={<LayoutTecnico />}>
            <Route index element={<PanelTecnico />} />
            <Route path="ordenes" element={<OrdenesTecnico />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;