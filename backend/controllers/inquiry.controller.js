import Inquiry from '../models/inquiry.model.js';
import Property from '../models/property.model.js';

export const sendInquiry = async (req, res) =>{
    try{

        const { propertyId , message } = req.body;
        const property = await Property.findById(propertyId).populate("seller");

        if( !property){
            return res.status(404).json({
                success: false,
                message: "Property not found"
            })
        }

        if( property.seller._id.toString() === req.user._id.toString()){
            return res.status(400).json({
                success: false,
                message: "You cannot send inquiry to your own property"
            })
        }
            
        const inquiry = await Inquiry.create({
            property: property._id,
            buyer: req.user._id,
            seller: property.seller._id,
            message

        });

        res.status(201).json({
            success: true,
            message: "Inquiry sent successfully",
            inquiry

        })

    }catch(error){

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}


///seller view inquiries
export  const getSellerInquiries = async (req, res) =>{
    try{
        const inquiries = await Inquiry.find({
            seller:req.user._id
        })
        .populate("buyer" , "name email phone")
        .populate("property" , "title price images city")
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: inquiries.length,    
            inquiries
        })

    }catch(error){

          res.status(500).json({
            success: false,
            message: error.message
        });


    }
}


// mark inquiries read
export const markAsRead = async (req, res) =>{
    try{

        const inquiry = await Inquiry.findById(req.params.id);
        if( !inquiry){
            return res.status(404).json({ 
                success: false,
                message: "Inquiry not found"
            })
        }

        inquiry.isRead = true;
        await inquiry.save();
        
        res.json({
        success: true,
        message: "Inquiry marked as read"
       })

    }catch(error){

           res.status(500).json({
            success: false,
            message: error.message

        });


    }

}