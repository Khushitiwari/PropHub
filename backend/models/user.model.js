
import mongoose , { Schema } from "mongoose";

const userSchema = new Schema({ // user table ho gya usme ye ye columns hoga
    name:{

        type: String,
        required: true,

    },
    email:{

        type:String,
        required: true,
        unique: true

    }, 
    password :{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum :["buyer" , "seller" ,"admin" ], // built-in validator that restricts a string or number field to a specific array of predefined values.
    },
    phone:{
        type: String
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    profilePic:{
        type: String
    },
    address:{
        type: String
    },
     isApproved:{
        type : Boolean,
        default : true
     },
     isVerified:{
      type: Boolean,
      default : false
     },
     verificationToken:{
        type: String,
     },
     resetPasswordToken:{
        type: Date

     }
},{
    timestamps: true
}
);


const User = mongoose.model("User" , userSchema);
 export default User;