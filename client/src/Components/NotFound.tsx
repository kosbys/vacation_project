import { Container, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        paddingTop: "5rem",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" color="primary">
        404
      </Typography>
      <Typography variant="h4">Page not found</Typography>
    </Container>
  );
}
