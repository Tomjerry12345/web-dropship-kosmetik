const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const usersRouters = require("./src/routers/UsersRouters");
const produkRouters = require("./src/routers/ProdukRouters");
const pemesananRouters = require("./src/routers/PemesananRouters");
const pembayaranRouters = require("./src/routers/PembayaranRouters");
const rincianPesananRouters = require("./src/routers/RincianPesananRouters");
const chatRouters = require("./src/routers/ChatRouters");

app.use(cors());
app.use(bodyParser.json());

app.use("/users", usersRouters);
app.use("/produk", produkRouters);
app.use("/pemesanan", pemesananRouters);
app.use("/pembayaran", pembayaranRouters);
app.use("/rincian-pesanan", rincianPesananRouters);
app.use("/chat", chatRouters);

// app.use((error, res) => {
//   const code = error.code || 500;
//   const message = error.message;

//   res.status(code).send({ message: message });
// });

// const port = process.env.PORT || 8080;

// app.listen(port, () => {
//   console.log('Express server listening on port', port)
// });

app.listen(4000, () => console.log("Connection Succes"));
