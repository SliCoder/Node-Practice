let { format } = require("date-fns");
let {v4: uuid} = require("uuid");

console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'));
console.log(uuid());