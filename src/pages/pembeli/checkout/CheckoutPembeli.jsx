// @flow
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  rootListProduk: {
    marginBottom: theme.spacing(4),
  },
  textField: {
    width: 50,
  },
  button: {
    height: 55,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  containerSumItems: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  btnCheckout: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

const CheckOutComponent = ({ data, onTotal, index, id }) => {
  const classes = useStyles();
  const { namaProduk, harga, gambar, stok } = data;
  const [jumlahBeli, setJumlahBeli] = useState(0);
  const [checked, setChecked] = useState(false);
  let jumlah, total;

  const onHandleChange = (event) => {
    setChecked(event.target.checked);
    if (!checked) {
      setJumlahBeli(1);
      jumlah = 1;
      total = harga * jumlah;
      onTotal(total, index, jumlah, namaProduk, harga, !checked, null, id);
    } else {
      setJumlahBeli(0);
      onTotal(0, index, jumlah, namaProduk, harga, !checked);
    }
  };

  const onClickTambah = () => {
    console.log(`checked => ${checked}`);
    jumlah = jumlahBeli + 1;
    if (jumlah <= stok) {
      setJumlahBeli(jumlah);
      total = harga * jumlah;
      onTotal(total, index, jumlah, namaProduk, harga, checked, true);
    }
  };

  const onClickKurang = () => {
    jumlah = jumlahBeli - 1;
    if (jumlah < 1) jumlah = 1;
    setJumlahBeli(jumlah);
    total = harga * jumlah;
    onTotal(total, index, jumlah, namaProduk, harga, checked, true);
  };

  return (
    <div className={classes.rootListProduk}>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <Grid container spacing={2}>
            <Grid item>
              <Checkbox
                checked={checked}
                color="primary"
                inputProps={{ "aria-label": "secondary checkbox" }}
                onChange={onHandleChange}
              />
            </Grid>
            <Grid item>
              <img height="100" width="100" src={gambar} alt="Gambar" />
            </Grid>
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Grid container direction="column">
                    <Grid item>
                      <Typography variant="h6">{`Nama Produk : ${namaProduk}`}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">{`Harga : ${harga}`}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container className={classes.containerSumItems}>
                    <Grid item>
                      <Button
                        disabled={!checked}
                        className={classes.button}
                        variant="outlined"
                        onClick={onClickTambah}
                      >
                        +
                      </Button>
                    </Grid>
                    <Grid item>
                      <TextField
                        className={classes.textField}
                        variant="outlined"
                        value={jumlahBeli}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        disabled={!checked}
                        className={classes.button}
                        variant="outlined"
                        onClick={onClickKurang}
                      >
                        -
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
};

export const CheckoutPembeli = () => {
  const classes = useStyles();
  const history = useHistory();

  const dispatch = useDispatch();

  const { dataPemesan, dataUsers, refresh, showArrow, dataProduk } =
    useSelector((state) => state);

  const [total, setTotal] = useState(0);
  const [listPesanan, setListPesanan] = useState([]);
  const [listId, setListId] = useState([]);
  const [listHarga, setListHarga] = useState([0, 0, 0, 0, 0]);
  const [disableBtn, setDisableBtn] = useState(true);
  const [metodePembayaran, setMetodePembayaran] = useState("cod");

  const [alamat, setAlamat] = useState(dataUsers.alamat);

  const [dataRincianPesanan, setDataRincianPesanan] = useState({
    id: "",
    emailPembeli: "",
    emailPenjual: "",
    namaProduk: [],
    jumlah: [],
    harga: [],
    rincian: {},
    statusPengiriman: "Belum Terkirim",
    statusPenerima: "Belum Diterima",
    metodePembayaran: "",
    alamatPembeli: "",
    noResi: "",
  });

  useEffect(() => {
    console.log(`data pemesan => ${JSON.stringify(dataPemesan.id)}`);
    dispatch({ type: "SHOW_ARROW", payload: !showArrow });
    const reducer = (accumulator, curr) => accumulator + curr;
    const totalHarga = listHarga.reduce(reducer);
    setTotal(totalHarga);
    if (totalHarga > 0) setDisableBtn(false);
    else setDisableBtn(true);
    if (Object.entries(dataRincianPesanan.rincian).length !== 0) {
      console.log(`tidak kosong :`);
      console.log(dataRincianPesanan);

      axios
        .post("http://localhost:4000/rincian-pesanan/add", {
          dataRincianPesanan,
        })
        .then((res) => {
          console.log(res);
          listId.map((id, index) => {
            axios
              .delete(`http://localhost:4000/pemesanan/delete/${id}`)
              .then((res) => {
                console.log("res: ", res.data);
                updateStok(dataPemesan.data[index], index);
              })
              .catch((err) => {
                console.log(err);
              });
          });
          dispatch({ type: "REFRESH", payload: !refresh });
        });
    }
  }, [listHarga, dataRincianPesanan]);

  const updateStok = (data, index) => {
    const jumlahBeli = dataRincianPesanan.jumlah[index];
    axios
      .put(`http://localhost:4000/produk/update/oneUpdate/${data.idProduk}`, {
        jumlah: jumlahBeli,
      })
      .then((res) => {
        console.log("res: ", res.data);
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onTotal = (
    total,
    index,
    jumlah,
    namaProduk,
    harga,
    checked,
    btnClick,
    id
  ) => {
    if (total === 0) {
      const list = [];
      listHarga.map((res, i) => {
        if (index === i) res = 0;
        list.push(res);
      });
      setListHarga(list);
    } else {
      const list = [];
      listHarga.map((res, i) => {
        if (index === i) res = total;
        list.push(res);
      });
      setListHarga(list);
    }

    if (checked) {
      console.log(`length => ${listPesanan.length}`);
      if (listPesanan.length == 0) {
        setListPesanan([
          ...listPesanan,
          {
            namaProduk,
            jumlah,
            harga,
          },
        ]);
      } else {
        if (btnClick) {
          const list = [];
          listPesanan.map((data) => {
            if (data.namaProduk === namaProduk) {
              data.jumlah = jumlah;
            }
            list.push(data);
          });
          setListPesanan(list);
        } else {
          setListPesanan([
            ...listPesanan,
            {
              namaProduk,
              jumlah,
              harga,
            },
          ]);
        }
      }

      setListId([...listId, id]);
    } else {
      const list = [];
      const listId1 = [];
      listPesanan.map((res, i) => {
        if (index !== i) list.push(res);
      });
      listId.map((res, i) => {
        if (index !== i) listId1.push(res);
      });
      console.log(`list => ${list}`);
      setListPesanan(list);
      setListId(listId1);
    }
  };

  const onCheckout = () => {
    postAxios();
  };

  const postAxios = () => {
    const namaProduk = [];
    const harga = [];
    const jumlah = [];

    listPesanan.map((data) => {
      namaProduk.push(data.namaProduk);
      harga.push(data.harga);
      jumlah.push(data.jumlah);
    });

    if (metodePembayaran === "digital") {
      axios
        .post("http://localhost:4000/pembayaran/transaction", {
          total,
        })
        .then((res) => {
          console.log(res);
          const urlSnap = res.data.transactionRedirectUrl;
          const transactionToken = res.data.transactionToken;

          window.snap.pay(transactionToken, {
            onSuccess: function (result) {
              alert("payment success!");
              console.log(result);
            },
            onPending: function (result) {
              alert("wating your payment!");
              console.log(result);

              setDataRincianPesanan({
                ...dataRincianPesanan,
                rincian: result,
                emailPembeli: dataPemesan.data[0].emailPembeli,
                emailPenjual: dataPemesan.data[0].emailPenjual,
                namaProduk: namaProduk,
                harga: harga,
                jumlah: jumlah,
                alamatPembeli: alamat,
                metodePembayaran: "Pembayaran digital",
              });
            },
            onError: function (result) {
              alert("payment failed!");
              console.log(result);
            },
            onClose: function () {
              alert(`you closed the popup without finishing the payment}`);
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setDataRincianPesanan({
        ...dataRincianPesanan,
        rincian: {
          gross_amount: total,
          transaction_status: "-",
        },
        emailPembeli: dataPemesan.data[0].emailPembeli,
        emailPenjual: dataPemesan.data[0].emailPenjual,
        namaProduk: namaProduk,
        harga: harga,
        alamatPembeli: alamat,
        jumlah: jumlah,
        metodePembayaran: "Cod",
      });
    }
  };

  const handleChange = (event) => {
    setMetodePembayaran(event.target.value);
  };

  const handleChangeAlamat = (e) => {
    console.log(`value => ${e.target.value}`);
    setAlamat(e.target.value);
    // setDataRincianPesanan({
    //   ...dataRincianPesanan,
    //   alamat: e.target.value,
    // });
  };

  return (
    <div>
      <Grid direction="column" container spacing={3}>
        {Object.entries(dataPemesan.data).length === 0 ? (
          <p>Error</p>
        ) : (
          dataPemesan.data.map((row, index) => (
            <CheckOutComponent
              key={index}
              data={row}
              index={index}
              onTotal={onTotal}
              id={dataPemesan.id[index]}
            />
          ))
        )}
        <Grid item>
          <Typography variant="h6">Metode pembayaran</Typography>
        </Grid>
        <Grid item style={{ marginBottom: "10px" }}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="payment"
              name="payment"
              value={metodePembayaran}
              onChange={handleChange}
            >
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label="COD (Bayar di tempat)"
              />
              <FormControlLabel
                value="digital"
                control={<Radio />}
                label="Pembayaran Digital"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">Alamat</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              value={alamat}
              name="alamat"
              onChange={handleChangeAlamat}
            />
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              marginTop: "16px",
            }}
          >
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="h6">{`Total harga : Rp. ${total}`}</Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Button
              className={classes.btnCheckout}
              variant="contained"
              color="primary"
              disabled={disableBtn}
              onClick={onCheckout}
            >
              Checkout
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
