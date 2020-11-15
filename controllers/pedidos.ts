import { Request, Response } from "express";
// var printer = require('printer');
var pdf = require("html-pdf");
import fs from 'fs';
import path from 'path';
var format = require('date-format');
var printer = require("pdf-to-printer");
import modelPedido from '../models/pedidos';
import modelOpcion from '../models/opciones';
import modelMenu from '../models/menu';

export default class PedidosController {

    static async crear(req: Request, res: Response) {
        let { menu, personas, no, fecha, opciones } = req.body;

        let pedido = new modelPedido({
            menu,
            personas,
            no,
            fecha,
            opciones
        });

        pedido.save(async (err: any, pedido: any) => {
            if (err) {
                console.log(err)
            }
            if (!pedido) {
                return res.status(401).json({
                    ok: false,
                    message: "Error "
                })
            }
            if (pedido) {
                let date = format.asString('hh:mm:ss', new Date());
                let o: any = [];
                opciones.forEach((e: any) => {
                    o.push(`<h3 style="font-size: 15px;margin: 0px;">${e.titulo}</h3>`);
                });
                let html = `        
                        <div id="caja" text-center style="max-height: 100mm;">
                        <div class="card mb" style="padding: 0px;">                   
                        <div class="card-body mb">                          
                            <h5 class="card-title" style="margin-bottom: 0px; font-size: 25px;">Comanda No ${pedido.no}</h5>                      
                        </div>
                        <div class="card-body mb">
                            <h5 style="margin-top: 0px; font-size: 15px;">${date}</h5>
                        </div>
                        <div class="card-body mb">
                        <h5 style="margin-top: 5px; font-size: 15px;">${pedido.menu}</h5>
                        </div>
                        <div>
                        <p style="margin-bottom: 0px; font-size: 15px;">No de Personas</p>
                        <h5 style="margin-top: 0px; font-size: 15px;">${pedido.personas}</h5>
                        </div>                       
                        <div style="display: flex;flex-direction: column;">
                            ${o}                     
                        </div>
                        <div>
                        ============================================
                        </div>
                        </div>
                        </div>
                `;     

                let id = pedido._id;

                let result = await PedidosController.imprimir(id, html).then((data: any) => {
                    return data;
                }).catch((err: any) => {
                    return false;
                });

                if (result) {
                    return res.status(201).json({
                        ok: true
                    })
                }
            }
        });
    }
    static getLast(req: Request, res: Response) {

        modelPedido.findOne().sort({ no: -1 }).exec((error: any, last: any) => {
            if (error) {
                return res.status(501).json({
                    ok: false,
                    error
                })
            }

            if (!last) {
                return res.status(401).json({
                    ok: false,
                    message: "Error "
                })
            }

            return res.status(200).json({
                ok: true,
                last
            });
        });


    }
    static async imprimir(id: any, html: any) {

        return new Promise((resolve: any, reject: any) => {

            let file = path.resolve(__dirname, `../../uploads/pedidos/${id}.pdf`);
            // let filepath=`../../uploads/pedidos/${pedido._id}.pdf`;


            // fs.writeFile(file, html, function (err) {

            //     if (err) {
            //         return console.log(err);
            //     }

            //     printer
            //         .print(file)
            //         .then(
            //             resolve(true)
            //         )
            //         .catch(
            //             reject(false)
            //         );

            //     printer.printDirect({
            //         data: fs.readFileSync(file,'utf-8') // or simple String: "some text"
            //         //, printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
            //         // type: RAW, TEXT, PDF, JPEG, .. depends on platform
            //         , success: function (jobID: any) {
            //             console.log("sent to printer with ID: " + jobID);
            //             resolve(true);
            //         }
            //         , error: function (err: any) { console.log(err);
            //         reject(false) }
            //     });;
            // });



            pdf.create(html).toFile(file, function (err: any, res: any) {
                if (err) {
                    reject('Error');
                }

                let document = path.resolve(__dirname, `${res.filename}`);

                if (res) {

                    // const options = {
                    //     // printer: "Microsoft Print to PDF",  
                    //     printer: "Microsoft XPS Document Writer",
                    //     win32: ['-print-settings "fit"']
                    // };

                    const op = {
                        printer: "SAT23TUSE",
                        // printer: "Microsoft Print to PDF",
                        unix: ["-n 2"],
                        win32: ["-print-settings noscale"]
                    };

                    printer
                        .print(document, op)
                        .then(
                            resolve(true)
                        )
                        .catch(
                            console.error
                        );


                    // console.log("entro");
                    // let RAW: any = "PDF";
                    // printerNative.print(document,)


                    // printer.printDirect({
                    //     data: "print from Node.JS buffer" // or simple String: "some text"
                    //     //, printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
                    //     , type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
                    //     , success: function (jobID: any) {
                    //         console.log("sent to printer with ID: " + jobID);
                    //     }
                    //     , error: function (err: any) { console.log(err); }
                    // });
                    // printer.printDirect({
                    //     data: fs.readFileSync(document)
                    //     // or simple String: "some text"
                    //     //, printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
                    //     // type: RAW, TEXT, PDF, JPEG, .. depends on platform
                    //     , success: function (jobID: any) {
                    //         resolve(true)
                    //     }
                    //     , error: function (err: any) {
                    //         reject('Error');
                    //     }
                    // });

                }

            });
        })

    }

}