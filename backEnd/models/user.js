const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String },
  items: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Item' }],

  // gia na ftiakso to connection metaksi userk ai item oste ba exo gia kathe user ola ta items pou eftiakse kai to vazo mesa se array me to [] giro apo to object giati ena user borei na exei multiple items (to array pou exo valei einai ta 2 blue []) !!!!!!!!!!!!
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)

// epidi exo vali to email sto user model na eiani unique xriazete na katevazo ena package pou otan trexo to mondel na borei na teskarei an to email eiani otdo unique, kano isntall to package me
// npm install --save mongoose-unique-validator
