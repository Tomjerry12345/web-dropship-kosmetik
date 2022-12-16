import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { AppBarPenjual } from "../../../component/AppBarPenjual";
import { DaftarProdukPenjual } from "../daftarProduk/DaftarProdukPenjual";
import { Route, Switch } from "react-router-dom";
import { AkunPage } from "../../globalPage/akun/AkunPage";
import TambahProduk from "../daftarProduk/tambah-produk/TambahProduk";
import EditProduk from "../daftarProduk/edit-produk/EditProduk";
import RincianPesanan from "../../globalPage/rincianPesanan/RincianPesanan";
import EditAkun from "../../globalPage/akun/edit/EditAkun";
import ListChat from "../../globalPage/chat/list/ListChat";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default function DashboardPenjualPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />

      <AppBarPenjual />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Switch>
                <Route exact path="/" component={DaftarProdukPenjual} />
                <Route path="/akun" component={AkunPage} />
                <Route path="/edit-akun" component={EditAkun} />
                <Route path="/tambah-produk" component={TambahProduk} />
                <Route path="/edit-produk" component={EditProduk} />
                <Route path="/rincian-pesanan" component={RincianPesanan} />
                <Route path="/list-chat" component={ListChat} />
              </Switch>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
