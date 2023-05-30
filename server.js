/*Enhance your server to be able to handle the following commands from clients. In all cases you should log the result to server.log.

/w - Sends a whisper to another connected client. For example: ‘/w Guest3 Hi’ Should send a message to Guest3 only.
Your server should send an informative error message if the command fails for any reason (incorrect number of inputs, invalid username, trying to whisper themselves etc.)
If there is no error then a private message containing the whisper sender’s name as well as the whispered message should be sent to the indicated user

/username - Updates the username of the client that sent the command. For example, if Guest2 sends ‘/username john’ then Guest2’s username should be updated to ‘john’
Your server should send an informative error message if the command fails for any reason (incorrect number of inputs, username already in use, the new username is the same as the old username, etc)
If there is no error then a message should be broadcast to all users informing them of the name change. You should also send a specialized message to the user that updated their username informing them that the name change was successful.

/kick - Kicks another connected client, as long as the supplied admin password is correct. (You can just store an adminPassword variable in memory on your server for now.) For example ‘/kick Guest3 supersecretpw’ should kick Guest3 from the chat
Your server should send an informative error message if the command fails for any reason (incorrect number of inputs, incorrect admin password, trying to kick themselves, invalid username to kick, etc)
If there is no error then a private message should be sent to the kicked user informing them that they have been kicked from the chat. They should then be removed from the server. A message should be broadcast to all other users informing them that the kicked user left the chat.

/clientlist - sends a list of all connected client names.*/


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
        }
    })
    process.stdout.write(`${client.id} has joined the chat room.\n`)
    
    

    client.on('data', (data) => {
        // if(quit === data) {
        //     client.write(`Thank you for joining us, ${client.id}. We look forward to you joining us again!`)
        //     if(client !== client) {
        //         client.write(`${client.id} has left the chat.`)
        //         clientArr.indexOf(client.id)
        //     }
        // }
        // if('/clientlist' === data) {
        //     console.log(clientArr)
        // }
        // if(`/w ${user.id}` === data) {
        //     guest.write(`From ${client.id} to you : ${data}`)
        // }
        console.log(`${client.id} said: ${data.toString()}`);
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
    }
    )
    client.on('error', () => {
        console.log('received error event')
    })
}).listen(5000, () => {
    console.log('listening on port 5000');

});
// net.createServer();
