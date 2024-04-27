const { createServer } = require('node:http');
const fsPromise = require("node:fs/promises");
const path = require("node:path");
const fs = require("node:fs");

const formidable = require("formidable");

const PORT = process.env.PORT || 3500;

const server = createServer(async (req, res) =>{
    if(req.url == '/uploads' && req.method.toLowerCase() == 'post'){
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) =>{
            let oldPath = files.filetoupload.filepath;
            let newPath = path.join(__dirname, 'logs', files.filestoupload.originalFilename);
            fs.rename(oldPath, newPath, (err) => {
                if(err) throw err;
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.end("File has been uploaded and moved!!");
                return;
            })
        })
    }
    else {
        try{
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            const data = await fsPromise.readFile(path.join(__dirname, 'view', 'form.html'), {encoding: 'utf-8'})
            res.end(data);
        }catch(error){
            console.log(err);
            res.statusCode = err.httpCode || 400;
            res.setHeader("Content-Type", "text/plain");
            res.end(error)
        }
    }
});

server.listen(PORT, () => console.log(`Server open at http://localhost:${PORT}`));