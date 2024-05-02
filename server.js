const { createServer} = require("node:http");

const path = require("node:path");
const fs = require("node:fs");
const fsPromise = require("node:fs/promises");
const EventEmitter = require("node:events");

const myEmitter = new EventEmitter();
const logMessage = require("./eventLogger");

myEmitter.on('log', (msg, logFile) => logMessage(msg, logFile))

// const myEvent = new EventEmitter();

const PORT = process.env.PORT || 3000;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromise.readFile(
            filePath, 
            !contentType.includes("image") ? 'utf-8' : ''
        );
        let data = contentType === "application/json" ? JSON.parse(rawData) : rawData 
        response.statusCode = filePath.includes("404.html") ? 404 : 200;
        response.setHeader("Content-Type", contentType);
        response.end( contentType === 'application/json' ? JSON.stringify(data) : data )
    } catch (error) {
        console.log(error);
        myEmitter.emit('log', `${err.name} : ${err.message}`, 'errorLog.txt')
        response.statusCode = 500;
        response.end();
    }
}

const server = createServer((req, res) =>{
    const extension = path.extname(req.url);
    myEmitter.emit('log', `${req.url} \t ${req.method}`, "eventLog.txt")
    let content_type;

    switch(extension){
        case '.css':
            content_type = 'text/css';
            break;
        case '.js':
            content_type = 'text/javascript';
            break;
        case '.json':
            content_type = 'application/json';
            break;
        case '.jpg':
            content_type = 'image/jpeg';
            break;
        case '.png':
            content_type = 'image/png';
            break;
        case '.txt':
            content_type = 'text/plain';
            break;
        default:
            content_type = 'text/html'
    }

    let fileDir = 
    content_type === 'text/html' && req.url === '/' /* localhost:3000/ "/" - indicates that it is index.html file*/
    ? path.join(__dirname, 'view', 'index.html')
    : content_type === 'text/html' && req.url.slice(-1) === '/' /* localhost:3000/api/uploads/ "/" - indicates that it is index.html file */
    ? path(__dirname, 'view', req.url, 'index.html')
        :content_type === 'text/html' /* localhost:3000/about.html remember that the extname is .html */
        ? path.join(__dirname, 'view', req.url) /* Normally the html file is always at the view folder  */
        : path.join(__dirname, req.url);

    // Make a .html extension not required in the url typed in the browse
    if(!extension && req.url.slice(-1) !== '/') fileDir += '.html';

    if(fs.existsSync(fileDir)){
        serveFile(fileDir, content_type, res);
    }
    else{
        // Dealing with locators that has been redirected and also not found;

        switch(path.basename(fileDir)){
            case 'old-page.html':
                res.statusCode = 301;
                res.setHeader('Location', '/index.html');
                res.end()

                break;
            default:
                serveFile(path.join(__dirname, 'view', '404.html'), 'text/html', res);
        }
        // serveFile(path.join(__dirname, 'view', '404.html'), 'text/html', res);
    }
});

server.listen(PORT, () => console.log(`The server is open at http://localhost:${PORT}`))