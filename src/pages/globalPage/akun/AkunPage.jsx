// @flow
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../services/FirebaseApp";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  root: {
    width: "600px",
  },
  media: {
    height: 250,
    borderRadius: "250px",
    width: 250,
    margin: "auto",
  },
  button: {
    marginTop: theme.spacing(8),
  },
  items: {
    width: "100vw",
  },
}));

export const AkunPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const { dataUsers, showArrow } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "SHOW_ARROW", payload: !showArrow });
  }, []);

  const onLogout = () => {
    // localStorage.setItem("login", false);
    // const response = await signOut(auth);
    signOut(auth)
      .then(() => {
        dispatch({ type: "UPDATE_USERS", payload: {} });
        history.push("/");
        window.location.reload()
      })
      .catch((error) => {
        console.log(`error => ${error}`);
      });
  };

  return (
    <div className={classes.container}>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia className={classes.media} image={dataUsers.gambar} title="Contemplative Reptile" />
          <CardContent>
            <Grid container direction="column">
              <Grid item>
                <Grid container alignItems="center" justifyContent="center" direction="column">
                  <Grid item>
                    <Typography variant="h5" component="h2">
                      {dataUsers.namaLengkap}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      {dataUsers.jenisAkun}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {dataUsers.jenisKelamin}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {dataUsers.alamat}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {dataUsers.noHp}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {dataUsers.email}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Button fullWidth className={classes.button} color="primary" variant="contained" onClick={() => history.push("/edit-akun")}>
                      Edit Profile
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button fullWidth className={classes.button} color="primary" variant="contained" onClick={onLogout}>
                      Logout
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};
