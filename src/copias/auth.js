import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../models/user.model.js"
import bcrypt from 'bcrypt';
import { transporter, adminEmail } from "../messages/gmail.js";
import { logger } from '../loggers/index.js';

//const LocalStrategy = Strategy;

const authRouter = express.Router();

authRouter.use(express.json());
authRouter.use(express.urlencoded({ extended: true }))

async function generateHashPassword(password) {
    const hashPassword = await bcrypt.hash(password, 10)
    return hashPassword
}

async function verifyPass(username, password) {
    const match = await bcrypt.compare(password, username.password)
    return match
}

async function addUser(usuario) {
    try {
        const user = usuario;
        const userSave = new UserModel(user);
        const savedUser = await userSave.save();
        console.log(savedUser, 'dentro de addUser()')
    } catch (error) {
        //logger(error)
        console.log(error)
    }
}

async function readUser(usuario) {
    try {
        const userRead = await model.UserModel.findOne({ email: usuario })
        console.log(userRead, 'leido desde DB mongo')
        return userRead
    } catch (error) {
        //logger(error)
    }
}

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const existeUsuario = await readUser(id);
    done(null, existeUsuario)
})

/* passport.use("signupStategy", new LocalStrategy(
    /* {
        passReqToCallback: true,
        usernameField: "email"
    }, 
    async function (username, password, done) {
        const existeUsuario = await readUser(username)
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
 */

passport.use("signupStrategy", new LocalStrategy(
    {
        passReqToCallback:true,
        usernameField:"email"
    },
    (req,username,password, done)=>{
        //logica de registro y autenticacion
        //1.Verfiicar si el usuario existe en la base de datos
        UserModel.findOne({email:username},(error, user)=>{
            if(error) return done(null, false, {message:`Error buscando el usuario ${error}`});
            if(user) return done(null, false, {message:"El usuario ya esta registrado"});
            //2. si el usuario no existe, registramos al usuario, y guardamos al usuario en la db
            const newUser = {
                email:username,
                password:createHash(password),
                nombre:req.body.nombre,
                direccion: req.body.direccion,
                edad: req.body.edad,
                celular:req.body.celular,
                avatar:req.body.avatar
            }
            //procedemos a guardar al usuario en la base de datos
            UserModel.create(newUser,(error, userCreated)=>{
                //userCreated es el usuario con id generado en la db
                if(error) return done(null, false, {message:`Error registrando el usuario ${error}`});
                return done(null, userCreated,{message:"Usuario registrado exitosamente"})
            })
        })
    }
));


authRouter.use(passport.initialize());
authRouter.use(passport.session())


authRouter.get('/', (req, res) => {
    res.redirect('/login')
})


authRouter.get('/register', (req, res) => {
    //res.send('Escriba sus datos para registrarse')
    res.render('registro')
})

authRouter.post('/register', async (req, res) => {
    const { email, password, nombre, direccion, edad, celular, avatar } = req.body;
    const newUsuario = await readUser(email)

    if (newUsuario) {
        //res.send('Usuario ya existente')
        res.render('registro-error')
    } else {
        const newUser = { email, password: await generateHashPassword(password), nombre, direccion, edad, celular, avatar }
        addUser(newUser)
            /* const emailTemplate = `<div>
                 <h1>Datos del usuario</h1>
                 <p>Email: ${newUser.email}</p>
                 <p>Nombre: ${newUser.nombre}</p>
                 <p>Dirección: ${newUser.direccion}</p>
                 <p>Edad: ${newUser.edad}</p>
                 <p>Teléfono: ${newUser.celular}</p>
                 <p>Avatar: ${newUser.avatar}</p>
                 </div>`;
             const mailOptions = {
                 from: 'servidor node',
                 to: adminEmail,
                 subject: 'Nuevo usuario registrado',
                 html: emailTemplate
             };*/
            //res.send('usuario agregado')
            / res.render('login')
        /*try {
            await transporter.sendMail(mailOptions)
        } catch (error) {
            logger.error(error)
        }*/
    }
})

authRouter.get('/login', async (req, res) => {
    //res.send('Escriba username y password')
    res.render('login.hbs')
})

authRouter.post('/login', passport.authenticate('signupStrategy',
    {
        successRedirect: '/perfil',
        failureMessage: true,
        failureRedirect: '/login-error'

    })
)

authRouter.get('/perfil', (req, res) => {
    const user = {
        nombre: req.session.nombre,
        telefono: req.session.celular,
        avatar: req.session.avatar
    }
    // res.send(`Usted inicio sesion ${JSON.stringify(user)}`)
    res.render('perfil', { datos: user })
})

authRouter.get('/home', (req, res) => {
    const datosUsuario = {
        nombre: req.session.nombre,
        email: req.session.email
    }
    res.render('home', { datos: datosUsuario });
})



/* authRouter.post('/perfil', async(req, res) => {
    const nuevoProducto = req.body;
    const result = await productosApi.save(nuevoProducto);
    res.redirect('/datos')
}) */

authRouter.get('/login-error', (req, res) => {
    //res.send('Error al loguearse')
    res.render('login-error')
})

authRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            throw err
            //res.redirect("/")
        }
        //res.send('Sesion finalizada')
        res.render('logout')
    })
})



//export { authRouter };