import { Box, Grid, Paper, Typography, Button } from "@material-ui/core";
import { Fragment, useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import axios from "axios";

export default function DetailChat({ chat, showChat, namaReceiver, emailReceiver, nameSender, emailSender, jenisAkun, onClicked, click }) {
  const history = useHistory();
  const user = history.location.user;
  // const date = new Date;

  const [state, setState] = useState({
    message: "",
    nameReceiver: namaReceiver,
    nameSender: nameSender,
    receiver: emailReceiver,
    sender: emailSender,
    jenisAkun: jenisAkun,
    timeStamp: Date.now()
  });

  // console.log(`user => ${JSON.stringify(user)}`);
  useEffect(() => {
    console.log('state => ', state);
    // if (user.usernamePembeli === undefined) history.push("/login");
  }, [state]);

  const onHandleChange = (e) => {
    setState({
      ...state,
      message: e.target.value
    })
  }

  const onKirim = (event) => {
    event.preventDefault();
    console.log(`test`);
    postAxios()
  };

  const postAxios = () => {
    axios
      .post("http://localhost:4000/chat/add", {
        chat: state,
      })
      .then((res) => {
        // history.push("/");
        console.log(res.message)
        setState({
          ...state,
          message: ""
        })
        onClicked(click)
      })
      .catch((err) => {
        // setLoading(false);
        console.log(err);
      });
  };

  return (
    <div style={{ height: "8vh" }}>
      {chat === null && !showChat ? (
        <Box component={Paper} style={{ background: "#f0f0f0", height: 400 }} display="flex" justifyContent="center" alignItems="center">
          <Typography>Chat Kosong</Typography>
        </Box>
      ) : (
        <Fragment>
          <div style={{background: "#fff", height: 40, padding: 8}}>
            <Typography variant="subtitle1" style={{fontWeight: 'bold'}}>{namaReceiver}</Typography>
          </div>
          <Box display="flex" flexDirection="column" style={{ background: "#f0f0f0", height: 400, overflow: "scroll", overflowX: "hidden" }}>           
          
          {chat !== null ? 
          chat.map((row) => (
            <Box
              component={Paper}
              style={{
                padding: 16,
                margin: 16,
                background: row.jenisAkun === "pembeli" ? "#ce74bc" : "#eeeeee",
                color: row.jenisAkun === "pembeli" ? "#fff" : "#000",
              }}
              alignSelf={row.jenisAkun === "pembeli" ? "flex-start" : "flex-end"}
            >
              <Typography gutterBottom style={{ fontWeight: "bold" }}>
                {row.nama}
              </Typography>
              <Typography>{row.message}</Typography>
            </Box>
          )) : null}
           
          </Box>

          {/* <Grid item> */}
          <form onSubmit={onKirim} autoComplete="off" style={{ marginTop: 14 }}>
            <Box display="flex">
              <TextField required autoFocus value={state.message} onChange={onHandleChange} fullWidth id="filled-basic" label="Message" variant="filled" style={{ marginRight: 14 }} />
              <Button type="submit" variant="contained" color="primary" style={{ width: 150 }}>
                Kirim
              </Button>
            </Box>
          </form>

          {/* </Grid> */}
        </Fragment>
      )}

      {/* <Box>
          <for
      </Box> */}
    </div>
  );
}
