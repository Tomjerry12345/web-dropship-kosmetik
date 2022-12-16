import { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../services/FirebaseApp";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  center: {
    display: "flex",
  },
  progress: {
    marginTop: theme.spacing(2),
  },
}));

const LoginPage = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const { email, password } = state;

  const onLogin = () => {
    console.log(`login => ${JSON.stringify(state)}`);
    setLoading(true);
    login();
  };

  const onRegister = () => {
    history.push("/register");
  };

  const onForgetPassword = () => {
    history.push("/forget-password");
  };

  const login = () =>
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          // localStorage.setItem("login", true);
          history.push("/");
        } else history.push("/verify-login");
      })
      .catch((error) => {
        setLoading(false);
        setMsg(error.message);
        setOpen(true);
      });

  const onHandledChanged = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>{/* <LockOutlinedIcon /> */}</Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {loading && (
          <Box sx={{ display: "flex" }} className={classes.progress}>
            <CircularProgress />
          </Box>
        )}
        <form className={classes.form}>
          <TextField onChange={onHandledChanged} variant="outlined" margin="normal" required fullWidth id="email" label="Email" name="email" autoComplete="email" autoFocus />
          <TextField onChange={onHandledChanged} variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
          <Button onClick={onLogin} fullWidth variant="contained" color="primary" className={classes.submit}>
            Login
          </Button>
          <Grid container justifyContent="center" direction="column" alignItems="center">
            <Link onClick={onForgetPassword} variant="body2">
              Lupa kata sandi ?
            </Link>
            <div>
              <Typography variant="subtitle1">
                Belum punya akun ? <Link onClick={onRegister}>Daftar</Link>
              </Typography>
            </div>
          </Grid>
        </form>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {msg}
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
};

export default LoginPage;
