



const net = require('net');
const client = net.createConnection(5000, () => {
    console.log("Connected");

});

client.setEncoding('utf-8');

client.on('data', (data) => {
    console.log(data);
});

process.stdin.on('data', (data) => {
    if(data === "quit") {
        process.exit(0)
    } else {
        client.write(data);
        process.stdout.write(`  You said: ${data}`)}


})
