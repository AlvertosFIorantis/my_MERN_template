const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const HttpError = require('../error/http-error')

const User = require('../models/user')
const Item = require('../models/item')

// na valo asinyc giati kano save kai item sto database
const createItem = async (req, res, next) => {
  const errors = validationResult(req)
  // trekari an exei erorr apo ta items pou checkara sto route pou thelo na kano validate

  if (!errors.isEmpty()) {
    // an den einai empty simeni oti exo errors
    return next(new HttpError('invalid input passed check your data', 422))
  }
  // den thelo na perno to id (diladi to creator apo to frontend ala thelo na to perno apo to authmiddlewre gia afto to vgazo apo to distracutring pou penro apo to req.body)
  console.log(req.userData.userId)
  const { title, description } = req.body
  //   apo to na grafo title:tittle kai paei legodas
  const createdItem = new Item({
    title,
    description,
    creator: req.userData.userId,
    // to exo parei to id apo to auth middleware
  })
  // trekaro prin ftiakos to new place an iparxei o user sto database
  let user
  try {
    user = await User.findById(req.userData.userId)
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again', 500)
    return next(error)
  }
  // an den iparxei petao error
  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404)
    return next(error)
  }

  console.log(user)

  // epidi tora thelo na kano pola pragmata meto mongo se ena reuwest gia pardigma thelo na kano save to item pou molis euftaksa kai meta thelo sto User collection na pao sto user kai na valo sto items array to item pou molis eftiaksa xrisimopo to monogose Session gia na ketleoso olo to logic pou thelo mesa sto session afto edo to session vevenote oti tha ekteletsthi mono an ola ta pragamata mesa sto session eiani eptiixi OTAN EXO LOCAL MONGO PREPEI NA KANO COMMENT OUT TA SESSION !!!!!!!!!! TA SESSION TA THELO MONO GIA TO ATLASS
  try {
    // const sess = await mongoose.startSession();
    // console.log("worked");
    // sess.startTransaction();
    await createdItem.save(/*{ session: sess }*/)
    console.log('worked')
    user.items.push(createdItem)
    console.log('worked')
    await user.save(/*{ session: sess }*/)
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500)
    return next(error)
    //vazoume next gia na stamatisoume to code execution tou functions mias kai exoume error
  }

  res.status(201).json({ item: createdItem })
}

// epidi perno to user id apo to user meso tou token sto auth middlwre exo acess sto user id !!! Afto to user id den bori na to laaksi kaneis giati to perno mesa apo token kai prin kano update to place thelo na tskero an to crateor id feild pou exo sto database teriazei me to id pou penro apo to auth middleware kai mono tote na to kano update !!
const updateItem = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422)
  }
  const { title, description } = req.body
  //peno kai to id pao to item apo to url opote xrisimo req.param
  const itemId = req.params.itemid
  let item
  // prota prospatho na do an afto to iem iparxei sto database
  try {
    item = await Item.findById(itemId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500,
    )
    return next(error)
  }

  // thelo na tskero an to crateor id feild pou exo sto database teriazei me to id pou penro apo to auth middleware kai mono tote na to kano update !! Exo idi vrei sto database to item kai to exo store sto item varible kai to creator fiedl to kano transofmr se string (eiani monogdb strying)k ai tserako arn afto toeriazei sto USerID pou perno apo to auth-middleware opote an den teriazoun kano throw error kai sinexiso mono an teriazoun pou simeni oti o logged in user einai o kai user pou ods eftaikse to place !!!!
  if (item.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this place.', 401)
    return next(error)
  }

  //   to title kai descirption eian iafta pou pira apo to client meso tou reqest param
  item.title = title
  item.description = description
  // tora pou vrika to item pou thelo to ekana update to ksana gkano save sto database
  try {
    await item.save()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500,
    )
    return next(error)
  }

  res.status(200).json({ item: item.toObject({ getters: true }) })
}

const deleteItem = async (req, res, next) => {
  const itemId = req.params.itemid

  let item
  try {
    item = await Item.findById(itemId).populate('creator')
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500,
    )
    return next(error)
  }

  if (!item) {
    const error = new HttpError('Could not find item for this id.', 404)
    return next(error)
  }

  // thelo mono osuer pou eftiakse to item na borei na to kanei delte kai xrisimopio akrivos tin idia logiki pou eixa kai apo pano sto update item method
  if (item.creator.id !== req.userData.userId) {
    const error = new HttpError('You are not allowed to delete this item.', 401)
    return next(error)
  }

  try {
    await item.remove()
    item.creator.items.pull(item)
    await item.creator.save()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete item.',
      500,
    )
    return next(error)
  }

  res.status(200).json({ message: 'Deleted item.' })
}

