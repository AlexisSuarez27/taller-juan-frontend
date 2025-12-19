import { Box, Paper, Typography } from "@mui/material";
import '../styles/pageLayout.css';

export default function PanelPrincipal() {
  return (
    <Box className="pageContainer">
      <Paper className="mainPaper">
        <Typography variant="h4" className="pageTitle">
          ¡Bienvenido, Juan! 🚗
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tu taller en las mejores manos: las tuyas.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Gestiona las ordenes de tus clientes con eficiencia. ¡Hoy es un gran día para reparar y crecer!
        </Typography>
      </Paper>
    </Box>
  );
}