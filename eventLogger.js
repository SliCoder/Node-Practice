let { format } = require("date-fns");
let {v4: uuid} = require("uuid");

let fsPromises = require("node:fs/promises");
let path = require("node:path");
let fs = require("node:fs")

const logMessage = async (message, file) => {
    let dateTime = format(new Date(), 'yyyy MM dd\tHH:mm:ss');
    let logMessage = `${dateTime} \t ${uuid()} \t ${message} \n`
    try{
        if(!fs.existsSync(path.join(__dirname, 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, 'logs', file), logMessage);
    }
    catch(error){
        console.error(error);
    }
};

module.exports = logMessage;