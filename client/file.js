
const socket = io();

const messages = document.getElementById('messages');
const handle = document.getElementById('handle');
const output = document.getElementById('output');
const button = document.getElementById('button');
const typing = document.getElementById('typing');
// const player = document.querySelector("#video-container lVideo");
// const canvas = document.querySelector("#video-container > canvas");
//GRAB SCREEN IMAGE
const video = document.getElementById('lVideo');
const canvas = document.getElementById('canvas');
const snap = document.getElementById("snap");

//sends to the server the user that is typing
messages.addEventListener('keypress', () => {
    socket.emit('userTyping', handle.value);
})

//sending messages to users
button.addEventListener('click', () => {

    event.preventDefault();

    socket.emit('userMessage', {
        messages: messages.value,
        handle: handle.value
    })

    document.getElementById('messages').value = "";

})

//displays this to users when message is sent
socket.on('userMessage', (data) => {

    typing.innerHTML = "";
    output.innerHTML += '<p> <strong>' + data.handle + ': </strong>' + data.messages + '</p>'
})

//Displays this to users when a user is typing
socket.on('userTyping', (data) => {
    typing.innerHTML = '<p><em>' + data + ' is typing... </em></p>'
})

/* VIDEO CHAT */

//get local video with permission
function getLocalVideo(callbacks) {

   //navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true })
   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

   var constraints = {
       audio: true,
       video: true
   }

    navigator.getUserMedia(constraints, callbacks.success, callbacks.error)
}

function recieveStream (stream, elemID){

    var video = document.getElementById(elemID);

    video.srcObject = stream;

    window.peer_stream = stream;

}

getLocalVideo({
    success: function(stream){
        window.localstream = stream;
        recieveStream(stream, 'lVideo');
    },

    error: function (err){
        alert("cannot access your camera");
        console.log(err);
    }
})
    
    
//create peer connection with peer object 
var peer = new Peer();

//display peer id on the DOM
peer.on('open', function() {
    document.getElementById("displayId").innerHTML = peer.id;
})

peer.on('connection', function(connection){
    conn = connection;
    peer_id = connection.peer; 

    document.getElementById("connId").value = peer_id;

});

peer.on('error', function(err){
    alert("There is an error " + err);
    console.log(err);
})

//onClick with the connect button will expose ice info between users
document.getElementById('conn_button').addEventListener('click', function(){
    peer_id = document.getElementById("connId").value;

    if(peer_id) {
        conn = peer.connect(peer_id);
    }
    else {
        alert("Enter in an id");
        return false;
    }
})

//onClick call button will send offer and answer is exchanged 
peer.on('call', function(call){
    var acceptCall = confirm("Answer Call?");

    if (acceptCall){
        call.answer(window.localstream);

        call.on('stream', function(stream){
            window.peer_stream = stream;

            recieveStream(stream, 'rVideo');
            
        })

        call.on('close', function(){
            alert('Call Ended');
        })
    } else{
        console.log("Call Denied");
    }
})

//Ask to call
document.getElementById('call_button').addEventListener('click', function(){
    console.log("Calling peer: " + peer_id);
    console.log(peer);

    var call = peer.call(peer_id, window.localstream);

    call.on('stream', function(stream){
        window.peer_stream = stream;

        recieveStream(stream, 'rVideo');

        // Draw image
var context = canvas.getContext('2d');
snap.addEventListener("click", function() {
    context.drawImage(video, 0, 0, 640, 480);
});
    })
})





