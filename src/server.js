import express from 'express'
import session from 'express-session'
import handlebars from 'express-handlebars'
//para poder usar los archivos de las vistas
import path, { join } from 'path'
//libreria para encriptar contraseña
import options from './config/databaseConfig.js';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';
//variables de entorno
import dotenv from 'dotenv';
dotenv.config()
//cluster
import cluster from 'cluster';
import os from 'os'
const numCores = os.cpus().length

import { logger } from './loggers/index.js';
import compression from 'compression';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//const productosApi = new Contenedor('productos.json')


//routers
import {productsRouter} from './routes/poductsRouter.js';
import webRouter from './routes/webRoutes.js';
import {authRouter} from './routes/authRouter.js'




//server
const app = express();
const PORT = options.server.PORT;

if (options.server.MODO === "CLUSTER" && cluster.isPrimary) {
    //modo cluster
    for (let i = 0; i < numCores; i++) {
        cluster.fork();
    };

    cluster.on("exit", (worker) => {
        console.log(`proceso ${worker.process.pid} murio`);
        cluster.fork();
    });
} else {
    //modo fork
    //app.use(compression());
    const server = app.listen(PORT, () => {
        console.log(`Servidor escuchando en puerto ${JSON.stringify(PORT)} con el proceso ${process.pid}`);
    })
    server.on('error', error => {
        console.error(`Error en el servidor ${error}`);
    });

    app.use(express.json()); //lectura de json desde el cuerpo de la peticion
    app.use(express.urlencoded({ extended: true })); //lectura de json desde un metodo post de formulario
    //archivos estaticos
    app.use(express.static('src/public')); //ruta carpeta publica

    
    //configuracion template engine handlebars
    app.set('views', 'src/views');
    app.engine('.hbs', handlebars.engine({
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'), 'layouts'),
        extname: '.hbs'
    }));
    app.set('view engine', '.hbs');


    //configuracion de la session
    app.use(cookieParser());
    app.use(session({
        //definir el sistema donde vamos a almacenar las sesiones
        store: MongoStore.create({
            mongoUrl: options.mongoDB.mongoUrlSessions,
            ttl: 600
        }),
        secret: process.env.SECRET_KEY,
        //definimos que se usara un almacenamiento externo para la sesiones.
        resave: false,
        saveUninitialized: false,
        /* cookie: {
            maxAge: 20000 //20seg
        } */
    }));

    //configurar passport
    app.use(passport.initialize());//inicializar passport dentro de nuestro servidor
    app.use(passport.session());
    app.use(compression());
    app.use((req, res, next) => {
        console.log();(`${req.method} ${req.url}`)
        next()
    })
    app.use('*', (req, res, next) => {
        console.log();(`${req.method} ${req.originalUrl}- ruta no encontrada`)
        next()
    })

    // routes
    //view routes
    app.use(webRouter);
    //api routes
    app.use('/api/products', productsRouter);
    app.use('/api/auth', authRouter);
    app.use('/logout', webRouter);
    app.use('/info', webRouter)
   
}



