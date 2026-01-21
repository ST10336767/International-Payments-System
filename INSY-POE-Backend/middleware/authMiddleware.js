const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    // Try to get token from cookie first (preferred method)
    let token = req.cookies?.token;
    
    // Fallback to Authorization header for backward compatibility
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }
    
    if (!token) {
        return res.status(401).json({message: "Unauthorised"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        //to put user id - apparently uses sub
        req.user = {
            id: decoded.sub || decoded.id,
            role: decoded.role,
            accountNumber: decoded.accountNumber 
        };
        next();
    } catch(_err){
        res.status(403).json({ message: "Token invalid or expired"});
    }
};

//Added for rbac
//require specific role
function requireRole(...roles){
    return (req, res, next) => {
        if(!req.user) {
            return res.status(401).json({ message: "Unauthorised"});
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({message: "Forbudden: Insufficient role"});
        }

        next();
    };
}


module.exports = {protect, requireRole};