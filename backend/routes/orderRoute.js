import express from 'express'
import adminauth from '../middleware/adminauth.js'
import {placeorder,placeorderStripe,placeorderRazorpay,allOrders,userOrders,updateStatus} from '../controllers/ordercontroller.js'
import authuser from '../middleware/auth.js'

const orderRouter = express.Router()


// admin features 
orderRouter.post('/list',adminauth,allOrders)
orderRouter.post('/status',adminauth,updateStatus)

// payment features 
orderRouter.post('/place',authuser,placeorder)
orderRouter.post('/stripe',authuser,placeorderStripe)
orderRouter.post('/razorpay',authuser,placeorderRazorpay)

// user features 
orderRouter.post('/userorders',authuser,userOrders )

export default orderRouter