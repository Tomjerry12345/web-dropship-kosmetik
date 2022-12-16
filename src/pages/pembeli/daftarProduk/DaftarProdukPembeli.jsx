import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { CardComponent } from "../../../component/CardComponent";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export const DaftarProdukPembeli = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const query = history.location.query;

  const [data, setData] = useState([]);

  const { showArrow } = useSelector((state) => state);

  useEffect(() => {
    dispatch({ type: "SHOW_ARROW", payload: !showArrow });
    console.log(`query => ${query}`);
    if (query === "" || query === undefined) {
      getAxios();
    } else {
      getByQuery(query);
    }
  }, [query]);

  const getAxios = () => {
    axios
      .get("http://localhost:4000/produk/getAll")
      .then((res) => {
        setData(res.data.data);
        console.log("data => ", res.data)
        dispatch({ type: "UPDATE_PRODUK", payload: res.data.data, id: res.data.id });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const getByQuery = (params) => {
    axios
      .get(`http://localhost:4000/produk/get/query/${params}`)
      .then((res) => {
        setData(res.data.data);
        // dispatch({ type: "UPDATE_PRODUK", payload: res.data.data });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <Container className={classes.cardGrid}>
      {/* End hero unit */}
      <Grid container spacing={4}>
        {data.map((row, index) => (
          <Grid item key={index} xs={12} sm={6} md={2}>
            <CardComponent data={row} index={index} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
