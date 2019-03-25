/* eslint-disable space-before-blocks */
// Grabs our environment variables from the .env file
require('dotenv').config()

var express = require('express')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var cors = require('cors')
var app = express()

// Environment configuration
// eslint-disable-next-line no-unused-vars
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
var port = process.env.PORT || 3000

// Create a server side router
var router = express.Router()

// Configure express to handle HTTP requests
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(methodOverride())

// Configure our Stripe secret key and object
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Define the route endpoints for our application

// // Create a new charge
// router.post('/charge', function (req, res){
//   // Create the charge object with data from the Vue.js client
//   var newCharge = {
//     amount: 23500,
//     currency: 'usd',
//     source: req.body.token_from_stripe, // obtained with Stripe.js on the client side
//     description: req.body.specialNote,
//     receipt_email: req.body.email,
//     shipping: {
//       name: req.body.name,
//       address: {
//         line1: req.body.address.street,
//         city: req.body.address.city,
//         state: req.body.address.state,
//         postal_code: req.body.address.zip,
//         country: 'US'
//       }
//     }
//   }

//   // Call the stripe objects helper functions to trigger a new charge
//   stripe.charges.create(newCharge, function (err, charge) {
//     // send response
//     if (err){
//       console.error(err)
//       res.json({ error: err, charge: false })
//     } else {
//       // send response with charge data
//       res.json({ error: false, charge: charge })
//     }
//   })
// })

// // Route to get the data for a charge filtered by the charge's id
// router.get('/charge/:id', function (req, res){
//   stripe.charges.retrieve(req.params.id, function (err, charge) {
//     if (err){
//       res.json({ error: err, charge: false })
//     } else {
//       res.json({ error: false, charge: charge })
//     }
//   })
// })

// Index Route
app.get('/', (req, res) => {
  res.send(
    'server is running and key is: ' + process.env.stripePublishableKey
  )
})

// Charge Route
app.post('/charge', (req, res) => {
  const amount = req.body.amount

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
    .then(customer => stripe.charges.create({
      amount,
      description: 'Some Event',
      currency: 'BDT',
      customer: customer.id
    }))
    .then(charge => res.send('success'))
})

// Register the router
app.use('/', router)

// Start the server
app.listen(port, function (){
  console.log('Server listening on port ' + port)
})
