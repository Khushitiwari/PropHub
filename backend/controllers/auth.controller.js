import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

//register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email }); // finding user by email

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // creating random verification code
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isApproved: role === "seller" ? false : true,
      verificationToken,
    });

    try {
      await sendEmail({
        email,
        subject: "Verify your email from PropHub Platform",
        message: `<p> Your email verification code is : <strong>${verificationToken}</strong></p> <p> Plaese enter this verification code to get activaye your account </p>`,
      });
    } catch (error) {
      console.error("Failed to send veification email:", error);
    }

    res.status(201).json({
      message:
        "User registered. Please check your email for the verification code",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: " Email and password are required",
      });
    }

    const user = await User.findOne({ email }); // finding user by email
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email or contact support ",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password , Please check it ",
      });
    }

    if (user.isBlocked) {
      return res.status(400).json({
        message: "Sorry you are blocked by admin. Please conatct support",
      });
    }

    // creating jwt after login
    //         jwt.sign(
    //   payload,
    //   secretKey,
    //   options
    // );
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// to get profile

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
        success: true,
        user,

    });
  } catch (error) {
    res.status(500).json({
        message: error.message
    });

  }
};


//verify the email
export const verifyEmail = async(req, res) =>{
    try{

        const { email , code} = req.body;
        if( !email || !code){
            return res.status(400).json({ message: "Email and code are required"})
        }

        const user = await User.findOne({email});
        if( !user){
            return res.status(404).json({ message: "user not found "});
        }

        if( user.isVerified){
            return res.status(400).json({
                message: "Email is already verified"
            })
        }

        if(user.verificationToken != code){
            return res.status(400).json({ 
                message:" Invalid verification code"
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        res.status(200).json({
            message: "Email verified successfully",
            success: true
        });

    }catch(error){

        res.status(500).json({
            message: error.message,
            success: false
        });

    }
}



//forgot password
export const forgotPassword = async ( req, res ) =>{
    try{
       const { email } = req.body;
       // email se user find krr liya
       const user = await User.findOne({ email });

       if( !user ){
        return res.status(404).json({
            message : "no user found with that email address "
        });
       }

       // agar user mil gyaa toh naya token bana do
       const resetToken = crypto.randomBytes(20).toString("hex");
       const resetPasswordExpire = Date.now() + 15*60*1000; // 15 min me xpire ho jayegaa

       user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
       user.resetPasswordExpire = resetPasswordExpire
       await user.save(); // save krrlo user db me

       const clientUrl = "http://localhost:5173"; // frontend url 
       const resetUrl = `${clientUrl}/reset-passowrd/${resetToken}`;
       const message =  `
           <h2> Password Reset request </h2>
           <p> You requested a password reset. Please click on the link below to reset your password: </p>
           <a href="${resetUrl}" clicktracking="off> ${ resetUrl}</a>
           <p> This link will expire in 15 minutes </p>
       `;

    }catch( error ){
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }

}


// now to reset it (password)
export const resetPassword = async (req, res ) =>{
    try{

        const { token } = req.params;
        const {password} = req.body;

        const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire:{
                $gt : Date.now()
            },
        });

        if( !user){
            return res.status(400).json({
                message: "Invalid or expired password reset token:",
                success:false
            })
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({
            message: " Password updated successfully",
            success : true


        });

    }catch(error){

        res.status(500).json({ message : error.message , success :  false});

    }
}



