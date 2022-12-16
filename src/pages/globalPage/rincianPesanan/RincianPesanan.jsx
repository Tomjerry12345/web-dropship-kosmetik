import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { Button } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

const CardPesanan = ({
  data,
  id,
  onRefresh,
  isRefresh,
  openDialog,
  openDialogCekPesanan,
}) => {
  const {
    namaProduk,
    harga,
    rincian,
    statusPengiriman,
    statusPenerima,
    metodePembayaran,
    emailPenjual,
    emailPembeli,
    jumlah,
    alamatPembeli,
    noResi,
  } = data;
  const { gross_amount, transaction_status } = rincian;
  const [transactionStatus, setTransactionStatus] =
    useState(transaction_status);
  const { dataUsers } = useSelector((state) => state);

  useEffect(() => {
    if (metodePembayaran !== "Cod") getStatusPembayaran(rincian);
  }, []);
  const getStatusPembayaran = (rincian) => {
    axios
      .post("http://localhost:4000/pembayaran/getStatus/", {
        rincian,
      })
      .then((res) => {
        console.log(`transactionStatus => ${JSON.stringify(res.data.status)}`);
        setTransactionStatus(res.data.status);
      })
      .catch((err) => console.log(err));
  };

  const onClickBtn = () => {
    let statusPenerima1, statusPengiriman1;
    console.log(`jenisAkun => ${dataUsers.jenisAkun}`);
    console.log(`id => ${id}`);
    if (dataUsers.jenisAkun === "pembeli") {
      const isStatusPenerima =
        statusPenerima === "Sudah Diterima" ? true : false;
      statusPenerima1 = isStatusPenerima ? "Belum Diterima" : "Sudah Diterima";
    } else {
      const isStatusPengiriman =
        statusPengiriman === "Sudah Dikirim" ? true : false;

      statusPengiriman1 = isStatusPengiriman
        ? "Belum Dikirim"
        : "Sudah Dikirim";
    }

    axios
      .put(`http://localhost:4000/rincian-pesanan/update/${id}`, {
        data: {
          // emailPenjual,
          // namaProduk,
          // emailPembeli,
          // rincian,
          // harga,
          // jumlah,
          // metodePembayaran,
          statusPengiriman: statusPengiriman1,
          statusPenerima: statusPenerima1,
        },
      })
      .then((res) => {
        console.log(res);
        onRefresh(!isRefresh);
      })
      .catch((err) => console.log(err));
    // openDialog(statusPenerima, statusPengiriman);
  };

  const onBatalkanPesanan = () => {
    axios
      .delete(`http://localhost:4000/rincian-pesanan/delete/${id}`)
      .then((res) => {
        console.log(res);
        onRefresh(!isRefresh);
      })
      .catch((err) => console.log(err));
  };

  const onCekPesanan = () => {
    // alert("onCekPesanan");
    // console.log("onCekPesanan");
    openDialogCekPesanan(id, noResi);
  };

  return (
    <div>
      <Paper
        sx={{
          p: 2,
          mt: 4,
        }}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid container spacing={4}>
              <Grid item md={2} sm align="center">
                Nama Produk
              </Grid>
              <Grid item md={2} sm align="center">
                Harga
              </Grid>
              <Grid item md sm align="center">
                Metode Pembayaran
              </Grid>
              <Grid item md sm align="center">
                Status Pembayaran
              </Grid>
              <Grid item md sm align="center">
                Status Pengiriman
              </Grid>
              <Grid item md sm align="center">
                Status Penerima
              </Grid>
              <Grid item md sm align="center">
                Alamat Pembeli
              </Grid>
              <Grid item md sm align="center">
                Total Pesanan
              </Grid>
              </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={4}>
              <Grid item md={2}>
                <Grid container direction="column" spacing={2}>
                  {namaProduk.map((res, i) => (
                    <Grid item>{`${i + 1}. ${res}`}</Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item md={2} align="center">
                <Grid container direction="column" spacing={2}>
                  {harga.map((res, i) => (
                    <Grid item>{`${i + 1}. ${res}`}</Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item md align="center">
                {metodePembayaran}
              </Grid>
              <Grid item md align="center">
                {transactionStatus}
              </Grid>
              <Grid item md align="center">
                {statusPengiriman}
              </Grid>
              <Grid item md align="center">
                {statusPenerima}
              </Grid>
              <Grid item md align="center">
                {alamatPembeli}
              </Grid>
              <Grid item md align="center">
                {gross_amount}
              </Grid>
             </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Box justifyContent="space-between" display="flex">
        {dataUsers.jenisAkun === "pembeli" ? (
          <Button
            variant="contained"
            color={
              dataUsers.jenisAkun === "pembeli"
                ? statusPenerima === "Belum Diterima"
                  ? "secondary"
                  : "primary"
                : statusPengiriman === "Belum Dikirim"
                ? "secondary"
                : "primary"
            }
            style={{
              marginTop: "10px",
            }}
            onClick={onClickBtn}
          >
            {dataUsers.jenisAkun === "pembeli"
              ? statusPenerima === "Belum Diterima"
                ? "Sudah Diterima"
                : "Belum Diterima"
              : statusPengiriman === "Belum Dikirim"
              ? "Sudah Dikirim"
              : "Belum Dikirim"}
          </Button>
        ) : null}

        <Button
          hidden
          variant="contained"
          style={{
            marginTop: "10px",
            background:
              dataUsers.jenisAkun === "dropshiper"
                ? noResi === ""
                  ? "#e33e7f"
                  : "#bcbcbc"
                : "#e33e7f",
            color:
              dataUsers.jenisAkun === "dropshiper"
                ? noResi === ""
                  ? "#f3f6f4"
                  : "black"
                : "white",
          }}
          onClick={onCekPesanan}
          disabled={
            dataUsers.jenisAkun === "dropshiper"
              ? noResi !== ""
                ? true
                : false
              : false
          }
        >
          Cek Pesanan
        </Button>

        
       {dataUsers.jenisAkun === "pembeli" ? noResi == "" ? (
          <>
            <Button
              hidden
              variant="contained"
              style={{ marginTop: "10px", background: "#e33e7f", color: "white" }}
              onClick={onBatalkanPesanan}
            >
              Batalkan Pesanan
            </Button>
          </>
        ) : null : null}
      </Box>
    </div>
  );
};

const stepPembeli = [
  {
    label: "Pengirim sedang mempersiapkan barang anda",
  },
  {
    label: "Paket telah di kirim ke lokasi anda",
  },
];

const stepPenjual = [
  {
    label: "Persiapan pengiriman paket",
  },
  {
    label: "Paket berhasil di kirim",
  },
];

export default function RincianPesanan() {
  const { dataUsers } = useSelector((state) => state);

  const [data, setData] = useState([]);
  const [id, setId] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);

  const [open, setOpen] = useState(false);
  const [openCekPesanan, setOpenCekPesanan] = useState(false);
  const [status, setStatus] = useState({
    statusPenerima: "",
    statusPengiriman: "",
  });

  const [idPesanan, setIdPesanan] = useState("");
  const [noResi, setNoResi] = useState("");
  const [noResiPembeli, setNoResiPembeli] = useState("");

  const [dataStepper, setDataStepper] = useState([]);

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (dataUsers.jenisAkun === "pembeli") {
      setDataStepper(stepPembeli);
    } else {
      setDataStepper(stepPenjual);
    }
    getAxios();
  }, [isRefresh]);

  const handleNext = () => {
    console.log("noResi => " + noResi);

    if (activeStep === 1) {
      onRefresh(!isRefresh);
      setOpenCekPesanan(false);
    }

    axios
      .put(`http://localhost:4000/rincian-pesanan/update/${id}`, {
        data: {
          noResi: noResi,
        },
      })
      .then((res) => {
        console.log(res);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        kirimPesanan(status.statusPenerima, status.statusPengirim);
      })
      .catch((err) => console.log(err));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getAxios = () => {
    axios
      .post(`http://localhost:4000/rincian-pesanan/get/${dataUsers.email}`, {
        jenisAkun: dataUsers.jenisAkun,
      })
      .then((res) => {
        console.log("res: ", res.data);
        setData(res.data.data);
        setId(res.data.id);
        console.log(`id => ${res.data.id}`);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const onRefresh = (params) => {
    setIsRefresh(params);
  };

  const openDialog = (statusPenerima, statusPengiriman) => {
    setOpen(true);
    setStatus({
      statusPenerima,
      statusPengiriman,
    });
  };

  const openDialogCekPesanan = (
    id,
    valueNoResi,
    statusPenerima,
    statusPengiriman
  ) => {
    setOpenCekPesanan(true);
    setIdPesanan(id);
    setNoResiPembeli(valueNoResi);

    setStatus({
      statusPenerima,
      statusPengiriman,
    });

    if (dataUsers.jenisAkun === "pembeli") {
      if (valueNoResi !== "") setActiveStep(1);
      else setActiveStep(0);
    }
  };

  const closeDialogCekPesanan = () => {
    setOpenCekPesanan(false);
  };

  const kirimPesanan = (statusPenerima, statusPengirim) => {
    // setStatus({
    //   statusPenerima,
    //   statusPengiriman,
    // });
    let statusPenerima1, statusPengiriman1;
    console.log(`jenisAkun => ${dataUsers.jenisAkun}`);
    console.log(`id => ${id}`);
    if (dataUsers.jenisAkun === "pembeli") {
      const isStatusPenerima =
        status.statusPenerima === "Sudah Diterima" ? true : false;
      statusPenerima1 = isStatusPenerima ? "Belum Diterima" : "Sudah Diterima";
    } else {
      const isStatusPengiriman =
        status.statusPengiriman === "Sudah Dikirim" ? true : false;

      statusPengiriman1 = isStatusPengiriman
        ? "Belum Dikirim"
        : "Sudah Dikirim";
    }

    axios
      .put(`http://localhost:4000/rincian-pesanan/update/${id}`, {
        data: {
          // emailPenjual,
          // namaProduk,
          // emailPembeli,
          // rincian,
          // harga,
          // jumlah,
          // metodePembayaran,
          statusPengiriman: statusPengiriman1,
          statusPenerima: statusPenerima1,
        },
      })
      .then((res) => {
        console.log(res);
        onRefresh(!isRefresh);
      })
      .catch((err) => console.log(err));
  };

  const onGetNomorResi = (e) => {
    console.log("noResi => " + e.target.value);
    setNoResi(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Typography variant="subtitle1">Rincian Pesanan</Typography>
      {data.map((row, i) => (
        <CardPesanan
          data={row}
          id={id[i]}
          isRefresh={isRefresh}
          onRefresh={onRefresh}
          openDialog={openDialog}
          openDialogCekPesanan={openDialogCekPesanan}
        />
      ))}
      {/* <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Kirim</Button>
        </DialogActions>
      </Dialog> */}

      <Dialog open={openCekPesanan} onClose={handleClose} fullWidth>
        <DialogTitle>Cek Pesanan</DialogTitle>
        <DialogContent>
          <Box sx={{ maxWidth: 400 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {dataStepper.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    optional={
                      index === 2 ? (
                        <Typography variant="caption">Last step</Typography>
                      ) : null
                    }
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography variant="caption">
                      {index === 1 && dataUsers.jenisAkun === "pembeli"
                        ? `Dengan nomor resi ${noResiPembeli}`
                        : null}
                    </Typography>
                    {dataUsers.jenisAkun === "dropshiper" && index === 0 ? (
                      <TextField
                        variant="outlined"
                        label="no. resi"
                        onChange={onGetNomorResi}
                      />
                    ) : (
                      ""
                    )}
                    <Box sx={{ mb: 2, mt: 2 }}>
                      <div>
                        {dataUsers.jenisAkun === "dropshiper" ? (
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === dataStepper.length - 1
                              ? "Finish"
                              : "Continue"}
                          </Button>
                        ) : null}

                        {/* <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button> */}
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {/* {activeStep === dataStepper.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </Button>
              </Paper>
            )} */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogCekPesanan}>Cancel </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
