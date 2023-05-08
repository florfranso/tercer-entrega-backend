import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../models/user.model.js"
import bcrypt from 'bcrypt';
import { transporter, adminEmail } from "../messages/gmail.js";
import { logger } from '../loggers/index.js';
import { checkLogged } from "../middlewares/auth.js";


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
        UserModel.findOne({ email: username }, (error, userDB) => {
            if (error) return done(null, false, { message: `Error buscando el usuario ${error}` });
            if (userDB) return done(null, false, { message: "El usuario ya esta registrado" });
            const newUser = {
                email: username,
                password: createHash(password),
                nombre: req.body.nombre,
                direccion: req.body.direccion,
                edad: req.body.edad,
                celular: req.body.celular,
                avatar: req.body.avatar
            }
            UserModel.create(newUser, (error, userCreated) => {
                if (error) return done(null, false, { message: `Error registrando el usuario ${error}` });
                return done(null, userCreated, { message: "Usuario registrado exitosamente" })
            })
            console.log(newUser);
        })
    }
));

passport.use('loginStrategy', new LocalStrategy(
    async function (username, password, done) {
        const existeUsuario = await UserModel.findOne({ email: username })
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
    const errorMsg = req.session.messages ? req.session.messages[0] : '';
    res.render('registro', { error: errorMsg });
    req.session.messages = [];
})

authRouter.post('/register', passport.authenticate('signupStrategy',
    {
        failureRedirect: 'registro-error',
        failureMessage: true
    }), async (req, res) => {
        res.redirect("perfil")
        const emailTemplate = `<div>
            <h1>Datos del usuario</h1>
            <p>Email: ${req.body.email}</p>
            <p>Nombre: ${req.bodynombre}</p>
            <p>Dirección: ${req.body.direccion}</p>
            <p>Edad: ${req.body.edad}</p>
            <p>Teléfono: ${req.body.celular}</p>
            <p>Avatar: ${req.body.avatar}</p>
            </div>`;
        const mailOptions = {
            from: 'servidor node',
            to: adminEmail,
            subject: 'Nuevo usuario registrado',
            html: emailTemplate
        };
        res.send('usuario agregado')
        try {
            await transporter.sendMail(mailOptions)
        } catch (error) {
            logger.error(error)
        }

    })

authRouter.get('/registro-error', (req, res) => {
    res.render('registro-error')
})

authRouter.get('/login', async (req, res) => {
    res.render('login.hbs')
})

authRouter.post('/login', passport.authenticate('loginStrategy',
    {
        successRedirect: 'perfil',
        failureMessage: true,
        failureRedirect: 'login-error'

    })
)

authRouter.get('/perfil', checkLogged, (req, res) => {
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

    }
    res.render('home', { datos: user });

})

authRouter.get('/login-error', (req, res) => {
    res.render('login-error')
})

authRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            throw err
            //res.redirect("/")
        } const user = {
            nombre: req.user.nombre,
        }
        res.render('logout', { datos: user })
    })
})



export { authRouter };