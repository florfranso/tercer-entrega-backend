import express from 'express'
import { checkLogged } from '../middlewares/auth.js';
import {checkAdminRole} from '../middlewares/checkRole.js'
import { productosDao } from '../daos/index.js';
import { ContenedorMongoDb } from '../managers/ContenedorMongoDb.js'
import { logger } from "../loggers/index.js";
import {ProductModel} from '../models/product.models.js'


const productsRouter = express.Router();

const productosApi = new ContenedorMongoDb (ProductModel);

//LISTAR PRODCUTOS
productsRouter.get('/',  async (req, res) => {
    try {
        res.render('productos.hbs', { productos: await productosApi.listarAll() })
    } catch (error) {
        logger.error(error.message)
    }
});


//POST /api/products/
productsRouter.post('/', checkAdminRole, async (req, res) => {
    const data = req.body;
    const productId = await productosApi.guardar(data)
    res.send(`Producto guardado con id ${productId}`)
    res.json({productId})
})



productsRouter.get('/:id', async (req, res) => {
    const productId = req.params.id;
    const product = await productosApi.listar(parseInt(productId));
    res.json(product)
    res.send( product )
})


productsRouter.put('/:id', checkAdminRole, async (req, res) => {
    const id = req.params.id;
    const response = await productosApi.actualizar(req.body, id);
    res.json(response);
    res.send("producto actualizado")
})

productsRouter.delete('/:id', checkAdminRole, async (req, res) => {
    const productId = req.params.id;
    const response = await productosApi.borrar(productId);
    res.send("Producto eliminado")
    res.json (response);
})

productsRouter.delete('/', checkAdminRole, async (req, res) => {
    await productosApi.borrarAll()
    res.send("Colección borrada")
})

export { productsRouter };





