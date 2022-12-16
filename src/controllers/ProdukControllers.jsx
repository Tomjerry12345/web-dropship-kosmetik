const admin = require("firebase-admin");
const db = admin.firestore();

exports.add = async (req, res, next) => {
  const { state } = req.body;

  const response = await db.collection("produk").add(state);

  if (response.id == null) {
    res.status(404).json({ message: "terjadi kesalahan" });
    console.log("data kosong");
  }

  res.status(200).json({
    message: "Data berhasil di tambahkan",
  });
};

exports.get = async (req, res, next) => {
  const ref = db.collection("produk");
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
  const ref = db.collection("produk");
  const snapshot = await ref.where("email", "==", email).get();
  const listData = [];
  const listId = [];

  snapshot.forEach((doc) => {
    listData.push(doc.data());
    listId.push(doc.id);
  });

  res.status(200).json({ data: listData, id: listId });
};

exports.getBySearching = async (req, res, next) => {
  const query = req.params.query;
  const ref = db.collection("produk");
  const snapshot = await ref.where("namaProduk", "==", query).get();
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
};

exports.updateOneData = async (req, res, next) => {
  console.log("updateOneData");
  const id = req.params.id;
  const body = req.body;
  console.log("id => ", id);
  console.log("data => ", body);

  const data = await db.collection("produk").doc(id).get();

  let stok;

  if (!data.exists) {
    console.log("No such document!");
  } else {
    console.log("Document data:", data.data());
    const objData = data.data();
    stok = parseInt(objData.stok);
  }

  // console.log(`data updateOneData => ${JSON.stringify(data)}`);
  const ref = await db
    .collection("produk")
    .doc(id)
    .update({ stok: stok - body.jumlah });

  res.status(200).json({ message: "update berhasil" });
};

exports.delete = async (req, res, next) => {
  const id = req.params.id;
  // Get the `FieldValue` object
  const FieldValue = db.FieldValue;

  // Create a document reference
  const response = await db.collection("produk").doc(id).delete();

  res.status(200).json({ message: "sukses" });
};
