let { createServer } = require("node:http");
let { EventEmiter } = require("node:events")

let fsPromises = require("node:fs/promises");
let path = require("node:path");
let fs = require("node:fs")

let port = 3000;
let hostname = "127.0.0.1";

const server = createServer((req, res) =>{
    const fsOperation = async () =>{
        try{
            if(fs.existsSync(path.join(__dirname, 'files'))){
                await fsPromises.appendFile(path.join(__dirname, 'files', 'new.txt'), 'Hello this is a new file');
                let data = await fsPromises.readFile(path.join(__dirname, 'files', 'new.txt'), {encoding: "utf-8"});
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.write(data);
                return res.end();
            }else{
                await fsPromises.mkdir(path.join(__dirname, 'files'));
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end();
            }
        }catch(error){
            console.error(error)
        }
    };
});

server.listen(port, hostname, () =>{
    console.log(`The server is open in http://${hostname}:${port}`);
})

class Event extends EventEmiter {};

// let rs = fs.createReadStream(path.join(__dirname, 'files', 'bigRead.txt'));
// let ws = fs.createWriteStream(path.join(__dirname, 'files', 'newBig.txt'));
// rs.pipe(ws)

Event.on('click', () => console.log("Hello We are just clicking"));
Event.emit('click')