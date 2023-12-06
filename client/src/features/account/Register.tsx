import { LockOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onTouched",
  });

  function handleApiErrors(apiErrors: string[][]) {
    // needs to be both defined and an array for the subsequent logic to execute.
    if (apiErrors && Array.isArray(apiErrors)) {
      apiErrors.forEach((errors: string[]) => {
        errors.forEach((error: string) => {
          if (error.includes("Email")) {
            setError("email", { message: error });
          } else if (error.includes("Username")) {
            setError("username", { message: error });
          } else if (error.includes("Password")) {
            setError("password", { message: error });
          }
        });
      });
    }
  }

  return (
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data) =>
          agent.Account.register(data)
            .then(() => {
              toast.success("Registration successful - you can now login");
              navigate("/login");
            })
            .catch((error) => handleApiErrors(error))
        )}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          label="Username"
          autoFocus
          {...register("username", { required: "Username is required" })}
          error={!!errors.username}
          helperText={errors?.username?.message as string}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Not a valid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors?.email?.message as string}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            pattern: {
              value:
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}[\]:;<>,.?/|\\~-]).{6,20}$/,
              message:
                "Password should contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be 6 to 20 characters long.",
            },
          })}
          error={!!errors.password}
          helperText={errors?.password?.message as string}
        />
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to="/login" style={{ textDecoration: "none" }}>
              {"Already have an account? Sign In"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
