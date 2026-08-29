import mongoose , {Schema} from "mongoose";

const wishlistSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    property:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Property"
    }

});

const Wishlist = mongoose.model("Wishlist" , wishlistSchema);
export default Wishlist;