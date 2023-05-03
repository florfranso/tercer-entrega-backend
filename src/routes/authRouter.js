import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../models/user.model.js"
import bcrypt from 'bcrypt';
import { transporter, adminEmail } from "../messages/gmail.js";
import { logger } from '../loggers/index.js';

//const LocalStrategy = Strategy;

const authRouter = express.Router();

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
}; 


async function verifyPass(usuario, password) {
    const match = await bcrypt.compare(password, usuario.password)
    return match
}

authRouter.use(express.json());
authRouter.use(express.urlencoded({ extended: true }))



passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    //verificamos si el usuario existe en la base de datos
    UserModel.findById(id, (error, userDB) => {
        return done(error, userDB)

    })
});


passport.use("signupStrategy", new LocalStrategy(
    {
        passReqToCallback: true,
        usernameField: "email"
    },
    (req, username, password, done) => {
        //logica de registro y autenticacion
        //1.Verfiicar si el usuario existe en la base de datos
        UserModel.findOne({ email: username }, (error, userDB) => {
            if (error) return done(null, false, { message: `Error buscando el usuario ${error}` });
            if (userDB) return done(null, false, { message: "El usuario ya esta registrado" });
            //2. si el usuario no existe, registramos al usuario, y guardamos al usuario en la db
            const newUser = {
                email: username,
                password: createHash(password),
                nombre: req.body.nombre,
                direccion: req.body.direccion,
                edad: req.body.edad,
                celular: req.body.celular,
                avatar: req.body.avatar
            }
            //procedemos a guardar al usuario en la base de datos
            UserModel.create(newUser, (error, userCreated) => {
                //userCreated es el usuario con id generado en la db
                if (error) return done(null, false, { message: `Error registrando el usuario ${error}` });
                return done(null, userCreated, { message: "Usuario registrado exitosamente" })
            })
            console.log(newUser);
        })
    }
));

passport.use('loginStrategy', new LocalStrategy(
    async function(username, password, done) 
    {
        const existeUsuario = await UserModel.findOne({email: username})
       //const existeUsuario = await readUser(username)
        if (!existeUsuario) {
            return done(null, false)
        } else {
            const match = await verifyPass(existeUsuario, password)

            if (!match) {
                return done(null, false)
            }
            return done(null, existeUsuario)
        }
    }
))

authRouter.get('/', (req, res) => {
    res.redirect('/login')
})


authRouter.get('/register', (req, res) => {
    //res.send('Escriba sus datos para registrarse')
    const errorMsg = req.session.messages ? req.session.messages[0] : '';
    res.render('registro', { error: errorMsg });
    req.session.messages = [];
})

authRouter.post('/register', passport.authenticate('signupStrategy',
    {
        failureRedirect: 'registro-error',
        failureMessage: true
    }), (req, res) => {
        res.redirect("perfil")
    })


authRouter.get('/registro-error', (req, res) => {
    res.render('registro-error')
})

authRouter.get('/login', async (req, res) => {
    //res.send('Escriba username y password')
    res.render('login.hbs')
})

authRouter.post('/login', passport.authenticate('loginStrategy',
    {
        successRedirect: 'perfil',
        failureMessage: true,
        failureRedirect: 'login-error'

    })
)


authRouter.get('/perfil', (req, res) => {
    const user = {
        nombre: req.user.nombre,
        celular: req.user.celular,
        avatar: req.user.avatar
    }
    res.render('perfil', { datos: user })
})

authRouter.get('/home', (req, res) => {
    const user = {
        nombre: req.user.nombre,
        // email: req.session.email
    }
    res.render('home', { datos: user });

})



/* authRouter.post('/perfil', async(req, res) => {
    const nuevoProducto = req.body;
    const result = await productosApi.save(nuevoProducto);
    res.redirect('/datos')
}) */

authRouter.get('/login-error', (req, res) => {
    res.render('login-error')
})

authRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            throw err
            //res.redirect("/")
        }
        res.render('logout')
    })
})



export { authRouter };