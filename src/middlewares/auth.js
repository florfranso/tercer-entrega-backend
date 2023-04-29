const checkLogged = (req,res,next)=>{
    //si el usuario tiene sesion activa
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect("/login");
    }
}

const userNotLogged = (req,res,next)=>{
    //si el usuario tiene sesion activa
    if(req.session.username){
        res.redirect("/");
    } else {
        next();
    }
}


//module.exports = {checkLogged, userNotLogged}
export {checkLogged, userNotLogged}