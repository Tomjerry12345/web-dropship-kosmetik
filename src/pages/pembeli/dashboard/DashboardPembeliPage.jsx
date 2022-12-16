import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { Route, Switch } from "react-router-dom";
import { AkunPage } from "../../globalPage/akun/AkunPage";
import { AppBarPembeli } from "../../../component/AppBarPembeli";
import { DaftarProdukPembeli } from "../daftarProduk/DaftarProdukPembeli";
import { DetailProdukPembeli } from "../detailProduk/DetailProdukPembeli";
import { CheckoutPembeli } from "../checkout/CheckoutPembeli";
import { DaftarPesanan } from "../daftarPesanan/DaftarPesanan";
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
    padding: theme.spacing(4),
  },
}));

export default function DashboardPembeliPage() {
  const classes = useStyles();
  // const history = useHistory();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBarPembeli />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Switch>
            <Route exact path="/" component={DaftarProdukPembeli} />
            <Route path="/akun" component={AkunPage} />
            <Route path="/edit-akun" component={EditAkun} />
            <Route path="/detail-produk" component={DetailProdukPembeli} />
            <Route path="/checkout" component={CheckoutPembeli} />
            <Route path="/daftarPesanan" component={DaftarPesanan} />
            <Route path="/rincian-pesanan" component={RincianPesanan} />
            <Route path="/list-chat" component={ListChat} />
            {/* <Route path="/detail-chat" component={DetailChat} /> */}
          </Switch>
        </Container>
      </main>
    </div>
  );
}
