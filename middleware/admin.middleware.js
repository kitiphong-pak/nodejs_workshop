module.exports = (req, res, next) =>{
    if(req.user?.role !== "admin") return res.status(401).json({status: 401, message:"สำหรับ Admin เท่านั้น"})
    next()
}