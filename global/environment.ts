
export const SERVER_PORT:number = Number(process.env.PORT) || 3000;
export const DBURL:string = 'mongodb://localhost:27017/vinedo';
export const CADUCIDAD_TOKEN:number=Number(process.env.CADUCIDAD_TOKEN) ||60*60*24*30;
export const SEED:string= process.env.SEED || 'este-es-el-seed-desarrollo';



//========================
//entorno
//========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; 


