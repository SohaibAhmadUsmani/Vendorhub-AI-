const jwt = require("jsonwebtoken");

function generateJwt(user){
const payload = { id: user._id, email: user.email, role: user.role };

    return  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
    
}

module.exports = { generateJwt };