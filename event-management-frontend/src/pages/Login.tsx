import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error messages

    const { email, password, confirmPassword } = formData;

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long, include uppercase letters, lowercase letters, numbers, and special characters."
      );
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const handleSuccess = () => {
      navigate("/admin");
    };

    const handleError = (error: any) => {
      setErrorMessage("Invalid credentials, please try again.");
      console.error("Login failed:", error);
    };

    const credentials = {
      email,
      password,
      confirmPassword,
    };

    const mutationOptions = {
      onSuccess: handleSuccess,
      onError: handleError,
    };

    if (isRegistering) {
      register.mutate(credentials, {
        ...mutationOptions,
        onSuccess: () => {
          login.mutate(credentials, mutationOptions);
        },
      });
    } else {
      login.mutate(credentials, mutationOptions);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: "50px" }}>
      {errorMessage && <div className="error-popup">{errorMessage}</div>}
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            {isRegistering ? "Register" : "Login"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {isRegistering && (
              <TextField
                fullWidth
                margin="normal"
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "20px" }}
            >
              {isRegistering ? "Register" : "Login"}
            </Button>
            <Grid
              container
              justifyContent="flex-end"
              style={{ marginTop: "10px" }}
            >
              <Grid item>
                <Button
                  onClick={() => setIsRegistering((prev) => !prev)}
                  color="primary"
                >
                  {isRegistering
                    ? "Already have an account? Login"
                    : "Don't have an account? Register"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
