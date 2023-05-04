import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb"

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor(model) {
        super(model)
    }
}

export default ProductosDaoMongoDb