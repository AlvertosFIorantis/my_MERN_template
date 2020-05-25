const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controlers/users-controller");

//edo prosthetot to extra URL ala to kirio url gia na pao se afta ta routes einai sto index.js file ekei pou exo /api/useres ara gia na pao sto signup route prpeie na stilo /apu/users/signup
const router = express.Router();

router.post(
  "/signup",
  //ektelo san middleware ti logiki pou thelo apo to express validator gia ta incoming data
  [
    check("email").normalizeEmail().isEmail(),
    // to normailize kanei to kefalo mikra gramata
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

module.exports = router;
