const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const HttpError = require("../error/http-error");

const User = require("../models/user");
const bcrypt = require("bcryptjs");

// ti logiki gia to express-validator tin ektelo sto route folder edo apla kano catch ta opia erros exo me to validationResult
const signup = async (req, res, next) => {
  console.log("incomming request", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  //kano destraucturing ta stixia pou perno apo to fronted edo exo valie arixika mono emial kai password an thelo kai ala ta prostheto edo pera
  const { email, password } = req.body;

  // prin dimiourgiso kainourgio user tsekaro an iparxei idi user me afto to email
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    //afto to errro eiani se peripotsi pou kati paei lathos me to database kai den boro na tsekaro an iparxi user
    return next(error);
  }

  if (existingUser) {
    // afto to error einai se periptosi pou pira apadisi apo to database kai odos iparxi o user
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  // kano hash to incoming passwrod prin to kano strore sto database. Exo async sto signup function gia afto kai boro na xrisimopio mesa tou await kai epidi ola afta einia promiseis gia kathe await pou exo vazo kai ena try catch block kai vazo reutrn next(error) gia na min sinexiso pio kato sto function an exo error
  let hashedPassword;
  try {
    // to password mesa sto .hash() eian ito password pou exo kanei destracure apo to incoming request
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      //kano throw error se periptosi pou gia technical reqaon den boor na kano hash to password
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }
  //to vazo afto gia na min skaei o kodikas an den exo kani attached fotografia
  let imageURL = "no image";
  if (req.file) {
    imageURL = "http://localhost:5000/" + req.file.path;
  }
  //exo perasi olous tous elenxouns kai ime etimos na ftiakso to user ftiaxno ena neo isntans apo to user model
  // ean den iparxi o user tote xrisimopio to user Model mou gia na ftiakso enan. Vazo to hashed passwrod sto database me to key naei na password pou einai to feild sto database kai to value pou tha gineite stored na eian ito hashed password pou eiani to "hashedPassword"
  //otan ftiaxnno user pernao sto image kai to url gia to pou vriskete to image pou ekna uplaod to local host komati prepei na to alakso me to url tou backend otan kano productionize to script kai met avazot to req.file.path pou eiani to onoma pou edosa sto file poou molis ekana upload. I ali epilog einai na min eixa to to localhost komati edo pera kai apla na to evaza sto frontend kaithe fora pou tihela na xrisimopiso mia eikona
  const createdUser = new User({
    email: email,

    password: hashedPassword,
    image: imageURL,
  });

  //tora pou exo to user etimeo prpeei na to kano kai save sto database
  // meta prepei na ton kano save sto database
  //epidi kano edo createdUser.save() to mongoose kani automaticalli generate me getters to id field opote ego meta otan pao na ftiakso to to jwt kai xrisimopio createdUser.id adi na grafo createdUser_id aftos eiani o logos !! an estelna to object pou perno opos einai pisto sto fontend katefthian apo to to datbase tote tah eixa _id gia na to glitos afto boro mesa sto momdel otan ftiaxno to schema na grapso to json format pou boron a to vro sto microsevice folder gia to pos na alazo mesas sto database to _id se id
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }
  // console.log(createdUser);
  //girnaei _id
  // console.log(createdUser.id);
  //ala me to createdUser.id boro na kano acces to id sto createdUSer parolo pou to field mesa sto object einai _id to mongoose omos mou epitrepei na grafo .id katefthiean pano sto object !!!!!c
  // tora pou exo kanei store to user sto database (eimai meta to crateUser.save()) kai ksero oti exo valdi user thelo na kano generate to jsaonwebtoken
  let token;
  try {
    // to jwt,sign girnaei piso ena string pou afto tha eiani to token mou to proto argumetin eian to payload apo to token kai afto eiani to user id to user emai l kai to secret word pou exo kai ola afta ta values mazi mou kanoun to json token pou eaini ena string kai to detero arugmetn eina gia posi ora isxie afto to token kai exo valei an eian igia 1 ora boro na tskerao to official webpage gia to json webtoken gia perisotera pragmata
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  // So, basically, the id getter returns a string representation of the document's _id (which is added to all MongoDB documents by default and have a default type of ObjectId).Regarding what's better for referencing, that depends entirely on the context (i.e., do you want an ObjectId or a string). For example, if comparing id's, the string is probably better, as ObjectId's won't pass an equality test unless they are the same instance (regardless of what value they represent).

  // tora pou exo token thelo na sttelno piso afta ta stixia sto front end kai etsi boron a stilo kai to totekn sto diko mou paradigma bori na tehlo na stilo kai ala data sto front end gia paradigma an o xristis eaini giators i pelatis boro na exo ena teitoa input field sto database mou .MALON PRepi na ktratiso to userCreatuSertoBOkcet getters true kai apo ekei na paro to id tou user kai meta na to peraso san user id sto json pou stelno apo kato giati to getter_rure kanei genetre to id giati sto database exo mono _id kai to craet use einai to obkect pou ftaixno edo pera
  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

//to functinality pou trexei otan thelo na kano login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  // prota tsekaro an exo to user
  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  // an exo to user tsekaro an to incomign email teriazei me to eimail pou exo sto database EXo to isVlaidPaswoard declare ekso apo to try catch gia na boro na to xirismopiso kai sto ifstmane pio kato
  let isValidPassword = false;
  try {
    // to passwriod mesa sto compair eiani to incomniv passowrd kai tsekaro an teriazei me to passwrod pou exo sto database pou eian ito existingUser.passwrod afto giranei true false kai to kano store sto isValidPassowrd dummy varialbe
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    // to erorr edo mesa den eiani oti dne teriazoun ta password ala oti eixa kapio texniko provlima gia afto kano meta pio kato to ifasmetns sto isValidPassord gia na do an odos teriazoun ta passowrd i oxi
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }
  // an eianai false simei oti exo lathos password kai kano send piso error

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  // tora pou ksero oti to apssrod einai match thelo na kano generate to json token
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  // an den eiani fasl ola kala kai ton kano loggedin
  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    image: existingUser.image,
  });
};

//kano exports ta methods pou eftikasa kai tora prepei na ta enoso me routes
exports.signup = signup;
exports.login = login;
