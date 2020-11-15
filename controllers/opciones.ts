import modelOpciones from '../models/opciones';
import {Request,Response } from "express";

export default class OpcionesController{

    static crear(req:Request,res:Response){
        let {titulo} = req.body;
       

        let opcion = new modelOpciones({
            titulo       
        });    

        opcion.save((err:any, opcion:any) => {
            if (err) {
                console.log(err)
            }

            if (!opcion){
                return res.status(401).json({
                    ok:false,
                    message:"Error "
                })
            }   


            return res.status(200).json({
                ok: true,
                opcion
            });
        });
    }
    static editar(req:Request,res:Response){
        let {_id,titulo,tipo} = req.body;         

        modelOpciones.findByIdAndUpdate(_id,{$set:{
            titulo        
        }}).exec((err:any,opcion:any)=>{
            if (err) {
                console.log(err)
            }

            if (!opcion){
                return res.status(401).json({
                    ok:false,
                    message:"Error "
                })
            }               

            return res.status(200).json({
                ok: true,
                opcion
            });
        });  
    }
    static get(req:Request,res:Response){
        modelOpciones.find().exec((error:any,opcion:any)=>{
            if (error) {
                return res.status(501).json({
                    ok:false,
                    error    
                })
            }

            if (!opcion){
                return res.status(401).json({
                    ok:false,
                    message:"Error "
                })
            }               

            return res.status(200).json({
                ok: true,
                opcion
            });

        }); 
    }
    static delete(req:Request,res:Response){
        let id = req.params.id;

        modelOpciones.deleteOne({_id:id}).exec((err:any,opcion:any)=>{
            if (err) {
                return res.status(501).json({
                    ok:false,
                    message:"Error "
                })
            }

            if (!opcion){
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

}
