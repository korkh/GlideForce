import { LockOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/store/configureStore";
import { signInUser } from "./accountSlice";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid, isDirty },
  } = useForm({
    mode: "onTouched",
  });

  async function submitForm(data: FieldValues) {
    try {
      await dispatch(signInUser(data));
      navigate(location.state?.from || "/catalog");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            "url(https://source.unsplash.com/random?snowboard,snowboarding)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(submitForm)}
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
              label="Password"
              type="password"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors?.password?.message as string}
            />
            <LoadingButton
              disabled={!isValid || isSubmitting || !isDirty}
              loading={isSubmitting}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign in
            </LoadingButton>
            <Grid container>
              <Grid item>
                <Link
                  to="/register"
                  style={{ textDecoration: "none", color: "blue" }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>{" "}
      //
    </Grid>
  );
}
