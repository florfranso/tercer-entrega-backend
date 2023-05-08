import express from 'express';
import { checkLogged } from '../middlewares/auth.js';
import { transporter, adminEmail } from "../messages/gmail.js";
import { carritosDao, productosDao } from '../daos/index.js';
//import { productosDao } from '../daos/index.js';
import {ContenedorMongoDb} from '../managers/ContenedorMongoDb.js'
import { twilioWapp, adminWapp, twilioClient } from '../messages/waap.js';

const carritosRouter = express.Router();
const carritosApi = new ContenedorMongoDb ('carritos.json')

carritosRouter.post('/', checkLogged, async (req, res) => {
    const email = req.user.email
    const carrito = await carritosApi.listarCarrito(email)
    if(carrito) {
        res.send('Usted ya dispone de un carrito')
    } else {
        await carritosApi.crearCarrito(email)
        res.send(`Carrito creado`)
    }
    
})

carritosRouter.get('/', checkLogged,  async (req, res) => {
    const user = {
        nombre: req.user.nombre,
        telefono: req.user.celular,
        avatar: req.user.avatar
    }
    const email = req.user.email
    const carrito = await carritosApi.listarCarrito(email)
    res.send(`Sus datos son ${JSON.stringify(user)}\n Este es su carrito: ${carrito}`)
})

carritosRouter.put('/productos', checkLogged, async (req, res) => {
    const email = req.user.email
    const carrito = await carritosApi.listarCarrito(email)
    const producto = await carritosApi.listar(req.body.id)
    carrito.productos.push(producto)
    await carritosApi.agregarProducto(email, carrito)
    res.send("Carrito actualizado")
})

carritosRouter.delete('/', checkLogged, async (req, res) => {
    const email = req.user.email
    await carritosApi.borrarCarrito(email)
    res.send("Carrito borrado")
})
carritosRouter.get('/comprar', checkLogged, async (req, res) => {
    const email = req.user.email
    const carrito = await carritosApi.listarCarrito(email)
    const productos = carrito.productos
    const nombresYPrecios = productos.map((elemento) => {
        return {
            nombre: elemento.title,
            precio: elemento.price,
            imagen: elemento.thumbnail
        }
    })
    const emailTemplate = `<div>
            <h1>Datos de compra</h1>
            <p>${JSON.stringify(nombresYPrecios)}</p>
            </div>`;
        const mailOptions = {
            from: 'servidor node',
            to: adminEmail,
            subject: `Nuevo pedido de ${req.user.nombre}, ${req.user.email}`,
            html: emailTemplate
        };
        try {
            await transporter.sendMail(mailOptions)
        } catch (error) {
            logger.error(error)
        }
        try {
            const info = await twilioClient.messages.create({
                from:twilioWapp,
                to:adminWapp,
                body:`Nuevo pedido de ${req.user.nombre}, ${req.user.email}`
            });
        } catch (error) {
            logger.error(error)
        }
    await carritosDao.borrarCarrito(email)
    res.send(`Ha realizado la compra de:\n ${JSON.stringify(nombresYPrecios)}\n y se le ha enviado un mail con los datos`)
}) 

export {carritosRouter}