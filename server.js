const net = require('net');
const fs = require('fs');
const file = fs.createWriteStream('./chat.log', {flags: 'a'});
let clientArr = [];
let guest = 1;



const server = net.createServer((client) => {
    client.setEncoding('utf-8')
    // file.write('This is the beginning of a new chat session\n')
    client.id = "Guest" + guest++;
    clientArr.push(client)
    const quit = new RegExp('exit', 'i');

    client.write(`Welcome to the chat room: ${client.id}!\n`)
    file.write(`${client.id} has joined the chat room.\n`)
    clientArr.forEach(guest => {
        if(guest !== client) {
            guest.write(`${client.id} has joined the chat room.\n`)
        }
    })
    process.stdout.write(`${client.id} has joined the chat room.\n`)

    client.on('data', (data) => {
        if(data.trim() === '/clientlist') {
            const clientList = clientArr.map(client => client.id).join(', ');
            client.write(clientList)
            console.log('A user has requested the client list')
        } else if(data.startsWith('/username')){
            oldUser = client.id;
            newUser = data.split(' ')[1].trim();
            client.id = newUser;
            clientArr.forEach(guest => {
                if(guest !== client) {
                    guest.write(`${oldUser} has changed their name to ${newUser}`)
                }
            })
            file.write(`${oldUser} has changed their name to ${newUser}.\n`)
        } else if(data.startsWith('/w')){
            sender = client.id;
            receiver = data.split(' ')[1];
            message = data.split(' ').slice(2).toString().replaceAll(',', ' ');      
            clientArr.forEach(guest => {
                if(guest.id !== sender) {
                    if(guest.id === receiver) {
                        guest.write(`${sender} whispers to you: ${message}`)
                        file.write(`${sender} whispers to ${receiver}: ${message}`)
                    }
                    
                }
            })
        } else if(data.startsWith('/kick')){
            sender = client.id;
            booted = data.split(' ')[1];
            requiredPassword = 'secret';
            passWord = data.split(' ')[2].trim();
            if(sender != booted){
               if(requiredPassword === passWord){
                   clientArr.forEach(guest => {
                       if(guest.id === booted){
                            // console.log(booted)
                            guest.write(`\nYou have been booted from the chat, any further messages you type will not be sent or logged.`)
                            guest.end();
                       }
                    })

                }
            }   
            
        } else {
        clientArr.forEach(guest => {
            if(guest !== client) {
                guest.write(`${client.id}: ${data}`)
            }
        })
        file.write(`${client.id} said : ${data}\n`)
        console.log(`${client.id} said: ${data.toString()}`);
    }
        
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
    }
    )
    client.on('error', () => {
        console.log('received error event')
    })
}).listen(5000, () => {
    console.log('listening on port 5000');

});
// net.createServer();
