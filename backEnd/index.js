const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
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

//to kirio route gia na pao se ola ta subroutes pou exou na kanoun me ta users
app.use("/api/users", usersRoutes);

//############################
//gia test dimiourgo ena protected route
const checkAuth = require("./middleware/check-auth");
// XRISIMOPIO TO AUTH MIDDLWARE POU EFTIAKSA GIA NA KANO PROTECT TA ROTES POU EINAI APO EDO KAI KATO ARA AN ENA ROUTE EIAN IAPO EDO KAI KATO O USER PREEIN A EIAN ISIGN IN GIA NA PAEI !!!!!!!!!!!
app.use(checkAuth);
app.get("/test_protected_route", (req, res) => {
  return res.json({ message: "protected route" });
});
//###########################

//#####################################

//to telefteo route pou exo afto prepei na bei kato kato ara ola ta ala routes pou tha exo tha ta valo pano apo afto ! edo pera apla vazo afto to route se periptosi pou paro URL pou den iparxei na giriso error sto user oti afto to url den iparxi

app.use((req, res, next) => {
  const error = new HttpError("couldn't find this route", 404);
  throw error;
});

//#####################################

//#####################################
//to functionality apo edo kai kato to kratao opos exi to proto komati eiani gia to error middleware kai to alo eaini gia na kano connect to database sto server
//####################################

//Den tha ftiakso dimou error middleware tha xrisimopio mono to error classs pou exo fitaksi. Tora gia na stilo to error piso tha xirismopio to build in functionality pou exei to express. Afto to functionality mou epitrpeie na tsekaro an exo idi stili rpesons sto frontend an den exo stili tha simeni oti exo error kai an exo eror tha stelno piso to error code pou exo sto error class mou kai an den exo kanei specify error code tha stelno 500 kai episis tha stelno to minima pou exo sto error class an den exo minima tha stelno "an unknown error"
// middleare gia error handling. Afto to middleware perni 4 arguments ! Ara afto tha ekteleisthi mono se rueqest pou exoun 4 argumetns  ara mono sta requerest pou exoun error attached
// edo pera exo to logic gia na kano role back (delete ) diladi image pou exo idi kanei save an exo error sto reqeust
app.use((error, req, res, next) => {
  // tsekaro an sto reqeust exo file an exo file kai exo error (gia na exo ftasie se afto to simio exo error) tote tehlo me to unlick na kano delete to image pou molis ekana save sto server
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  // tsekaro an exo idi stilei to respeond kai an afto exi gini tote apla kano forward to error (Boro na stilo mono ena response opote kati exo kain kai idi exo stili respons pithatnotata xoris na prepei)
  if (res.headerSent) {
    return next(error);
  }
  //   tsekaro an exo idi kanei specify to status code gia to repsonse an den to exo kanei tha stilo ena geniko status code oti iparxi provlima kai afto einai 500
  res.status(error.code || 500);
  //   thelo na stilo piso to error message pou ekana define otan ekana throw to error se ena apo ta middlware kai an den to exo kanei specify ekei tote na stilo an unkonw erorr
  res.json({ message: error.message || "an unknown error" });
});
// SIMADIKO PADA KANO THROW ERROR  me to neo mou class i kalitera na exo async function an kano new ERROR me to neo mou eror class kai meta na kano return next(to_instnace_error_pou_Eftiksa)

mongoose
  .connect("mongodb://localhost:27017/my_database", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected DB");
    console.log("app is running on port 5000");
    return app.listen(5000);
  })
  .catch((err) => {
    console.log("not connected");
    console.log(err);
  });

// prepei na kano  install kai to mongoDb ektos apo to mongoose
// GIA TO DB PREPEI NA TREKSO PROTA TO DOCKER CONTAINER ME :
// docker run -d -p 27017:27017 --name my-mongo mongo

// me to docker container ls vlepo pia containers trexo

// docker stop my-mongo

// sto contorlers folder exo tin logiki/methods pou ektelite otan pigeno se kapio route
