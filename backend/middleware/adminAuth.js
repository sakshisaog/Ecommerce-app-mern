import jwt from 'jsonwebtoken'

const adminauth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.json({ success: false, message: "not authorized" })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        // ✅ check object properties instead of string comparison
        if (token_decode.email !== process.env.ADMIN_EMAIL || 
            token_decode.password !== process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "not authorized" })
        }
        next()

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default adminauth