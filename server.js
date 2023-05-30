


const net = require('net');
const fs = require('fs');
const file = fs.createWriteStream('./chat.log', {flags: 'a'});
let clientArr = [];
let guest = 1;



const server = net.createServer((client) => {
    // file.write('This is the beginning of a new chat session\n')
    client.id = "Guest" + guest++;
    clientArr.push(client)
    const quit = new RegExp('exit', 'i');

    client.write(`Welcome to the chat room: ${client.id}!\n`)
    file.write(`${client.id} has joined the chat room.\n`)
    clientArr.forEach(guest => {
        if(guest !== client) {
            guest.write(`${client.id} has joined the chat room.\n`)
            
            // This informs each client of new clients joining.
            // How to inform of guests leaving?
        }
    })
    process.stdout.write(`${client.id} has joined the chat room.\n`)
    
    

    client.on('data', (data) => {
        if(quit === data) {
            client.write(`Thank you for joining us, ${client.id}. We look forward to you joining us again!`)
            if(client !== client) {
                client.write(`${client.id} has left the chat.`)
                clientArr.indexOf(client.id)
            }
        }
        console.log(`${client.id} said: ${data.toString()}`);
        // match the word 'exit', case insensitive
        // if it's exit, don't send 'exit' as a message, but a premade message
        // replace value of data if it is 'exit'
        // remove client from clientArr
        clientArr.forEach(guest => {
            if(guest !== client) {
                guest.write(`${client.id}: ${data}`)
            }
        })
        file.write(`${client.id} said : ${data}\n`)
        
    });
    
    client.on('close', () =>{
        console.log(`received close event from ${client.id}`)
        clientArr = clientArr.filter(currClient => 
            currClient.id !== client.id
        )
        clientArr.forEach(guest => {
            if(guest !== client) {
                guest.write(`${client.id} has left the chat`)
            }
        })
        file.write(`${client.id} has left the chat\n`)
        
    
        // client.write(`${client.id} has left the chat`)
    }
    )
    client.on('error', () => {
        console.log('received error event')
    })
}).listen(5000, () => {
    console.log('listening on port 5000');

});
// net.createServer();
