const app = require("../../FirebaseApp.js");
const db = app.firestore();

exports.getUsersByEmail = async (req, res, next) => {
  const email = req.body.email;
  console.log("email: ", email);
  const users = db.collection("users");
  const snapshot = await users.where("email", "==", email).get();
  if (snapshot.empty) {
    const error = new Error("Data tidak di temukan");
    error.code = 404;
    throw error;
  } else {
    snapshot.forEach((doc) => {
      res.status(200).json(doc.data());
    });
  }
};

exports.addUser = async (req, res, next) => {
  const { state } = req.body;
  console.log(state);
  const response = await db.collection("users").add(state);
  console.log("response: ", response);
  res.status(200).send("succes");
};

exports.update = async (req, res, next) => {
  console.log("update");
  const email = req.params.email;
  const { state } = req.body;
  console.log("updateProduk => ", email);
  console.log("data => ", state);

  let id;

  const users = db.collection("users");

  const snapshot = await users.where("email", "==", email).get();

  // console.log(`snapshot => ${snapshot}`);

  if (snapshot.empty) {
    console.log("Data tidak di temukan");
  } else {
    snapshot.forEach((doc) => {
      // console.log(doc.id);
      id = doc.id;
    });

    const ref = await users.doc(id).update(state);

    const data = await users.doc(id).get();

    console.log(`res => ${Object.entries(data.data())}`);

    res.status(200).json({ message: "sukses", data: data.data() });
  }
};
