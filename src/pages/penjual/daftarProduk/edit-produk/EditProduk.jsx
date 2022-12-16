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
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import { IconButton } from "@material-ui/core";
import { storage } from "../../../../services/FirebaseApp";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

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

export default function EditProduk() {
  const classes = useStyles();
  const history = useHistory();
  const { data, id } = history.location.state;
  const { dataUsers } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [btnClick, setBtnClick] = useState();

  const [state, setState] = useState({
    namaProduk: data.namaProduk,
    jenisProduk: data.jenisProduk,
    harga: data.harga,
    stok: data.stok,
    gambar: data.gambar,
    email: dataUsers.email,
    namaToko: data.namaToko,
    alamat: data.alamat,
  });

  const { namaProduk, jenisProduk, harga, stok, gambar, namaToko, alamat } = state;
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState(null);
  const [clickImage, setClickImage] = useState(false);

  useEffect(() => {
    console.log("data => ", data);
    console.log("id => ", id);
    if (btnClick !== undefined) editAxios();
    if (gambar !== "") {
      setPreview(gambar);
    }
  }, [btnClick]);

  const onEdit = () => {
    setClick(true);

    if (namaProduk !== "" && jenisProduk !== "" && harga !== "" && stok !== "") {
      if (!clickImage) {
        console.log(`gambar ada`)
         setBtnClick(!btnClick);
      } else {
        console.log(`new gambar`)
        imageUpload();
      }
      
    } else {
      setMsg(`Form tidak boleh kosong`);
      setOpen(true);
    }
  };

  const editAxios = () => {
    console.log("id => ", id);
    console.log(state);
    axios
      .put(`http://localhost:4000/produk/update/${id}`, state)
      .then((res) => {
        history.push("/");
      })
      .catch((err) => {
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

  const imageUpload = () => {
    setLoading(true);
    const imageRef = ref(storage, "images/produk/" + Date.now() + ".jpg");
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

  const onSetImage = (e) => {
    // setImage("https://cf.shopee.co.id/file/ad052b9d10bad4bf49a3f146dfcae953");
    setClickImage(true)
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
          Edit produk
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
                value={namaProduk}
                onChange={onHandledChanged}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField value={namaToko} helperText={namaToko === "" ? "Nama toko tidak boleh kosong" : ""} error={namaToko === "" && click ? true : false} name="namaToko" variant="outlined" required fullWidth onChange={onHandledChanged} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="filled" className={classes.formControl}>
                <InputLabel>Jenis produk</InputLabel>
                <Select name="jenisProduk" value={jenisProduk} onChange={onHandledChanged}>
                  <MenuItem value={"dekoratif "}>Dekoratif</MenuItem>
                  <MenuItem value={"perawatan"}>Perawatan</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField value={harga} helperText={harga === "" ? "Harga tidak boleh kosong" : ""} error={harga === "" && click ? true : false} variant="outlined" required fullWidth name="harga" type="number" onChange={onHandledChanged} />
            </Grid>
            <Grid item xs={12}>
              <TextField value={stok} helperText={stok === "" ? "Stok tidak boleh kosong" : ""} error={stok === "" && click ? true : false} variant="outlined" required fullWidth name="stok" type="number" onChange={onHandledChanged} />
            </Grid>
            <Grid item xs={12}>
              <TextField helperText={alamat === "" ? "Alamat tidak boleh kosong" : ""} error={stok === "" && click ? true : false} variant="outlined" required fullWidth name="alamat" onChange={onHandledChanged} value={alamat} />
            </Grid>
          </Grid>
          <Button fullWidth variant="contained" color="primary" className={classes.submit} onClick={onEdit}>
            Edit
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