// kano to function asnyc mias kai xrisimopio to findbyid sto monog
const getItemById = async (req, res, next) => {
  // thelo na paro to id apo to url kai to kano afto apo req.params object kai vazo to onoma san afto pou exo san variable sto url gia paradigma an exo /:itemid tha grapso req.params.itemid

  const itemId = req.params.itemid
  console.log(itemId)
  let item
  try {
    // vazo to populate createor gia na boro na exo to id otan (den perno mono to id apo to creator ala olo to nested object) perno to item apo to user oste na boro na to kano compare me to id pou perno apo to auth middlewrre na PROSEXO OMOS NA AFERO TO CRETOR ID PRIN TO STILO STO FRONT END
    item = await Item.findById(itemId).populate('creator')
  } catch (err) {
    // afto to erro trexei an kati sto request dena itan sostok ai dne boro na pao sto monogdatabase
    const error = new HttpError(
      'Something went wrong, could not find the item.',
      500,
    )
    return next(error)
  }

  //   an dne exo item thelo na stilo error piso sto client, aftos to error trexei an boresa kai pgia sto mongo ala den vriak tipota pou na teriazei sta requeriements mesa sto database
  if (!item) {
    const error = new HttpError(
      'couldnt find an item for the provided id ',
      404,
    )
    // afto eiani gian ato exo san status code otan stelno to midldwre pou tsekaro an exo error,code i vazo apla 500
    return next(error)
  }

  // thelo mono osuer pou eftiakse to item na borei na kanei get to sigkekrimeno item kai xrisimopio akrivos tin idia logiki pou eixa kai apo pano sto update item method (to item.creator.id to perno apo to gegonos oti exo vrei to item afto apoa pano pou epsaska sto database an iparxei to item pou exi os id to id pou pira apo to url kai otan kano save to item sto database kano save kai pios user to exei ftiaksi to sigkekrimeno item ara tora boro na ta tsekaro)
  console.log('item', item.creator)
  console.log('middleware', req.userData.userId)
  if (item.creator.id !== req.userData.userId) {
    const error = new HttpError('You are not allowed to delete this item.', 401)
    return next(error)
  }
  item = item.toObject({ getters: true })
  // kano delete to item komati apo to object oste an min stilo sto front end ola afta pou exoun na kanoun me ton user gia paradigma to eimai tou kai to password tou etc.
  delete item.creator

  // kano olo afto to logic gia ti to object pou perno apo to database exei to user_id san id kai ego gia na mou eaini pio eukolo sto fronted na katalaveno ti diafroa metaksi id tou item kai id tou user pou eftaikse to item apla kano rename to defalut id se user id gia na mou einai pio eukolo
  const old_key = 'id'
  const new_key = 'user_id'
  if (old_key !== new_key) {
    Object.defineProperty(
      item,
      new_key,
      Object.getOwnPropertyDescriptor(item, old_key),
    )
    delete item[old_key]
  }

  //   kai kano return to place mesa sto object pou exei kai kay place kai ouistka einai afto pou vrika apo ta dummy data
  //   to place eiani idio me to na egrafa place:place
  res.json({ item: item }) // => { place } => { place: place } adi gai afto
  // to kano afto giati to perno to object apo to monogose kai thjelo na to metratrepso sto javascriipt object kai to getters:true mou epitrepei to _id pou girano to mongoose sto javascript object apla na grafente id
}

// boro na exo polla places an user gia afto vazo filter instead of find to find girnaei 1 to filter osa miazoun sto requeirement
const getItemsByUserID = async (req, res, next) => {
  const userId = req.params.uid

  let items
  try {
    // edo dne xrisimopio to findby id giati den pernao id ala thelo na vro to item vasi alo field opote firximopio to find kai pernao san argument to id tou tou creator na teriazei me to creator feild pou exo sto database
    items = await Item.find({ creator: userId })
    console.log('eimai sto function giat to get place by id')
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later',
      500,
    )
    return next(error)
  }

  if (!items || items.length === 0) {
    //   kai gia na min etktesethi to epomeno repsonse kano retunr gia na vgo apo to midldlware
    const error = new HttpError(
      'couldnt find a place for the provided user id ',
      404,
    )
    // afto eiani gian ato exo san status code otan stelno to midldwre pou tsekaro an exo error,code i vazo apla 500
    return next(error)
  }

  // thelo to userid pou perno apo to url (diladi to frontend) na eiani to idio pou perno apo to auth middlewrae(dialdi to jwt) giati thelo na vleie ta itmes tou mono o user pou ta exei ftiaksei
  if (userId !== req.userData.userId) {
    const error = new HttpError('You are not allowed to delete this item.', 401)
    return next(error)
  }

  res.json({
    // kano map to array gia na kano convert ola ta objects mesaa sto array se javacript objects
    items: items.map((item) => item.toObject({ getters: true })),
  })
}

// kano exports ta functions pou efitkasa !!!!!!!!!!!!!!!!!!!!!!
exports.createItem = createItem
exports.updateItem = updateItem
exports.deleteItem = deleteItem
exports.getItemById = getItemById
exports.getItemsByUserID = getItemsByUserID
