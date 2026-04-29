import mongoose from 'mongoose'
import {v2 as cloudinary} from 'cloudinary'
import productModel from './models/productmodel.js'
import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'
import * as dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI)
console.log('DB connected')

// Path to your frontend images
const imagesPath = '../frontend/src/assets/frontend_assets'

const products = [
    { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 100, images: ['p_img1.png'], category: "Women", subcategory: "Topwear", sizes: ["S","M","L"], bestseller: true },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 200, images: ['p_img2_1.png','p_img2_2.png','p_img2_3.png','p_img2_4.png'], category: "Men", subcategory: "Topwear", sizes: ["M","L","XL"], bestseller: true },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 220, images: ['p_img3.png'], category: "Kids", subcategory: "Topwear", sizes: ["S","L","XL"], bestseller: true },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 110, images: ['p_img4.png'], category: "Men", subcategory: "Topwear", sizes: ["S","M","XXL"], bestseller: true },
    { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 130, images: ['p_img5.png'], category: "Women", subcategory: "Topwear", sizes: ["M","L","XL"], bestseller: true },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 140, images: ['p_img6.png'], category: "Kids", subcategory: "Topwear", sizes: ["S","L","XL"], bestseller: true },
    { name: "Men Tapered Fit Flat-Front Trousers", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 190, images: ['p_img7.png'], category: "Men", subcategory: "Bottomwear", sizes: ["S","L","XL"], bestseller: false },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 140, images: ['p_img8.png'], category: "Men", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 100, images: ['p_img9.png'], category: "Kids", subcategory: "Topwear", sizes: ["M","L","XL"], bestseller: false },
    { name: "Men Tapered Fit Flat-Front Trousers", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 110, images: ['p_img10.png'], category: "Men", subcategory: "Bottomwear", sizes: ["S","L","XL"], bestseller: false },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 120, images: ['p_img11.png'], category: "Men", subcategory: "Topwear", sizes: ["S","M","L"], bestseller: false },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 150, images: ['p_img12.png'], category: "Men", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 130, images: ['p_img13.png'], category: "Women", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 160, images: ['p_img14.png'], category: "Kids", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Men Tapered Fit Flat-Front Trousers", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 140, images: ['p_img15.png'], category: "Men", subcategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 170, images: ['p_img16.png'], category: "Kids", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Men Tapered Fit Flat-Front Trousers", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 150, images: ['p_img17.png'], category: "Men", subcategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 180, images: ['p_img18.png'], category: "Kids", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 160, images: ['p_img19.png'], category: "Kids", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Women Palazzo Pants with Waist Belt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 190, images: ['p_img20.png'], category: "Women", subcategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 170, images: ['p_img21.png'], category: "Women", subcategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Women Palazzo Pants with Waist Belt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 200, images: ['p_img22.png'], category: "Women", subcategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 180, images: ['p_img23.png'], category: "Kids", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 210, images: ['p_img24.png'], category: "Kids", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 190, images: ['p_img25.png'], category: "Kids", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 220, images: ['p_img26.png'], category: "Women", subcategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 200, images: ['p_img27.png'], category: "Kids", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 230, images: ['p_img28.png'], category: "Men", subcategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 210, images: ['p_img29.png'], category: "Women", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 240, images: ['p_img30.png'], category: "Kids", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 220, images: ['p_img31.png'], category: "Men", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 250, images: ['p_img32.png'], category: "Men", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Girls Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 230, images: ['p_img33.png'], category: "Kids", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 260, images: ['p_img34.png'], category: "Women", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 240, images: ['p_img35.png'], category: "Women", subcategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 270, images: ['p_img36.png'], category: "Women", subcategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Women Round Neck Cotton Top", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 250, images: ['p_img37.png'], category: "Women", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 280, images: ['p_img38.png'], category: "Men", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Men Printed Plain Cotton Shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 260, images: ['p_img39.png'], category: "Men", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 290, images: ['p_img40.png'], category: "Men", subcategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Men Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 270, images: ['p_img41.png'], category: "Men", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Boy Round Neck Pure Cotton T-shirt", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 300, images: ['p_img42.png'], category: "Kids", subcategory: "Topwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Kid Tapered Slim Fit Trouser", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 280, images: ['p_img43.png'], category: "Kids", subcategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 310, images: ['p_img44.png'], category: "Women", subcategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 290, images: ['p_img45.png'], category: "Men", subcategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 320, images: ['p_img46.png'], category: "Men", subcategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Kid Tapered Slim Fit Trouser", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 300, images: ['p_img47.png'], category: "Kids", subcategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 330, images: ['p_img48.png'], category: "Men", subcategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Kid Tapered Slim Fit Trouser", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 310, images: ['p_img49.png'], category: "Kids", subcategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Kid Tapered Slim Fit Trouser", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 340, images: ['p_img50.png'], category: "Kids", subcategory: "Bottomwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Women Zip-Front Relaxed Fit Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 320, images: ['p_img51.png'], category: "Women", subcategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
    { name: "Men Slim Fit Relaxed Denim Jacket", description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", price: 350, images: ['p_img52.png'], category: "Men", subcategory: "Winterwear", sizes: ["S","M","L","XL"], bestseller: false },
]

console.log('Uploading images to Cloudinary and seeding DB...')

for (const product of products) {
    const imageUrls = []
    for (const imgName of product.images) {
        const imgPath = path.join(__dirname, imagesPath, imgName)
        const result = await cloudinary.uploader.upload(imgPath, { resource_type: 'image' })
        imageUrls.push(result.secure_url)
        console.log(`✅ Uploaded ${imgName}`)
    }
    await productModel.create({
        name: product.name,
        description: product.description,
        price: product.price,
        image: imageUrls,
        category: product.category,
        subcategory: product.subcategory,
        sizes: product.sizes,
        bestseller: product.bestseller,
        date: Date.now()
    })
    console.log(`✅ Saved: ${product.name}`)
}

console.log('🎉 All products seeded successfully!')
process.exit(0)