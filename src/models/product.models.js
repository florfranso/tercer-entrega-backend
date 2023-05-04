import mongoose from "mongoose";

const productCollection = "productos";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    price:{
        type:Number,
        required:true,
    },
    thumbnail:{
        type:String,
        required:true
    }
},
{
    timestamps:true
});

export const ProductModel = mongoose.model(productCollection,productSchema);