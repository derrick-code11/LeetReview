import { useState } from "react";
import { auth } from "../services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

const RequestResetLink = () => {
  const [email, setEmail] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleRequestReset = async () => {
    const actionCodeSettings = {
      url: 'http://localhost:5173/login',
      handleCodeInApp: true,
    };
    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setSnackbarMessage("Reset link sent to your email.");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error sending reset link:", error);
      setSnackbarMessage(error.message || "An error occurred");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  return (
    <Container maxWidth="xs">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Request Password Reset
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleRequestReset}
        >
          Send Reset Link
        </Button>
      </Box>
    </Container>
  );
};

export default RequestResetLink;
