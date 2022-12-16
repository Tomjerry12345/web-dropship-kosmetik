const admin = require("firebase-admin");
const db = admin.firestore();

exports.add = async (req, res, next) => {
  const { chat } = req.body;
  console.log(`chat => ${JSON.stringify(chat)}`);

  const response = await db.collection("chat").add(chat);

  if (response.id == null) {
    res.status(404).json({ message: "terjadi kesalahan" });
    console.log("data kosong");
  }

  res.status(200).json({
    message: "Data berhasil di tambahkan",
  });
};

exports.getListChat = async (req, res, next) => {
  const email = req.params.email;
  const name = req.params.name;
  const ref = db.collection("chat");
  console.log(`email => ${email}`);

  let sum = 0;

  const snapshot = await ref.get();

  const listName = [];
  const listEmail = [];

  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  snapshot.forEach((result) => {
    console.log("time => ", result.createTime.seconds)
    const data = result.data();
    console.log(`sender => ${data.sender} || receive => ${data.receiver}`);
    if (data.sender === email || data.receiver === email) {
      sum++;
      console.log(result.id, "=>", result.data());
      if (data.nameReceiver !== name) {
        listName.push(data.nameReceiver);
        listEmail.push(data.receiver);
        sum = 0;
      }

      if (sum === 1) {
        listName.push(data.nameSender);
        listEmail.push(data.sender);
      }
      console.log(sum);
    }
  });

  res.status(200).json({
    name: [...new Set(listName)],
    email: [...new Set(listEmail)],
  });
};

exports.getChat = async (req, res, next) => {
  const emailRoot = req.params.emailRoot;
  const emailChild = req.params.emailChild;
  const ref = db.collection("chat");

  console.log(`emailRoot => ${emailRoot}`);
  console.log(`nameChild => ${emailChild}`);

  const snapshot = await ref.orderBy("timeStamp", "asc").get();

  const listChat = [];

  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  snapshot.forEach((result) => {
    const data = result.data();
    console.log('data => ', data);
    // if (snapshot.size === 1) {
    //   listChat.push(data);
    //   return;
    // } else {
      if ((data.sender === emailRoot || data.receiver === emailRoot) && (data.sender === emailChild || data.receiver === emailChild)) {
        console.log(result.id, "=>", result.data());
        listChat.push(data);
      }
    // }

    
  });

  res.status(200).json({
    listChat,
  });
};

exports.update = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body.data;

  const ref = await db.collection("rincian-pesanan").doc(id).update(data);

  res.status(200).json({ message: "sukses" });
};
