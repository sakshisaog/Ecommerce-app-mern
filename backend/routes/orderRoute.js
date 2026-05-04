import express from 'express'
import adminauth from '../middleware/adminauth.js'
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay
} from '../controllers/orderController.js'
import authuser from '../middleware/auth.js'

const orderRouter = express.Router()

// admin features 
orderRouter.post('/list', adminauth, allOrders)
orderRouter.post('/status', adminauth, updateStatus)

// payment features 
orderRouter.post('/place', authuser, placeOrder)
orderRouter.post('/stripe', authuser, placeOrderStripe)
orderRouter.post('/razorpay', authuser, placeOrderRazorpay)

// user features 
orderRouter.post('/userorders', authuser, userOrders)

// verify payment
orderRouter.post('/verifyStripe', authuser, verifyStripe)
orderRouter.post('/verifyRazorpay', authuser, verifyRazorpay)

export default orderRouter