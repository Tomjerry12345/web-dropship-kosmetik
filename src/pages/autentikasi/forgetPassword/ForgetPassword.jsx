import { Box, Button, CircularProgress, Container, CssBaseline, Grid, makeStyles, TextField, Typography } from "@material-ui/core";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { auth } from "../../../services/FirebaseApp";

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

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const history = useHistory();

  const [state, setState] = useState({
    email: "",
  });

  const onHandledChanged = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const onSend = () => {
    sendPasswordResetEmail(auth, state.email)
      .then(() => {
        history.push("/verify-login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`error => ${errorMessage}`);
      });
  };

  const onLogin = () => {};

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Lupa Password
        </Typography>
        {loading && (
          <Box sx={{ display: "flex" }} className={classes.progress}>
            <CircularProgress />
          </Box>
        )}
        <form className={classes.form}>
          <TextField onChange={onHandledChanged} variant="outlined" margin="normal" required fullWidth id="email" label="Email" name="email" autoComplete="email" autoFocus />
          <Button onClick={onSend} fullWidth variant="contained" color="primary" className={classes.submit}>
            Kirim
          </Button>
          <Grid container justifyContent="center" direction="column" alignItems="center">
            <Typography variant="subtitle1">
              Kembali ke login ? <Link onClick={onLogin}>Login</Link>
            </Typography>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
