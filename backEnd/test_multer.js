var express = require("express");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
const fileUpload = require("./middleware/file-upload");

const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
//kano import to custom Error class pou exo ftiaksi
const HttpError = require("./error/http-error");
//kano import ta subrouts gia ta user
const usersRoutes = require("./routes/users-routes");
const cors = require("cors");

const app = express();
app.use(cors());

// vazo to body parser gia na boro na kano parse incoming data pada to proto middleware
app.use(bodyParser.json());

// gia na boro na stelno apo to react edoles
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.post("/profile", fileUpload.single("image"), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
});

app.post("/photos/upload", upload.array("photos", 12), function (
  req,
  res,
  next
) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
});

var cpUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 8 },
]);
app.post("/cool-profile", cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
});

app.use("/api/users", usersRoutes);

app.use((error, req, res, next) => {
  // tsekaro an sto reqeust exo file an exo file kai exo error (gia na exo ftasie se afto to simio exo error) tote tehlo me to unlick na kano delete to image pou molis ekana save sto server
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  // tsekaro an exo idi stilei to respeond kai an afto exi gini tote apla kano forward to error (Boro na stilo mono ena response opote kati exo kain kai idi exo stili respons pithatnotata xoris na prepei)

  //EDO EINAI TO EERROR AN EXO ERRO STO INCOMING REUQEST KANO DELTET TO FILE POU PERNO !!!!!!!!!!!!!
  if (res.headerSent) {
    return next(error);
  }
  //   tsekaro an exo idi kanei specify to status code gia to repsonse an den to exo kanei tha stilo ena geniko status code oti iparxi provlima kai afto einai 500
  res.status(error.code || 500);
  //   thelo na stilo piso to error message pou ekana define otan ekana throw to error se ena apo ta middlware kai an den to exo kanei specify ekei tote na stilo an unkonw erorr
  res.json({ message: error.message || "an unknown error" });
});
// SIMADIKO PADA KANO THROW ERROR  me to neo mou class i kalitera na exo async function an kano new ERROR me to neo mou eror class kai meta na kano return next(to_instnace_error_pou_Eftiksa)

app.listen(5001);
