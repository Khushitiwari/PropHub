import Property from "../models/property.model.js";
import User from "../models/user.model.js";
import Inquiry from "../models/inquiry.model.js";

// view all users
export const getAllUsers = async (req, res) => {
  try {
    // selecting all users by removing password field
    const users = await User.find().select("-password");

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Block a particular user
export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: user.isBlocked ? "User blocked" : "User unblocked",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// to delete a particular user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// view all properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("seller", "name email");
    res.json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// to delete a particular property
export const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// to view all inquiries
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("property", "title price")
      .sort({ createdAt: -1 });

    /* we can also populate multiple field like this :
    .populate([
      { path: "buyer", select: "name email" },
      { path: "seller", select: "name email" },
      { path: "property", select: "title price" }
     ])

    */

    res.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Dashboard analytics
export const getDashboardStats = async (req, res) =>{
    try{
     const totalUsers = await User.countDocuments();
     const totalProperty = await Property.countDocuments();

     const activeListings = await Property.countDocuments({
        status:"sale"
     });

     const soldProperties = await Property.countDocuments({
        status:"sold"
     })

     res.json({
        success:true,
        stats:{
            totalUsers,
            totalProperty,
            activeListings,
            soldProperties
        }
     })

    }
    catch(error){
        res.status(500).json({
      success: false,
      message: error.message,
    });

    }
}


// to get pending seller account

export const getPendingSeller = async (req, res) =>{
    try{
      
        const pendingSellers = await User.find({
            role:"seller",
            isApproved:false

        }).select("-password");

        res.json({
            success:true,
            count:pendingSellers.length,
            pendingSellers
        })

    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        })

    }


}

// to approve the pending seller

export const approveSeller = async (req,  res) =>{
    try{

        const seller = await User.findById(req.params.id);

        if(!seller || seller.role !== "seller"){
            return res.status(404).json({
                success:false,
                message:"seller not found"
            });
        }

        seller.isApproved= true;
        await seller.save();

        res.json({
            success:true,
            message:"Seller approved successfully",
            seller
        });


    }
    catch(error){

          res.status(500).json({
            success:false,
            message:error.message
        })

    }
}