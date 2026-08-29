import Wishlist from "../models/wishlist.model.js";

// to add property to wishlist

export const addWishlist = async (req , res) =>{
    try{
        const propertyId = req.body.propertyId;
        const existing = await Wishlist.findOne({
            user:req.user._id,
            property:propertyId
        });

        if(existing){
            return res.status(200).json({
                success: true,
                message: "Property already in wishlist"
            })
        
        
        }

        await Wishlist.create({
            user:req.user._id,
            property:propertyId
        });

        res.status(201).json({
            success: true,
            message: "Property added to wishlist"
        })

    }
    catch(error){

        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

// to get property that is in wishlist

export const getWishlist = async (req, res) => {
    try{

        const data = await Wishlist.find({
            user:req.user._id,

        }).populate(("property")); // populate isliye ki property ki saari fields aaye sirf id hi nhi
        
        res.status(200).json(data);
    }
    catch(error){

        res.status(500).json({
            success:false,
            message: error.message
        })

    }
}


// to remove a property from wishlist
export const removeProperty = async (req, res)=>{
    try{
        const propertyId = req.params.propertyId; // Use req.params when the value is part of the URL path.
        const result = await Wishlist.findOneAndDelete({
            user:req.user._id,
            property:propertyId
        })

        if( !result){
            return res.status(404).json({
                success:false,
                message:"Property wishlist does not exists"
            })
        }

        res.status(200).json({
            success:true,
            message:"Property wishlist deleted successfully"
        })

    }
    catch(error){
         res.status(500).json({
            success:false,
            message: error.message
        })

    }
}