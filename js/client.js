// Import the Socket.IO client library
// import { io } from "https://cdn.socket.io/4.5.3/socket.io.min.js";

// Connect to the server
const socket = io("http://localhost:8000");

// DOM elements
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

var audio= new Audio('ting.mp3')
// Function to append messages to the chat container
const append = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position); // Ensure 'position' is valid, no spaces
    messageContainer.append(messageElement);
    if(position =='left'){
        audio.play()
    }
       
};

// Handle form submission to send a message
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload
    const message = messageInput.value;
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = ""; // Clear the input field
});

// Prompt user for their name
const username = prompt("Enter your name to join");
socket.emit("new-user-joined", username);

// Listen for 'user-joined' event and update the chat
socket.on("user-joined", (name) => {
    append(`${name} joined the chat`, "left");
});

// Listen for 'receive' event and update the chat
socket.on("receive", (data) => {
    append(`${data.name}: ${data.message}`, "left");
});

// Listen for 'left' event and update the chat
socket.on("left", (name) => {
    append(`${name} left the chat`, "left");
});
