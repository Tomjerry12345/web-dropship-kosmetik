import { Box, Typography, Paper, Grid } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { data } from "../../../../assets/DataDummy";
import DetailChat from "../detail/DetailChat";

const ListCardChat = ({ index, open, name, lastMessage, onClickListChat }) => {
  console.log(`open => ${open}`);
  return (
    <div component={Paper} style={{ background: open ? "#f0f0f0" : null }} onClick={() => onClickListChat(data, index)}>
      <Typography variant="h6" style={{ fontWeight: "bold" }}>
        {name}
      </Typography>
      <Typography variant="subtitle1">{lastMessage}</Typography>
      <hr />
    </div>
  );
};

export default function ListChat() {
  const { dataUsers } = useSelector((state) => state);
  const [open, setOpen] = useState([]);
  const history = useHistory();

  const {namaReceiver, emailReceiver} = history.location.userReceiver ?? "";
  const showChat = history.location.showChat;

  const [chat, setChat] = useState(null);
  const [listChat, setListChat] = useState([]);
  const [emailChat, setEmailChat] = useState([]);
  const [userReceiver, setUserReceiver] = useState({
    namaReceiver,
    emailReceiver
  })

  const [click, setClick] = useState(false);

  const [lastOpen, setLastOpen] = useState();

  useEffect(() => {
    console.log(`namaReceiver => ${JSON.stringify(namaReceiver)}`);
    if (Object.keys(dataUsers).length === 0) history.push("/login");
    data.map((data, index) => setOpen([...Array(data.luffy.length)].map((val) => false)));
    getAxios();
    
  }, [click]);

  const getAxios = () => {
    axios
      .get(`http://localhost:4000/chat/get/${dataUsers.email}/${dataUsers.namaLengkap}`)
      .then((res) => {
        setListChat(res.data.name)
        setEmailChat(res.data.email)
        getChat(emailReceiver)
        // setData(res.data.data);
        // setId(res.data.id);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const onClickListChat = (params, index) => {
    console.log('emailReceiver => ', emailChat[index]);
    setChat(params);
    
    setOpen(
      open.map((boolean_value, i) => {
        if (index === i) {
          // once we retrieve the collapse index, we negate it
          return !boolean_value;
        } else {
          // all other collapse will be closed
          return false;
        }
      })
    );

    setUserReceiver({
      ...userReceiver,
      namaReceiver: listChat[index],
      emailReceiver: emailChat[index]
    })

    setLastOpen(emailChat[index])
    getChat(emailChat[index])
    
  };

  const getChat = (emailReceiver) => {
    axios
      .get(`http://localhost:4000/chat/get/detail-chat/${dataUsers.email}/${emailReceiver}`)
      .then((res) => {
        console.log("res: ", res.data);
        setChat(res.data.listChat)
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const onClicked = (click1) => {
    // setClick(click1)
    console.log('lastOpen => ', lastOpen)
    getChat(lastOpen ?? emailReceiver)
  }

  return (
    <Box display="flex" flexDirection="column">
      <Grid container spacing={2}>
        <Grid item md={6}>
          <Box component={Paper} style={{ padding: 14, overflow: "scroll", overflowX: "hidden", height: 510 }}>
            {listChat.map((name, index) =>
               <ListCardChat index={index} open={open[index]} name={name} emailChat={emailChat[index]} onClickListChat={onClickListChat} />
            )}
          </Box>
        </Grid>
        <Grid item md={6}>
          {console.log('userReceiver => ', userReceiver)}
          {userReceiver.namaReceiver === undefined ? null : 
          <DetailChat 
          chat={chat} showChat={showChat} 
          namaReceiver={userReceiver.namaReceiver} 
          emailReceiver={userReceiver.emailReceiver}
          nameSender={dataUsers.namaLengkap}
          emailSender={dataUsers.email}
          jenisAkun={dataUsers.jenisAkun}
          onClicked={onClicked}
          click={!click}
          />}
          
        </Grid>
      </Grid>
    </Box>
  );
}
