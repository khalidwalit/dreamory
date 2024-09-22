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

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { login, register } = useAuth(); // Use the custom hook

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      register.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      login.mutate({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: "50px" }}>
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
