const admin = require("firebase-admin");
const db = admin.firestore();

exports.add = async (req, res, next) => {
  const { data1 } = req.body;

  const response = await db.collection("pemesanan").add(data1);

  if (response.id == null) {
    res.status(404).json({ message: "terjadi kesalahan" });
    console.log("data kosong");
  }

  res.status(200).json({
    message: "Data berhasil di tambahkan",
  });
};

exports.get = async (req, res, next) => {
  const ref = db.collection("pemesanan");
  const snapshot = await ref.get();
  const listData = [];
  const listId = [];

  snapshot.forEach((doc) => {
    listData.push(doc.data());
    listId.push(doc.id);
  });

  res.status(200).json({ data: listData, id: listId });
};
exports.getByEmail = async (req, res, next) => {
  const email = req.params.email;
  const ref = db.collection("pemesanan");
  const snapshot = await ref.where("emailPembeli", "==", email).get();
  const listData = [];
  const listId = [];

  snapshot.forEach((doc) => {
    listData.push(doc.data());
    listId.push(doc.id);
  });

  res.status(200).json({ data: listData, id: listId });
};

exports.update = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;

  const ref = await db.collection("produk").doc(id).update(data);

  res.status(200).json({ message: "sukses" });
  // Set the 'capital' field of the city
  // const response = await cityRef.update({ capital: true });
};

exports.delete = async (req, res, next) => {
  const id = req.params.id;
  // Get the `FieldValue` object
  const FieldValue = db.FieldValue;

  // Create a document reference
  const response = await db.collection("pemesanan").doc(id).delete();

  console.log("res => ", response);

  res.status(200).json({ message: "sukses" });
};
