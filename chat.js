



const net = require('net');
const quit = new RegExp('exit','i')
const client = net.createConnection(5000, () => {
    console.log("Connected");

});

client.setEncoding('utf-8');

client.on('data', (data) => {
    console.log(data);
    // This writes from the server, the welcome message
});

process.stdin.on('data', (data) => {
    if(data === "quit") {
        process.exit(0)
    } else {
        client.write(data);
        process.stdout.write(`  You said: ${data}`)}

    // look for 'exit', process.exit(0)
})
