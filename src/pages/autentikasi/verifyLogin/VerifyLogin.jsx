// @flow
import { Button, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../../../services/FirebaseApp";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(16),
    margin: "auto",
  },
  root: {
    height: "100vh",
  },
}));

export const VerifyLogin = (props) => {
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     console.log("auth: ", auth);
    //     console.log("user: ", user);
    //     console.log("email verifed: ", user.emailVerified);
    //     if (user.emailVerified) {
    //       localStorage.setItem("login", true);
    //       history.push("/");
    //     }
    //   } else {
    //     // User is signed out
    //   }
    // });
  });

  const onKembali = () => {
    history.push("/login");
  };

  return (
    <div>
      <Grid container justifyContent="center" alignItems="center" className={classes.root}>
        <Paper elevation={3} className={classes.paper} align="center">
          <Typography variant="subtitle1">Cek email anda</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onKembali}
            style={{
              marginTop: "10px",
            }}
          >
            Kembali
          </Button>
        </Paper>
      </Grid>
    </div>
  );
};
