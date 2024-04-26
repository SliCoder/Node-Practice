let { format } = require("date-fns");
let {v4: uuid} = require("uuid");

let fsPromises = require("node:fs/promises");
let path = require("node:path");
let fs = require("node:fs")

const logMessage = async (message) => {
    let dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    let logMessage = `${dateTime} \t ${uuid()} \t ${message} \n`;
    console.log(logMessage);  
    try{
        if(!fs.existsSync(path.join(__dirname, 'eventFile'))){
            await fsPromises.mkdir(path.join(__dirname, 'eventFile'));
        }
        await fsPromises.appendFile(path.join(__dirname, 'eventFile', 'eventFile.txt'), logMessage);
    }
    catch(error){
        console.error(error);
    }
};

module.exports = logMessage;