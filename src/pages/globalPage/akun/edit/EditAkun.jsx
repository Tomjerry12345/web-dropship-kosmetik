import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { useHistory } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { IconButton } from "@material-ui/core";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../services/FirebaseApp";
import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  progress: {
    marginTop: theme.spacing(2),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function EditAkun() {
  const classes = useStyles();
  const history = useHistory();

  const dispatch = useDispatch();
  const { dataUsers } = useSelector((state) => state);

  const [state, setState] = useState({
    namaLengkap: dataUsers.namaLengkap,
    email: dataUsers.email,
    password: dataUsers.password,
    jenisKelamin: dataUsers.jenisKelamin,
    jenisAkun: dataUsers.jenisAkun,
    noHp: dataUsers.noHp,
    alamat: dataUsers.alamat,
    gambar: dataUsers.gambar,
  });

  const { namaLengkap, email, password, jenisKelamin, jenisAkun, noHp, alamat, gambar } = state;
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [btnClick, setBtnClick] = useState();

  console.log(`test`)

  useEffect(() => {
    console.log(`state => ${JSON.stringify(state)}`);
    if (btnClick !== undefined) updateUsers();
  }, [btnClick]);

  useEffect(() => {
    setPreview(gambar);
  }, []);

  const onClickSignUp = () => {
    setState({
      ...state,
      noHp: noHp.replace("0", "+62"),
    });
    console.log("state: ", state);
    setClick(true);

    console.log(`gambar => ${Object.keys(gambar).length === 0}`);

    if (Object.keys(gambar).length === 0) {
      if (namaLengkap !== "" && email !== "" && password !== "" && jenisKelamin !== "" && jenisAkun !== "" && noHp !== "" && alamat !== "") imageUpload();
      else {
        setMsg("Form tidak boleh kosong");
        setOpen(true);
      }
    } else {
      if (namaLengkap !== "" && email !== "" && password !== "" && jenisKelamin !== "" && jenisAkun !== "" && noHp !== "" && alamat !== "") setBtnClick(!btnClick);
      else {
        setMsg("Form tidak boleh kosong");
        setOpen(true);
      }
    }
  };

  const updateUsers = () => {
    console.log(state);
    axios
      .put(`http://localhost:4000/users/update/${email}`, { state })
      .then((res) => {
        console.log(res.data.data.jenisKelamin);
        dispatch({ type: "UPDATE_USERS", payload: res.data.data });
        history.push("/akun");
      })
      .catch((err) => {
        const errorMessage = err.message;
        console.log("errorMessage: ", errorMessage);
        setMsg(errorMessage);
        setOpen(true);
      });
  };

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

  let colorText, styleImage;
  if (preview === null) {
    colorText = "black";
    styleImage = {
      background: "#0222",
      width: "50%",
      height: "200px",
      margin: "auto",
    };
  } else {
    styleImage = {
      background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${preview})`,
      width: "50%",
      height: "200px",
      backgroundPosition: "center",
      backgroundSize: "cover",
      margin: "auto",
    };
    colorText = "white";
  }

  const onSetImage = (e) => {
    // setImage("https://cf.shopee.co.id/file/ad052b9d10bad4bf49a3f146dfcae953");
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    setState({
      ...state,
      gambar: file,
    });
  };

  const imageUpload = () => {
    setLoading(true);
    const date = new Date();
    const imageRef = ref(storage, "images/users/" + date.getMilliseconds() + ".jpg");
    uploadBytesResumable(imageRef, state.gambar)
      .then((snapshot) => {
        console.log("Uploaded", snapshot.totalBytes, "bytes.");
        console.log("File metadata:", snapshot.metadata);
        getDownloadURL(snapshot.ref).then((url) => {
          console.log("File available at", url);
          setState({
            ...state,
            gambar: url,
          });
          setBtnClick(!btnClick);
        });

        setLoading(true);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Upload failed", error);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Edit Akun
        </Typography>
        {loading && (
          <Box sx={{ display: "flex" }} className={classes.progress}>
            <CircularProgress />
          </Box>
        )}
        <form className={classes.form}>
          <Grid container justifyContent="center">
            <Grid
              item
              xs={12}
              style={{
                height: "70%",
              }}
            >
              <Grid container direction="column" alignItems="center" style={styleImage} justifyContent="center">
                <Grid item>
                  <input accept="image/*" id="icon-button-file" type="file" hidden onChange={(e) => onSetImage(e)} />
                  <label htmlFor="icon-button-file">
                    <IconButton component="span">
                      <AddPhotoAlternateIcon fontSize="large" style={{ color: `${colorText}` }} />
                    </IconButton>
                  </label>
                </Grid>
                <Grid item>
                  <Typography title={"Tambah Foto"} variant="subtitle" style={{ color: `${colorText}` }} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ marginTop: "20px" }}>
              <TextField
                helperText={namaLengkap === "" ? "Nama Lengkap tidak boleh kosong" : ""}
                error={namaLengkap === "" && click ? true : false}
                value={namaLengkap}
                name="namaLengkap"
                variant="outlined"
                required
                fullWidth
                onChange={onHandledChanged}
              />
            </Grid>

            <Grid item xs={12} style={{ marginTop: "10px" }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Jenis Kelamin</FormLabel>
                <RadioGroup name="jenisKelamin" value={jenisKelamin} onChange={onHandledChanged}>
                  <FormControlLabel value="perempuan" control={<Radio />} label="Perempuan" />
                  <FormControlLabel value="laki-Laki" control={<Radio />} label="Laki-Laki" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} style={{ marginTop: "10px" }}>
              <TextField value={noHp} helperText={noHp === "" ? "No hp tidak boleh kosong dan " : ""} error={noHp === "" && click ? true : false} variant="outlined" required fullWidth name="noHp" type="number" onChange={onHandledChanged} />
            </Grid>
            <Grid item xs={12} style={{ marginTop: "10px" }}>
              <TextField value={alamat} helperText={alamat === "" ? "Alamat tidak boleh kosong" : ""} error={alamat === "" && click ? true : false} name="alamat" variant="outlined" required fullWidth onChange={onHandledChanged} />
            </Grid>
          </Grid>
          <Button fullWidth variant="contained" color="primary" className={classes.submit} onClick={onClickSignUp}>
            Selesai
          </Button>
        </form>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {msg}
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
}
