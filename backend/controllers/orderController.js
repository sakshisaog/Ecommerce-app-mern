import orderModel from '../models/ordermodel.js'
import userModel from '../models/usermodel.js'



// placing orders using COD 
 const placeorder = async (req , res) =>{

    try {
        const {userId,items,amount,address} = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:'COD',
            payment:'false',
            date:Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findOneAndUpdate({_id:userId},{cartData:{}})
        res.json({success:true,message:'order placed'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

 }
// placing orders using stripe 
 const placeorderStripe = async (req , res) =>{

 }
// placing orders using razorpay 
 const placeorderRazorpay = async (req , res) =>{

 }
// all orders data for admin 
 const allOrders = async (req , res) =>{
    try {
        const orders = await orderModel.find({})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

 }
// user order data for frontend 
 const userOrders  = async (req , res) =>{
    try {
        const {userId} = req.body
        const orders = await orderModel.find({userId})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

 }
// update order status from  admin panel
 const updateStatus = async (req , res) =>{

    try {
      const {orderId,status} = req.body

      await orderModel.findByIdAndUpdate(orderId,{status})
      res.json({success:true,message:'status Updated'})


    } catch (error) {
         console.log(error)
        res.json({success:false,message:error.message})
        
    }

 }

 export  {placeorder,placeorderStripe,placeorderRazorpay,allOrders,userOrders,updateStatus}