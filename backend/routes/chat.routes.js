import express from "express"

import Chat from '../models/chat.model.js';
import { protect } from '../middlewares/auth.js';

const chatRouter = express.Router();

chatRouter.use(protect);

// to create a chat
chatRouter.post("/start" , async(req,res)=>{
    try{
        const { propertyId , sellerId , buyerId:providedBuyerId } = req.body;
        let buyerId , finalSellerId;

        if( req.user.role == "seller"){
            buyerId = providedBuyerId;
            finalSellerId = req.user._id;
        }else{
            buyerId = req.user._id;
            finalSellerId = sellerId
        }

        if( !buyerId || !finalSellerId ){
          res.status(400).json({
            message:"Missing buyer or seller id"
          });
        }

        // chat for an existing chat between this buyer and seller
        let chat = await Chat.findOne({
            buyer: buyerId,
            seller:finalSellerId
        });

        if( !chat ){
            chat =  await createImageBitmap({
                property: propertyId,
                buyer: buyerId,
                seller: finalSellerId,
                messages: []
            })
        }

        chat = await Chat.findById(chat._id)
        .populate("buyer" , " name email profilePic")
        .populate("seller", " name email profilePic")
        .populate("property" , "title price images");
        res.json(chat);



    }
    catch(error){

        res.status(500).json({
            message:"Error creating chat or getting previous ones",
            error:error.message
        })

    }
} );

// to send message
chatRouter.post("/send" , async(req, res) =>{
    try{
        const { chatId , text , image} = req.body;
        const userId = req.user.id;

        const chat = await Chat.findById(chatId);
        if( !chat ) return res.status(404).json({
            message:"Chat not found"
        });
        // ensure sender is part of this chat
        if( chat.buyer.toString() !== userId && chat.seller.toString() !== userId){
            return res.status(403).json({
                message: "Not authorzed to send message in this chat"
            });
        }

        const newMsg = {
            sender:userId,
            text,
            image,
            createdAt: new Date()
        }

        chat.message.push(newMessage);
        await chat.save();

        const savedMsg = chat.message[chat.message.length -1];
        res.json({chat , newMessage:savedMessage});

    }
    catch(error){

        res.status(500).json({
            message: "Error sending message",
            error:error.message
        })

    }
})

// to get chats for user 
chatRouter.get("/user" , async (req, res) =>{
    try{
        const userId =  req.user._id;
        const chats = await Chat.find({
            $or: [{buyer :userId} , {seller : userId}]
        })

        .populate("buyer" , " name email profilePic")
        .populate("seller", " name email profilePic")
        .populate("property" , "title price images")
        .sort({ updatedAt: -1});

    }
    catch(error){
        res.status(500).json({
            message: "Error fatching user chats",
            error: error.message


        })
    }   
})


// to get chat message
chatRouter.get("/:chatId" , async (req , res) => {
    try {
        const chat = await Chat.findById(req.params.chatId).populate(
            "message.sender",
            "name profilePic"
        );

        if( !chat) return res.status(404).json({ message:"Chat not found "});
        const userId = req.user._id.toString();
        if( chat.buyer.toString()  !== userId && chat.seller.toString() !== userId){
            return res.status(403).json({
                message:"You are not authorized"

            })
        }

        res.json(chat);
        
    }
    catch(error) {

        res.status(500).json({
            message:"Error fetching chat message",
            error:error.message
        });

    }
}) 

//to delete an entire chat
chatRouter.delete("/:chatId" , async (req,res) =>{
    try{
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);

        if( !chat ) return res.status(404).json({
            message:"Chat not found"
        });

        // now ensure the user is part of the chat
        if( chat.buyer.toString() !== userId.toString() && chat.seller.toString() !== userId.toString()){
            return res.status(403).json({
                message:"You are not authozed to chat here"
            })
        }

        await Chat.findByIdAndDelete(req.params.chatId);
        res.json({ message:" chat deleted successfully!"});




    }
    catch(error){

        res.status(500).json({
            message : "Error fetching chat messsage",
            error: error.message
        })

    }
})


// to delete a specific message
chatRouter.delete("/:chatId/message/:messageId" ,  async (req, res) =>{
    try{
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);

        if( !chat ) return res.status(404).json({
            message:"Chat not found"
        });
        const message = chat.messages.id(req.params.messageId);
        if(!message) return res.status(404).json({
            message:"Message not found"

        });

        // only sender can delete their message
        if( message.sender.toString() !== userId.toString() ){
            return res.status(403).json({
                message: "You cannot delete others msg"
            })
        }
        
        chat.messages.pull(req.params.messageId);
        await chat.save();
        res.json({message: "Message deleted successfully " , chat});


    }
    catch(error){

        res.status(500).json({
            message:"Error fetching chat message",
            error:error.message
        })

    }
})

export default chatRouter;