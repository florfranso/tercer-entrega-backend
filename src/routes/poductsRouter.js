import express from 'express'
import Contenedor from '../containers/contenedorProductos.js';

const productsRouter = express.Router();

const productosApi = new Contenedor("productos.json");

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



export {productsRouter};


/*
const options = require("../../controllers/options.js");
const knex = require("knex");
const connectionMySql = knex(options.mysql);
const connectionSqlite3 = knex(options.sqlite3);
const Contenedor = require("../../controllers/SQLcontroller.js");
const productos = new Contenedor(connectionMySql, "products");
const messages = new Contenedor(connectionSqlite3, "messages");
const notFound = { error: "Producto no encontrado" };


router.get("/", async (req, res) => {
    const arrayProductos = await productos.getAll();
    res.render("formulario", {
        productos: arrayProductos,
        style: "formulario.css",
        title: "Productos con Handlebars",
    });
});

router.post("/", async (req, res) => {
    const data = req.body;
    await productos.save(data);
    res.status(201);
});

module.exports = router;*/