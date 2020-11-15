import modelMenu from '../models/menu';
import {Request,Response } from "express";



export default class MenuController{


    static crear(req:Request,res:Response){
        let {titulo,descripcion} = req.body;

        let menu = new modelMenu({
            titulo,
            descripcion
        });

        menu.save((err:any, menu:any) => {
            if (err) {
                console.log(err)
            }

            if (!menu){
                return res.status(401).json({
                    ok:false,
                    message:"Error "
                })
            }               

            return res.status(200).json({
                ok: true,
                menu
            });
        });
    }
    static editar(req:Request,res:Response){
        let {_id,titulo,descripcion} = req.body;         

        modelMenu.findByIdAndUpdate(_id,{$set:{
            titulo,
            descripcion

        }}).exec((err:any,menu:any)=>{
            if (err) {
                console.log(err)
            }

            if (!menu){
                return res.status(401).json({
                    ok:false,
                    message:"Error "
                })
            }               

            return res.status(200).json({
                ok: true,
                menu
            });
        });  
    }
    static get(req:Request,res:Response){        
        modelMenu.find().exec((error:any,menus:any)=>{
            if (error) {
                return res.status(501).json({
                    ok:false,
                    error    
                })
            }

            if (!menus){
                return res.status(401).json({
                    ok:false,
                    message:"Error "
                })
            }               

            return res.status(200).json({
                ok: true,
                menus
            });

        }); 
    }
    static getMenu(req:Request,res:Response){
        let id= req.params.id;

        modelMenu.find({_id:id}).exec((error:any,menus:any)=>{
            if (error) {
                return res.status(501).json({
                    ok:false,
                    error    
                })
            }

            if (!menus){
                return res.status(401).json({
                    ok:false,
                    message:"Error "
                })
            }               

            return res.status(200).json({
                ok: true,
                menus
            });

        }); 
    }
    static delete(req:Request,res:Response){
        let id = req.params.id;

        modelMenu.deleteOne({_id:id}).exec((err:any,menu:any)=>{
            if (err) {
                return res.status(501).json({
                    ok:false,
                    message:"Error "
                })
            }

            if (!menu){
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


