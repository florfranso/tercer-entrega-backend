import express from 'express';
import {ContenedorMongoDb }from '../managers/ContenedorMongoDb.js'
import { checkLogged ,userNotLogged } from '../middlewares/auth.js';
import path  from 'path';

import os from 'os'
const numCores = os.cpus().length
import { logger } from '../loggers/index.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const webRouter= express.Router();

webRouter.get('/', checkLogged, (req,res)=>{
    res.render('home',{nombre:req.user.nombre});
}); 


webRouter.get("/login",userNotLogged, (req,res)=>{
    res.render("login");
});


webRouter.get('/logout', (req,res)=>{
    res.render('logout',{username:req.user.username});
});

webRouter.get('/register', (req, res)=>{
    res.render("registro");
})

webRouter.get('/registro-error', (req,res)=>{
    res.render('registro-error')
})

webRouter.get('/login-error', (req, res)=>{
    res.render("login-error")
})


webRouter.get('/info', (req, res) => {
    console.log(`Argumentos de entrada: ${process.argv.slice(2)}\nSistema operativo: ${process.platform}\nVersión de node: ${process.version}\nMemoria total reservada: ${process.memoryUsage().rss}\nPath de ejecucion: ${process.cwd()}\nProcess Id: ${process.pid}\nCarpeta del proyecto: ${path.basename(__dirname)}\nNúmero de procesadores presentes en el servidor: ${numCores}`)
    
    res.send(`<p>Argumentos de entrada: ${process.argv.slice(2)}</p><br><p>Sistema operativo: ${process.platform}</p><br><p>Versión de node: ${process.version}</p><br><p>Memoria total reservada: ${process.memoryUsage().rss}</p><br><p>Path de ejecucion: ${process.cwd()}</p><br><p>Process Id: ${process.pid}</p><br><p>Carpeta del proyecto: ${path.basename(__dirname)}</p><br><p>Número de procesadores presentes en el servidor: ${numCores}</p>`)
})

export default webRouter;