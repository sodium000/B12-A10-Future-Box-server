// encode.js
const fs = require("fs");
const key = fs.readFileSync("./platshear-firebase-adminsdk-fbsvc-2e85b07163.json", "utf8");
const base64 = Buffer.from(key).toString("base64");
console.log(base64);