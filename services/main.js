const http = require('http');

const app = require('./services');

const port = process.env.PORT || 8000;
const server = http.createServer(app);

server.listen(port , () => {
    console.log("Start Server At Port 8000");
});