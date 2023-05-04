import knex from 'knex'

class ContenedorSQL {

    constructor(options,tableName){
        this.database = knex(options);
        this.tableName = tableName;

    }

    async listar(id) {
        try {
            let response = await this.database.from(this.tableName).select("*");
            let results = response.map(elm=>{
                if(elm.products){
                    return {...elm, products:JSON.parse(elm.products)}
                } else{
                    return {...elm}
                }
            });
            return results;
        } catch (error) {
            return [];
        }
    }

    async listarAll() {
        try {
            let response = await this.database.from(this.tableName).select("*");
            let results = response.map(elm=>{
                if(elm.products){
                    return {...elm, products:JSON.parse(elm.products)}
                } else{
                    return {...elm}
                }
            });
            return results;
        } catch (error) {
            return [];
        }
    }

    async guardar(product){
        try {
            if(product.products){
                product.products = JSON.stringify(product.products, null, 2);
            }
            const [userId] = await this.database.from(this.tableName).insert(product);
            return `new product saved with id: ${userId}`
        } catch (error) {
            return {message:`Error al guardar: ${error}`};
        }
    }


    async actualizar(body, id){
        try {
            if(body.products){
                body.products = JSON.stringify(body.products)
            }
            await this.database.from(this.tableName).where("id",id).update(body);
            return {message:"Update successfully"}
        } catch (error) {
            return {message:`Error al actualizar: no se encontró el id ${id}`};
        }
    }

    async borrar(id) {
        try {
            const result = await this.database.from(this.tableName).where("id",id).del();
            if(result === 0){
                return {message:`Error al borrar: No se encontro el id: ${id}`};
            } else{
                return {message:"delete successfully"};
            }
        } catch (error) {
            return {message:`Error al borrar: no se encontró el id ${id}`};
        }
    }

    async borrarAll(){
        try {
            await this.database.from(this.tableName).del();
            return {message:"delete successfully"}
        } catch (error) {
            return {message:`Error al borrar todo: ${error}`};
        }
    }

}

export default ContenedorSQL