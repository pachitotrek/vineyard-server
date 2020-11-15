import {Request,Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import generator from 'generate-password';
import { SEED, CADUCIDAD_TOKEN } from "../global/environment";
import modelusuario from '../models/user';


export default class UserController{

    static login(req:Request,res:Response){
        let body = req.body;
        modelusuario.findOne({"user":body.user}).exec((err:any,usuarioDB:any)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        message:"Error",
                        err
                    });
                }
                if(!usuarioDB){
                    return res.status(401).json({
                        ok:false,
                        message:"No se encuentra el usuario"
                    });
                }

                if(!bcrypt.compareSync(body.pass,usuarioDB.pass)){
                    return res.status(400).json({
                        ok:false,
                        message:"Error contraseña incorrectas"
                    });
                }

                let token = jwt.sign({
                    id: usuarioDB.id,
                    user: usuarioDB.user,
                    nombre: usuarioDB.nombre,
                    apellido: usuarioDB.apellido
                }
                    ,SEED , { expiresIn: CADUCIDAD_TOKEN });

                usuarioDB.pass = ":D";   
                return res.status(200).json({
                    ok: true,
                    usuarioDB,
                    token
                });              
        });


    }
    static crearUsuario(req:Request,res:Response){
        let {user,role,pass} = req.body;
        let password = bcrypt.hashSync(pass,10);

        let usuario = new modelusuario({          
            role: role,
            user:user,                    
            pass: password
        });

        usuario.save((err:any, usuarioDB:any) => {
            if (err) {
                console.log(err)
            }

            if (!usuarioDB){
                return res.status(401).json({
                    ok:false,
                    message:"Error "
                })
            }               

            return res.status(200).json({
                ok: true
            });
        });
    }
    static check(req:Request,res:Response){
        let user = req.params.id;

        modelusuario.findOne({"user":user}).exec((err:any,user:any)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error",
                    err
                });
            }
            if (!user) {
                return res.status(200).json({
                    user: true
                });
            }
            return res.status(200).json({
                user: false
            });
        });
    }
    static editarUsuario(req:Request,res:Response){
        let body = req.body;

        modelusuario.updateOne(
            { _id: body.id },
            {
                $set: {
                    nombre: body.nombre,
                    apellido: body.apellido,
                    user: body.user,
                    telefono: body.telefono,
                    biografia: body.biografia                  
                }
            },
            (err:any, usuarioDB:any) => {
                if (err)
                    return res.status(500).json({
                        ok: false,
                        message: " Error al actualizar el producto."
                    });
                if (!usuarioDB)
                    return res.status(404).json({
                        ok: false,
                        message: "No se pudo actualizar"
                    });
                usuarioDB.pass = ":D";
                return res.status(200).json({
                    ok: true,
                    usuarioDB
                });
            });
    }
    static getUser(req:Request,res:Response){
        let id = req.params.id;
        modelusuario.findById(id, { pass: false }, (error:any, usuario:any) => {
            if (error) {
                res.status(500).json({
                    ok: false,
                    error
                });
            }
            if (!usuario) {
                res.status(400).json({
                    ok: false,
                    message: "No se encuentra usuario"
                });
            }

            if (usuario) {
                return res.status(200).json({
                    ok: true,
                    usuario
                });
            }
        });
    }
    static getUsers(req:Request,res:Response){     
        modelusuario.find((error:any, usuario:any) => {
            if (error) {
                res.status(500).json({
                    ok: false,
                    error
                });
            }
            if (!usuario) {
                res.status(400).json({
                    ok: false,
                    message: "No se encuentra usuario"
                });
            }

            if (usuario) {
                return res.status(200).json({
                    ok: true,
                    usuario
                });
            }
        });
    }
    static checkpass(req:Request,res:Response){
        let body = req.body;

        modelusuario
        .findOne({ "_id": body._id })
        .exec((err:any, usuarioDB:any) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error",
                    err
                });
            }
            if (!usuarioDB) {
                return res.status(401).json({
                    ok: false,
                    message: "No se encuentra el Usuario"
                });
            }

            if (!bcrypt.compareSync(body.pass, usuarioDB.pass)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Error Contraseña incorrectas'
                    }
                });
            }
            usuarioDB.pass = ":D";

            if (usuarioDB) {
                UserController.changepass(req,res);
                // UserController.changepass(req, res);
            }

        });

    }
    static changepass(req:Request,res:Response){
        let body = req.body;
        let pass = bcrypt.hashSync(body.pass,10);

        modelusuario
        .findOneAndUpdate({ "_id": body._id }, { "pass": pass })
        .exec((err:any, usuarioDB:any) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error",
                    err
                });
            }
            if (!usuarioDB) {
                return res.status(401).json({
                    ok: false,
                    message: "No se encuentra el Usuario"
                });
            }

            if (usuarioDB) {
                return res.status(200).json({
                    ok: true,
                    message: "Ha Actualizado su Contraseña"
                });
            }
        })
    }
    static recovery(req:Request,res:Response){

    }

    



}