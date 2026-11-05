const jwt = require("jsonwebtoken");

module.exports = (req,res,next) =>{
    try{
        let authHeader = req.headers.authorization
        if(!authHeader) return res.status(401).json({ status: 401, message: "No Token provided" });

        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded;
        next()
    }catch (error){
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
}