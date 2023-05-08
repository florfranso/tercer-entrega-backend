import mongoose from 'mongoose'
mongoose.set('strictQuery', true)
import options from "../config/databaseConfig.js";
import { logger } from "../loggers/index.js";

mongoose.connect(options.mongoDB.mongoUrlSessions, (err) => {
    if (err) return logger.error(`Hubo un error al conectar la base de datos ${err}`);
    logger.info("Base de datos conectada")
});


class ContenedorMongoDb {
    constructor(model) {
        this.model = model;
    }

    async listar(id) {
        try {
            const object = await this.model.findById(id);
            if (!object) {
                return { message: `Error al buscar: no se encontró el id ${id}`, error: true };
            } else {
                return { message: object, error: false };
            }
        } catch (error) {
            return { message: `Hubo un error ${error}`, error: true };
        }
    }

    async listarAll() {
        try {
            const objects = await this.model.find();
            return objects;
        } catch (error) {
            return [];
        }
    }

    async guardar(producto) {
        try {
            const leer = await this.model.find();
            if (leer.length == 0) {
                const id = 1;
                const nuevoProducto = { id: id, ...producto }
                const productAdded = await this.model.create(nuevoProducto)
                return productAdded
            } else {
                const onlyIds = leer.map((producto) => producto.id)
                const largestId = Math.max.apply(Math, onlyIds);
                const id = largestId + 1;
                const nuevoProducto = { id: id, ...producto }
                const productAdded = await this.model.create(nuevoProducto)
                return productAdded
            }
        } catch (error) {
            throw new Error(`Hubo un error al crear el producto ${error.message}`)
        }
    }




    async actualizar(data, id) {
        try {
            await this.model.updateOne({ id: id }, { $set: data })
        } catch (error) {
            throw new Error(`Error para actualizar el producto ${error.message}`)
        }
    }


    async borrar(id) {
        try {
            await this.model.deleteOne({ id: id })
        } catch (error) {
            throw new Error(`Error para borrar el producto ${error.message}`)
        }
    }

    async borrarAll() {
        try {
            await this.model.deleteMany({})
        } catch (error) {
            throw new Error(`Error para borrar los productos ${error.message}`)
        }
    }

    async crearCarrito(email) {
        try {
            await this.model.create({ email: email })
        } catch (error) {
            logger.error(error)
        }
    }

    async agregarProducto(email, carrito) {
        try {
            await this.model.updateOne({ email: email }, { $set: carrito })
        } catch (error) {
            logger.error(error)
        }
    }

    async listarCarrito(email) {
        try {
            const carrito = await this.model.findOne({ email: email })
            return carrito
        } catch (error) {
            logger.error(error)
        }
    }

    async borrarCarrito(email) {
        try {
            await this.model.deleteOne({ email: email })
        } catch (error) {
            logger.error(error)
        }
    }

    async filtrarProductos(id) {
        try {
            const productosFiltrados = await this.model.find({}).sort({ nombre: 1 }).limit(id)
            return productosFiltrados
        } catch (error) {
            logger.error(error)
        }
    }

}

export { ContenedorMongoDb };