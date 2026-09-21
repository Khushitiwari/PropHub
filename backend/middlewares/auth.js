
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// protect
export const protect = async( req, res , next) =>{
    try{

        let token;
        if(
            req.headers.authorization
            &&
            req.headers.authorization.startsWith("Bearer")

        ){
            token = req.headers.authorization.split(" ")[1];
        }

        if( !token ){
            return res.status(401).json({
                success:false,
                message: "Not authorized , token missing"
            });
        }

        const decoded = jwt.verify( token , process.env.JWT_SECRET);
        req.user = await User.findById( decoded.id).select("-password");

        if( req.user && req.user.isBlocked ){
            return res.status(403).json({
                success :false ,
                message:"Your account has been blocked by an admin"
            })
        }

        next();

    }catch(error){
        res.status(401).json({
          success: false,
          message:"Token invalid"
        });
    }
}


// export const protect = async (req, res, next) => {
//   try {
//     let token;

//     const authHeader = req.headers.authorization;

//     // 1. Check what frontend is sending
//     console.log("AUTH HEADER:", authHeader);

//     if (
//       authHeader &&
//       authHeader.startsWith("Bearer ")
//     ) {
//       token = authHeader.split(" ")[1];
//     }

//     // 2. Check the extracted token
//     console.log("TOKEN RECEIVED:", token);

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized, token missing",
//       });
//     }

//     // 3. Verify JWT
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     // 4. Check decoded JWT
//     console.log("DECODED TOKEN:", decoded);

//     req.user = await User.findById(decoded.id).select("-password");

//     if (req.user && req.user.isBlocked) {
//       return res.status(403).json({
//         success: false,
//         message: "Your account has been blocked by an admin",
//       });
//     }

//     next();

//   } catch (error) {

//     // 5. If jwt.verify() fails, this tells us WHY
//     console.log("JWT ERROR:", error.name, error.message);

//     return res.status(401).json({
//       success: false,
//       message: "Token invalid",
//     });
//   }
// };



///role based authentication
export const authorize = (...roles) =>{
    return (req, res , next) =>{
        if( !roles.includes(req.user.role)){
            return res.status(403).json({
              success: false,
              message: "Access Denied. You don't have permission "

            });
           
        }
        next();

    }
}
