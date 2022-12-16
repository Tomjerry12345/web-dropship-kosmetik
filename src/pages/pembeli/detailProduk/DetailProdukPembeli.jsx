import { Box, Button, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const useStyle = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),

    // height: "80vh",
    maxHeight: 650,
  },
}));

export const DetailProdukPembeli = () => {
  const history = useHistory();
  const style = useStyle();
  const { dataUsers, refresh, showArrow } = useSelector((state) => state);
  const dispatch = useDispatch();

  const { data, id } = history.location.state;
  const data1 = {
    emailPenjual: data.email,
    emailPembeli: dataUsers.email,
    gambar: data.gambar,
    harga: data.harga,
    jenisProduk: data.jenisProduk,
    namaProduk: data.namaProduk,
    stok: data.stok,
    alamatPenjual: data.alamat,
    idProduk: id,
  };

  useEffect(() => {
    dispatch({ type: "SHOW_ARROW", payload: !showArrow });
    console.log("data => ", data);
    console.log("dataUsers => ", dataUsers)
  }, []);

  const onTambahKeranjang = () => {
    console.log("data1 => ", data1);
    axios
      .post("http://localhost:4000/pemesanan/add", { data1 })
      .then((res) => {
        dispatch({ type: "REFRESH", payload: !refresh });
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChat = () => {
    history.push({
      pathname: "/list-chat",
      showChat: true,
      userReceiver: {
        namaReceiver: data.namaPenjual,
        emailReceiver: data.email,
        // namaLengkapPembeli: dataUsers.namaLengkap,
        // usernamePembeli: dataUsers.email,
      },
    });
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Paper elevation={2} className={style.paper}>
            <Grid container direction="row" justifyContent="center">
              <img width="400" src={data.gambar} alt="gambar" />
            </Grid>
          </Paper>
        </Grid>
        <Grid item md={6} xs={12}>
          <Paper
            style={{
              padding: "16px",
            }}
          >
            <Grid direction="column" container>
              <Grid item>
                <Typography variant="h6" style={{ fontSize: "30px" }}>
                  {data.namaProduk}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" style={{ fontSize: "20px" }}>
                  {`Harga : ${data.harga}`}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" style={{ fontSize: "20px" }}>
                  {`Jenis Produk : ${data.jenisProduk}`}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" style={{ fontSize: "20px" }}>
                  {`Stok Tersedia : ${data.stok}`}
                </Typography>
              </Grid>
              <Grid item >
                <Typography variant="subtitle1" style={{ fontSize: "20px" }}>
                  {`Alamat : ${data.alamat}`}
                </Typography>
              </Grid>
              <Grid item style={{ marginBottom: 40 }}>
                <Typography variant="subtitle1" style={{ fontSize: "20px" }}>
                  {`Nama Toko : ${data.namaToko}`}
                </Typography>
              </Grid>

              <Grid item>
                <Box display="flex" justifyContent="space-evenly">
                  <Button variant="contained" color="primary" onClick={onChat}>
                    Chat Penjual
                  </Button>
                  <Button variant="contained" color="primary" onClick={onTambahKeranjang}>
                    Masukkan ke keranjang
                  </Button>
                  </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
