import { response } from "express";
import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Stripe from 'stripe'
import Razorpay from 'razorpay'
import crypto from "crypto";


// global variables
const currency = 'usd'
const deliveryCharge = 10

//Initialize Gateway
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
//Placing order using COD
const placeOrder = async (req, res)=> {
    try {
        const {userId, items, amount, address} = req.body;
        
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)

        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({success: true, message: 'Order Placed'})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
}

//Placing order using Stripe
const placeOrderStripe = async (req, res)=> {
    try {
        const {userId, items, amount, address} = req.body;
        const {origin} = req.headers

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item)=>({
            price_data:{
                currency:currency,
                product_data: {
                    name: item.name,
                },
                    unit_amount: item.price * 100
                },
                quantity: item.quantity

        }))

        line_items.push({
            price_data:{
                currency:currency,
                product_data: {
                    name: 'Delivery Charges',
                },
                    unit_amount: deliveryCharge * 100
                },
                quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`, 
            cancel_url: `${origin}/place-order`,
            line_items,
            mode: 'payment' ,
        })

        res.json({success:true, session_url:session.url})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
}

//Verify Stripe 
const verifyStripe = async (req, res) => {
    const{orderId, success, userId} = req.body
    try {
        if(success === 'true'){
            await orderModel.findByIdAndUpdate(orderId, {payment:true})
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success:true})
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})  
    }
}
//Placing order using RazorPay
const placeOrderRazorpay = async (req, res)=> {
    try {
        const {userId, items, amount, address} = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'RazorPay',
            payment: false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()


        const options = {
            amount: amount * 100,
            currency: currency.toLocaleLowerCase(),
            receipt: newOrder._id.toString(),
        };
        await razorpayInstance.orders.create(options, (err, order) => {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: err.message });
            }
            res.json({success:true,order})

        })
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})

    }
    
}
//verify Razorpay
const verifyRazorpay = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      userId
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true, message: "Payment Successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Invalid signature" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
       
// All orders data for admin panel
const allOrders = async (req, res)=> {
    try {
        const orders = await orderModel.find({})
        res.json({success:true, orders})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// User order data for frontend
const userOrders = async (req, res)=> {
    try {
        const {userId} = req.body
        const orders = await orderModel.find({userId})
        res.json({ success: true, orders }); 
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// Update order status from admin panel
const updateStatus = async (req, res)=> {
    try {
        const {orderId, status} = req.body
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success:true, message:'Status Updated'})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// export {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe, verifyRazorpay}
export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay
};
