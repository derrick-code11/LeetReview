import { Box, Button, Typography, Grid, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Logo from "../assets/app-logo.png";

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMediumOrLarger = useMediaQuery(theme.breakpoints.up("md"));

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "row",
        backgroundColor: "#ffffff", // or #F6F5F2
        position: "relative",
      }}
    >
      <Box
        component="img"
        src={Logo}
        alt="Logo"
        sx={{
          position: "absolute",
          top: -100,
          left: -40,
          width: "350px",
          height: "350px",
        }}
      />
      <Grid container sx={{ flexGrow: 1 }}>
        {isMediumOrLarger && (
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              backgroundColor: "ghostwhite",
              color: "#00000",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "semi-bold", textAlign: "center" }}
            >
              Track and Review
            </Typography>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "semi-bold", textAlign: "center" }}
            >
              Your LeetCode Problems
            </Typography>
          </Grid>
        )}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            backgroundColor: isMediumOrLarger ? "#FFE8C8" : "ghostwhite",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 4,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ color: "#00000", marginBottom: 2, fontWeight: "semi-bold" }}
          >
            Get started
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              sx={{ width: "100px", borderRadius: "20px" }}
            >
              Log in
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignup}
              sx={{
                width: "100px",
                borderRadius: "20px",
              }}
            >
              Sign up
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
