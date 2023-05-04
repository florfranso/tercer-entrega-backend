import { promises as fs } from 'fs'
import config from '../config/databaseConfig.js';
import { logger } from '../loggers/loggers.js';

class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = `${config.fileSystem.path}/${ruta}`;
    }

    async listar(id) {
        try {
            const leer = await fs.readFile(this.ruta, "utf-8")
            const data = JSON.parse(leer)
            const obj = data.find (obj => obj.id === id);
            if(!obj){
                return null
            }
            return obj
        } catch (e) {
            logger.log(e)
        }
        
    }

    async listarAll() {
        try {
            const leer = await fs.readFile(this.ruta, "utf-8")
            return JSON.parse(leer)
        } catch (e) {
            logger.log(e)
        }
    }

    async guardar(obj) {
        try {
            const leer = await fs.readFile(this.ruta, "utf-8");
            const data = JSON.parse(leer)
            let id;
            data.length === 0
                ? (id = 1)
                : (id = data[data.length - 1].id + 1);
            const newProduct = { ...obj, id };
            data.push(newProduct);
            await fs.writeFile(this.ruta, JSON.stringify(data, null, 2), "utf-8")
            return newProduct.id;
        } catch (e) {
            logger.log(e)
        }
    }

    async actualizar(elem) {
        let objs = await this.getAll();
		try {
			const obj = objs.find(obj => obj.id == id);
			if (obj) {
				const index = objs.indexOf(obj);
				const { title, price, thumbnail } = elem;
				objs[index]['title'] = title;
				objs[index]['price'] = price;
				objs[index]['thumbnail'] = thumbnail;
				await this.writeFile(objs);
				return true;
			}
		} catch (error) {
			logger.log(error.message);
		}
    }

    async borrar(id) {
        try {
            const leer = await fs.readFile(this.ruta, "utf-8")
            const data = JSON.parse(leer)
            const obj = data.find (obj => obj.id !== id);
            await fs.writeFile(this.path, JSON.stringify(obj, null, 2), "utf-8")

        } catch (e) {
            logger.log(e)
        }
    }

    async borrarAll() {
        try {
            await fs.writeFile(this.ruta, JSON.stringify([], null, 2), "utf-8")
        } catch (e) {
            logger.log(e);
        }
    }
}


export default ContenedorArchivo