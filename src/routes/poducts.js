//const express = require('express');
import express from 'express'
//const Contenedor = require("../containers/contenedorProductos");
import Contenedor from '../containers/contenedorProductos.js';

const productsRouter = express.Router();

const productosApi = new Contenedor("productos.txt");

productsRouter.get('/',async(req,res)=>{
    const productos = await productosApi.getAll();
   // res.send(productos);
    res.render('products')
});


productsRouter.get('/:id',async(req,res)=>{
    const productId = req.params.id;
    const product = await productosApi.getById(parseInt(productId));
    if(product){
        return res.send(product)
    } else{
        return res.send({error : 'producto no encontrado'})
    }
})

//POST /api/products/
productsRouter.post('/',async(req,res)=>{
    const newProduct = req.body;
    const result = await productosApi.save(newProduct);
    res.send(result);
})

productsRouter.put('/:id',async(req,res)=>{
    const cambioObj = req.body;
    const productId = req.params.id;
    const result = await productosApi.updateById(parseInt(productId),cambioObj);
    res.send(result);
})

productsRouter.delete('/:id',async(req,res)=>{
    const productId = req.params.id;
    const result = await productosApi.deleteById(parseInt(productId));
    res.send(result);
})

//module.exports = {productsRouter:router};
//export default {productsRouter: router}

export default productsRouter;