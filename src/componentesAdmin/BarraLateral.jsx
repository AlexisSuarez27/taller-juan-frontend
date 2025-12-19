import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import '../styles/sidebarAdmin.css';

export default function BarraLateral() {
  return (
    <Drawer variant="permanent" anchor="left" className="sidebarDrawer">
      <div className="sidebarPaper">
        <Box className="sidebarHeader">
          <Typography variant="h6" className="sidebarTitle">
            Taller Juan
          </Typography>
          <Typography variant="body2" className="sidebarSubtitle">
            Administración
          </Typography>
        </Box>
        <List className="sidebarList">
          <ListItemButton component={Link} to="/admin">
            <ListItemIcon><DashboardIcon className="sidebarIcon" /></ListItemIcon>
            <ListItemText primary="Panel principal" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/registrar">
            <ListItemIcon><AddCircleIcon className="sidebarIcon" /></ListItemIcon>
            <ListItemText primary="Registrar orden" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/ordenes">
            <ListItemIcon><ListAltIcon className="sidebarIcon" /></ListItemIcon>
            <ListItemText primary="Lista de órdenes" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/facturacion">
            <ListItemIcon><ReceiptLongIcon className="sidebarIcon" /></ListItemIcon>
            <ListItemText primary="Facturación" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/clientes">
            <ListItemIcon><PeopleIcon className="sidebarIcon" /></ListItemIcon>
            <ListItemText primary="Clientes" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/configuracion">
            <ListItemIcon><SettingsIcon className="sidebarIcon" /></ListItemIcon>
            <ListItemText primary="Configuración" />
          </ListItemButton>
        </List>
      </div>
    </Drawer>
  );
}