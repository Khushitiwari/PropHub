import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { Server} from 'socket.io';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import propertyRouter from './routes/property.routes.js';
import inquiryRouter from './routes/inquiry.routes.js';
import wishlistRouter from './routes/wishlist.routes.js';
import contactRouter from './routes/contact.routes.js';
import adminRouter from './routes/admin.routes.js';
import chatRouter from './routes/chat.routes.js';

const app = express();
const PORT = 5000;

// database connection
connectDB();


//middlewares 
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
     "http://localhost:5175"

].filter(Boolean);
app.use(cors({
    origin: function (origin , callback) {
        if( !origin || allowedOrigins.includes(origin)){
            callback( null , true );
        }else{
            callback( new Error("Not allowed by CORS"))
        }
    },
    credentials : true
}));
app.use(express.json());

//routes
app.use("/api/auth" , authRouter);
app.use("/api/user" , userRouter);
app.use("/api/property" , propertyRouter);  
app.use("/api/inquiry" , inquiryRouter);   
app.use("/api/wishlist" , wishlistRouter);
app.use("/api/admin" , adminRouter); 
app.use("/api/chat" , chatRouter );
app.use("/api/contact" , contactRouter);
 



app.get("/" , ( req, res) => {
    res.send("API working");
})


const server = http.createServer(app);
//socket.io setup 


const io = new Server(server , {
    cors: {
        origin: allowedOrigins,
        methods: ["GET" , "POST"],
    }
})

io.on("connection" , (socket) =>{
    socket.on("joinChat" , (chatId) =>{
        socket.join(chatId);
    });

    socket.on("sendMessage" , (data) =>{
        io.to(data.chatId).emit("recieveMessage" , data);

    });

    socket.on("disconnect" , () =>{
           
    })
})

server.listen(PORT , () =>{
    console.log(`Server listening on http:/localhost:${PORT}`)
});


