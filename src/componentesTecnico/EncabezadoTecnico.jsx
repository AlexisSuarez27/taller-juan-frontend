import { AppBar, Toolbar, Typography } from "@mui/material";
import '../styles/headerTecnico.css';

export default function EncabezadoTecnico() {
  return (
    <AppBar position="fixed" className="headerTecnicoAppBar">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sistema Técnico
        </Typography>
      </Toolbar>
    </AppBar>
  );
}