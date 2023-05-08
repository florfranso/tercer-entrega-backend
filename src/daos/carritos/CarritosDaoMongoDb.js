import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"

class CarritosDaoMongoDb extends ContenedorMongoDb {

   /*  constructor(model){
        super(model)
    }
} */
    constructor() {
        super('carritos', {
            email: {type: String, require: true}, 
            productos: { type: [], required: true }
        })
    }

    async guardar(carrito = { productos: [] }) {
        return super.guardar(carrito)
    }
}

export default CarritosDaoMongoDb