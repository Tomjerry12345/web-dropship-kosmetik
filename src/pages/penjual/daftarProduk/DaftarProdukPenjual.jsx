import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  fontWeightBold: {
    fontWeight: "bold",
  },
  tableContainer: {
    marginTop: theme.spacing(2),
  },
}));

export const DaftarProdukPenjual = () => {
  const classes = useStyles();
  const history = useHistory();

  const { dataUsers, showArrow } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [id, setId] = useState([]);
  const [change, setChange] = useState(false);

  useEffect(() => {
    getAxios();
    console.log("dataUsers => ", dataUsers);
    dispatch({ type: "SHOW_ARROW", payload: !showArrow });
  }, [change]);

  const onTambahProduk = () => {
    dispatch({ type: "SHOW_ARROW", payload: !showArrow });
    history.push("/tambah-produk");
  };

  const getAxios = () => {
    axios
      .get(`http://localhost:4000/produk/get/${dataUsers.email}`)
      .then((res) => {
        console.log("response => ", res.data)
        setData(res.data.data);
        setId(res.data.id);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const onDelete = (id) => {
    console.log("id => ", id);
    axios
      .delete(`http://localhost:4000/produk/delete/${id}`)
      .then((res) => {
        console.log("res: ", res.data);
        setChange(!change);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={onTambahProduk}>
        Tambah Produk
      </Button>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.fontWeightBold}>Nama Produk</TableCell>
              <TableCell className={classes.fontWeightBold} align="right">
                Jenis Produk
              </TableCell>
              <TableCell className={classes.fontWeightBold} align="right">
                Harga Produk
              </TableCell>
              <TableCell className={classes.fontWeightBold} align="right">
                Stok
              </TableCell>
              <TableCell className={classes.fontWeightBold} align="center">
                Gambar
              </TableCell>
              <TableCell className={classes.fontWeightBold} align="right">
                Edit Data
              </TableCell>
              <TableCell className={classes.fontWeightBold} align="right">
                Hapus Data
              </TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.namaProduk}
                  </TableCell>
                  <TableCell align="right">{row.jenisProduk}</TableCell>
                  <TableCell align="right">{row.harga}</TableCell>
                  <TableCell align="right">{row.stok}</TableCell>
                  <TableCell align="right">
                    <img alt="gambar" src={row.gambar} width="200" />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                         dispatch({ type: "SHOW_ARROW", payload: !showArrow });
                        history.push({
                          pathname: "/edit-produk",
                          state: {
                            data: row,
                            id: id[index],
                          },
                        })
                      }
                      }
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="secondary" onClick={() => onDelete(id[index])}>
                      Hapus
                    </Button>
                  </TableCell>           
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
