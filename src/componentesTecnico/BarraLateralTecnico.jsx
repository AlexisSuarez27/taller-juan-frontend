import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";
import '../styles/sidebarTecnico.css';

export default function BarraLateralTecnico() {
  return (
    <Drawer variant="permanent" anchor="left" className="sidebarTecnicoDrawer">
      <div className="sidebarTecnicoPaper">
        <Box className="sidebarTecnicoHeader">
          <Typography variant="h6" className="sidebarTecnicoHeaderTitle">
            Taller Juan
          </Typography>
          <Typography variant="body2" className="sidebarTecnicoHeaderSubtitle">
            Técnico
          </Typography>
        </Box>
        <List className="sidebarTecnicoList">
          <ListItemButton component={Link} to="/tecnico">
            <ListItemIcon className="sidebarTecnicoIcon"><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Panel técnico" />
          </ListItemButton>
          <ListItemButton component={Link} to="/tecnico/ordenes">
            <ListItemIcon className="sidebarTecnicoIcon"><ListAltIcon /></ListItemIcon>
            <ListItemText primary="Órdenes asignadas" />
          </ListItemButton>
          <ListItemButton onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
            <ListItemIcon className="sidebarTecnicoIcon"><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </List>
      </div>
    </Drawer>
  );
}