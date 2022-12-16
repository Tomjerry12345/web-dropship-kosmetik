const admin = require("firebase-admin");
const db = admin.firestore();

exports.add = async (req, res, next) => {
  const { dataRincianPesanan } = req.body;

  const response = await db.collection("rincian-pesanan").add(dataRincianPesanan);

  if (response.id == null) {
    res.status(404).json({ message: "terjadi kesalahan" });
    console.log("data kosong");
  }

  dataRincianPesanan.id = response.id;

  console.log(`dataRincianPesanan => ${dataRincianPesanan}`);

  const ref = await db.collection("rincian-pesanan").doc(response.id).update(dataRincianPesanan);

  res.status(200).json({
    message: "Data berhasil di tambahkan",
  });
};

exports.getByEmail = async (req, res, next) => {
  const email = req.params.email;
  const ref = db.collection("rincian-pesanan");
  const key = req.body.jenisAkun === "pembeli" ? "emailPembeli" : "emailPenjual";
  const snapshot = await ref.where(key, "==", email).get();
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
  const data = req.body.data;

  const ref = await db.collection("rincian-pesanan").doc(id).update(data);

  res.status(200).json({ message: "sukses" });
};

exports.delete = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body.data;

  const response = await db.collection("rincian-pesanan").doc(id).delete();

  res.status(200).json({ message: "sukses" });
};
