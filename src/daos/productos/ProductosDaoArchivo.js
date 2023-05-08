import ContenedorArchivo from "../../managers/ContenedorArchivo.js"

class ProductosDaoArchivo extends ContenedorArchivo {

    constructor() {
        super('../../files/productos.json')
    }
}

export default ProductosDaoArchivo

/*//crear una subclases de productos que trabaje con el contendor Archivos
class ProductsDaoArchivos extends ContenedorArchivo{
    constructor(filename){
        //ejecutamos el contructor de clase ContenedorArchivo
        super(filename);
    }
} */