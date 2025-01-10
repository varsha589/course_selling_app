const JWT_USER_SECRET = "a006jiokdnnmplei904";
const JWT_ADMIN_SECRET = "an76ddkfilw3904";

const jwt = require("jsonwebtoken");

function userMiddleware(req, res , next){
  const token = req.headers.token
  try{
    const decodeddata = jwt.verify(token,JWT_USER_SECRET);

      req.userId = decodeddata.id;
      next();
    
  }catch(e){
    return res.status(403).json({
      errmsg : "You are not authenticated"
    })
  }
}

function adminMiddleware(req, res , next){
    const token = req.headers.token
    try{
      const decodeddata = jwt.verify(token,JWT_ADMIN_SECRET);
  
        req.userId = decodeddata.id;
        next();
      
    }catch(e){
      return res.status(403).json({
        errmsg : "You are not authenticated"
      })
    }
  }

module.exports = {
    userMiddleware,
    adminMiddleware
}