import { Typography, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Form from "./components/Form";

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <Typography component="h2" variant="h5">
          Dodaj kontrahenta
        </Typography>
        <Form />
      </Container>
    </ThemeProvider>
  );
}
