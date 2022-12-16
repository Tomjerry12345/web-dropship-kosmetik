import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}));

export const CardComponent = ({ data, index }) => {
  const classes = useStyles();
  const history = useHistory();

  const { dataProduk } = useSelector((state) => state);

  // useEffect(() => {

  // }, []);

  const onDetail = () => {
    history.push({
      pathname: "/detail-produk",
      state: {
        data: data,
        id: dataProduk.id[index],
      },
    });
  };

  return (
    <Card className={classes.card}>
      <CardMedia className={classes.cardMedia} image={data.gambar} title="Image title" />
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom style={{
          fontSize: 10,
          fontWeight: "bold"
        }} variant="subtitle1">
          {data.namaProduk}
        </Typography>
        <Typography style={{ fontWeight: "bold", fontSize: 8 }} variant="subtitle1">{`Harga : Rp. ${data.harga}`}</Typography>
        <Typography style={{ fontSize: 8 }} gutterBottom variant="h6">
          {data.alamat}
        </Typography>
      </CardContent>
      <CardActions style={{ marginBottom: "12px", marginTop: "12px" }}>
        <Grid container justifyContent="center">
          <Button size="small" color="primary" variant="contained" onClick={onDetail}>
            Detail Produk
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
};
