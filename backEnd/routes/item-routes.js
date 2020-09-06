const express = require('express')
const { check } = require('express-validator')

const usersController = require('../controlers/users-controller')

const fileUpload = require('../middleware/file-upload')

// middleware gia na tsekaro TOKEN
const checkAuth = require('../middleware/check-auth')

const itemsController = require('../controlers/items-controller')

// xriazome to express.Router gia na boro na kano set up ta routes se afto to file kai meta na ta kano export kai na boro na ta xrisimopioso sto app.js Diladi se kathe ena file gia ta routes mou tha ftiaxno ena cont pou tha to leo router pano se afto tha vazo ola ta .get .post . use pou anaferode sto sigkerkimeno router kai sto telos tha to kano export gia na to xrisimopiso sto app.js
// Note edo kano specify to path after to path pou exo vali sto ap.ks gia na xirismopiso afto to middlware me to app.use
const router = express.Router()

// XRISIMOPIO TO AUTH MIDDLWARE POU EFTIAKSA GIA NA KANO PROTECT TA ROTES POU EINAI APO EDO KAI KATO ARA AN ENA ROUTE EIAN IAPO EDO KAI KATO O USER PREEIN A EIAN ISIGN IN GIA NA PAEI !!!!!!!!!!!
router.use(checkAuth)

// ftiaxno afto to route gia an boro na dimiourgo kainourgio item.  to "/" pou exo eini gia to default url pou tha valo na eiani ta items kai afto to dilono sto app.js
router.post(
  '/',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  itemsController.createItem,
)

// gia na kano update ena item
router.patch(
  '/:itemid',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  itemsController.updateItem,
)

//route gia na kano delete ena item
router.delete('/:itemid', itemsController.deleteItem)

//route gia na paro ta information gia ena sigkekrimeno item
router.get('/:itemid', itemsController.getItemById)

// apla na thimame ot to order apo ta routes meterai giati prota exo /:itemid kai meta exo /user/:uid I express theori oti to /user/ tha borouse theoritka na einai url pou psaxno sto /:itemid apla epidi pidi meta exo /user/:uid pou simeni oti exo kai alo argumetn / ekteltike afto aala an egrafa mono /user tha ektelotan kai to middlware sto /:itemid opote anagkastika prepei pna prostehso ena komati sto url gai na boro na ksexorizo pote psaxno ean item i ola ta items gia enan user gian ti apo to url to express mono tou dne katlaveni ti diafroa tou itemitd kai tou uid tora omos epidi eain telios ksexorista ta routes einai ok
router.get('/user/:uid', itemsController.getItemsByUserID)

module.exports = router
