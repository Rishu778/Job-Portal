import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import dotenv from 'dotenv';
import connectDb from './utils/db.js';
import userRoute from "./routes/user.routes.js"
import companyRoute from "./routes/company.routes.js"
import jobRoute from "./routes/job.routes.js"
import applicationRoute from "./routes/application.routes.js"
dotenv.config({});

const app = express();

const PORT = process.env.PORT || 3000;

// middlewares :-
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions={
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));

// api's 
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute)
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);

connectDb().then(()=>{
    app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
    })
})