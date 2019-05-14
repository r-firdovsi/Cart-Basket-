const express = require("express")
const session = require("express-session")
const app = express()

app.use(session({
  secret : "k4b105uzk3d1"
}))

app.get("/", (req, res) => {
  let cart = []

  if(req.session.cart) {
    cart = req.session.cart
  }

  // Total Price..
  let cartTotalPrice = 0.0

  cart.forEach(item => {
    cartTotalPrice += item.totalPrice
  })

  console.log("Urunler gonderildi")
  res.status(200).json({
    products : [
      { id: 1, title : "Keci Peyniri", price: 10 },
      { id: 2, title : "Sele Zeytin", price: 15 },
      { id: 3, title : "Petek Bali", price: 40 },
      { id: 4, title : "Visne Receri", price: 5 },
      { id: 5, title : "Danet Kangal Sucuk", price: 17 },
      { id: 6, title : "Kaymak", price: 20 },
      { id: 7, title : "Zeytin Ezmesi", price: 8 }
    ],
    cart : {
      items : cart,
      totalPrice : cartTotalPrice
    }
  })
})

app.post("/add-to-cart", (req, res) => {
  let product = req.body.product

  let cart = []
  // req.session.title =  "Fiko"

  if(req.session.cart) {
    console.log("Session Bulundu")
    cart =  req.session.cart
  }

  if(cart.length > 0) {
    console.log("Sepet Bulundu")
    let itemIndex = cart.findIndex(item => item.id == product.id)

    if(itemIndex > -1) {
      cart[itemIndex].count += product.count
      cart[itemIndex].totalPrice = cart[itemIndex].count * cart[itemIndex].price
    } else {
      cart.push({
        ...product,
        totalPrice : product.count * product.price
      })
    }
  } else {
    cart.push({
      ...product,
      totalPrice : product.count * product.price
    })
  }

  // Total Price..
  let cartTotalPrice = 0.0
  cart.forEach(item => {
    cartTotalPrice += item.totalPrice
  })

  req.session.cart = cart

  res.status(200).json({
    cart: {
      items : req.session.cart,
      totalPrice : cartTotalPrice
    }
  })
})

app.post("/change-count", (req, res) => {
  let product = req.body.product

  let cart = []

  if(req.session.cart) {
    console.log("Session Bulundu")
    cart =  req.session.cart
  }

  if(cart.length > 0) {
    console.log("Sepet Bulundu")
    let itemIndex = cart.findIndex(item => item.id == product.id)
    if(itemIndex > -1) {
      cart[itemIndex].count = product.count
      cart[itemIndex].totalPrice = cart[itemIndex].count * cart[itemIndex].price
    }
  }

  // Total Price..
  let cartTotalPrice = 0.0
  cart.forEach(item => {
    cartTotalPrice += item.totalPrice
  })

  req.session.cart = cart

  res.status(200).json({
    cart: {
      items : req.session.cart,
      totalPrice : cartTotalPrice
    }
  })

})

app.post("/remove-product", (req, res) => {
  let product = req.body.product

  let cart = []
  if (req.session.cart) {
    cart = req.session.cart
  }

  let productIndex = cart.findIndex(item => item.id == product.id)

  if (productIndex > -1) {
    cart.splice(productIndex, 1)
    req.session.cart = cart
  }

  // Total Price..
  let cartTotalPrice = 0.0
  cart.forEach(item => {
    cartTotalPrice += item.totalPrice
  })

  req.session.cart = cart

  res.status(200).json({
    cart: {
      items: req.session.cart,
      totalPrice: cartTotalPrice
    }
  })
})

module.exports = {
  path: "/api",
  handler: app
}
