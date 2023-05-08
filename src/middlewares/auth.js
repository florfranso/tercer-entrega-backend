const checkLogged = (req,res,next)=>{
    //si el usuario no tiene sesion activa
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect("/login");
    }
}

const userNotLogged = (req,res,next)=>{
    if(req.session.username){
        res.redirect("/");
    } else {
        next();
    }
}



export {checkLogged, userNotLogged}