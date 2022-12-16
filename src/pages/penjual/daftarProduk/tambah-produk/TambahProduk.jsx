import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import { useHistory } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import { IconButton } from "@material-ui/core";
import { storage } from "../../../../services/FirebaseApp";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
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
  formControl: {
    minWidth: 120,
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function TambahProduk() {
  const classes = useStyles();
  const history = useHistory();
  const { dataUsers } = useSelector((state) => state);
  const [btnClick, setBtnClick] = useState();

  const [state, setState] = useState({
    namaToko: "",
    namaProduk: "",
    jenisProduk: "",
    harga: "",
    stok: "",
    gambar: "",
    alamat: dataUsers.alamat,
    email: dataUsers.email,
    namaPenjual: dataUsers.namaLengkap
  });

  useEffect(() => {
    if (btnClick !== undefined) postAxios();
  }, [btnClick]);

  const { namaProduk, jenisProduk, harga, stok, alamat, namaToko } = state;
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  let colorText, styleImage;
  if (preview === null) {
    colorText = "black";
    styleImage = {
      background: "#0222",
      width: "50%",
    };
  } else {
    styleImage = {
      background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${preview})`,
      width: "50%",
      backgroundPosition: "center",
      backgroundSize: "cover",
    };
    colorText = "white";
  }

  const onTambah = () => {
    setClick(true);

    if (namaProduk !== "" && jenisProduk !== "" && harga !== "" && stok !== "") {
      imageUpload();
    } else {
      setMsg(`Form tidak boleh kosong ${jenisProduk}`);
      setOpen(true);
    }
  };

  const imageUpload = () => {
    setLoading(true);
    const imageRef = ref(storage, "images/produk/" + state.gambar.name);
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
        setLoading(true);
        console.error("Upload failed", error);
      });
  };

  const postAxios = () => {
    axios
      .post("http://localhost:4000/produk/add", {
        state,
      })
      .then((res) => {
        history.push("/");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
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

  const onSetImage = (e) => {
    // setImage("https://cf.shopee.co.id/file/ad052b9d10bad4bf49a3f146dfcae953");
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    setState({
      ...state,
      gambar: file,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Tambah produk
        </Typography>
        {loading && (
          <Box sx={{ display: "flex" }} className={classes.progress}>
            <CircularProgress />
          </Box>
        )}
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container justifyContent="center">
                <Grid container direction="column" alignItems="center" justifyContent="center" style={styleImage}>
                  <input accept="image/*" id="icon-button-file" type="file" hidden onChange={(e) => onSetImage(e)} />
                  <label htmlFor="icon-button-file">
                    <IconButton component="span">
                      <AddPhotoAlternateIcon fontSize="large" style={{ color: `${colorText}` }} />
                    </IconButton>
                  </label>
                  <Typography variant="subtitle1" style={{ color: `${colorText}` }}>
                    Tambah Foto
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                helperText={namaProduk === "" ? "Nama Produk tidak boleh kosong" : ""}
                error={namaProduk === "" && click ? true : false}
                name="namaProduk"
                variant="outlined"
                required
                fullWidth
                label="Nama Produk"
                autoFocus
                onChange={onHandledChanged}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField helperText={namaToko === "" ? "Nama toko tidak boleh kosong" : ""} error={namaToko === "" && click ? true : false} name="namaToko" variant="outlined" required fullWidth label="Nama Toko" onChange={onHandledChanged} />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="filled" className={classes.formControl} fullWidth>
                <InputLabel>Jenis produk</InputLabel>
                <Select name="jenisProduk" value={jenisProduk} onChange={onHandledChanged}>
                  <MenuItem value={"dekoratif "}>Dekoratif</MenuItem>
                  <MenuItem value={"perawatan"}>Perawatan</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField helperText={harga === "" ? "Harga tidak boleh kosong" : ""} error={harga === "" && click ? true : false} variant="outlined" required fullWidth label="Harga" name="harga" type="number" onChange={onHandledChanged} />
            </Grid>
            <Grid item xs={12}>
              <TextField helperText={stok === "" ? "Stok tidak boleh kosong" : ""} error={stok === "" && click ? true : false} variant="outlined" required fullWidth name="stok" label="Stok" type="number" onChange={onHandledChanged} />
            </Grid>
            <Grid item xs={12}>
              <TextField helperText={alamat === "" ? "Alamat tidak boleh kosong" : ""} error={alamat === "" && click ? true : false} variant="outlined" required fullWidth name="alamat" onChange={onHandledChanged} value={alamat} />
            </Grid>
          </Grid>
          <Button fullWidth variant="contained" color="primary" className={classes.submit} onClick={onTambah}>
            Tambah
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
