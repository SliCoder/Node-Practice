const logMessage = require("./test.js");
const eventEmiiter = require("node:events");

const myEmitter = new eventEmiiter();

myEmitter.on('log', (msg) => logMessage(msg));

setTimeout(() => myEmitter.emit('log', "Hello I am just testing a message here with a timeout too"), 4000);