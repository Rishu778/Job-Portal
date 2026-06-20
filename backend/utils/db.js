import mongoose from "mongoose";

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.mongo_url).then(()=> console.log("Mongo Db Connected Successfully"));
    }catch(err){
        console.log(err);
    }
} 

export default connectDb;