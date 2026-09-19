import express from 'express';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));const app=express();app.use(express.json());
app.get('/api/interactive/health',(_,res)=>res.json({ok:true,version:'5.5'}));
app.get('/api/interactive/preview',(_,res)=>res.sendFile(path.resolve(__dirname,'../interactive-5.5/interactive-preview-5.5.html')));
app.listen(process.env.PORT||8795);
