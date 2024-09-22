import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth as useAuthContext } from "../AuthProvider";
import useAuth from "../hooks/useAuth";

const TopNav = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { logout } = useAuth();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = async () => {
    await logout.mutateAsync();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Event Page
        </Typography>
        {user ? (
          <>
            <Button
              color="inherit"
              onClick={() => {
                navigate("/admin");
              }}
            >
              Admin
            </Button>
            <Button color="inherit" onClick={handleLogoutClick}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" onClick={handleLoginClick}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;
