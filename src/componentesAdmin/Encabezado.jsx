import { AppBar, Toolbar, Typography } from "@mui/material";
import '../styles/headerAdmin.css';

export default function Encabezado() {
  return (
    <AppBar position="fixed" className="headerAppBar">
      <Toolbar>
        <Typography variant="h6">
          Sistema Administrativo
        </Typography>
      </Toolbar>
    </AppBar>
  );
}