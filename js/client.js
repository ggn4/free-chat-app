const socket = io("http://localhost:8000");

// Get DOM element in respective Js veraibles
const form = document.getElementById("form-send");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
// Audio that will play on receiving messages
var messageTone = new Audio("pristine.mp3");

// Function which will append event to the container
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left" || position == "center") {
    messageTone.play();
  }
};

// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit("new-user-joined", name);

// If a new user joins, receive his/her name from the server
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "center");
});

// If server sends a message, receive it
socket.on("receive", (data) => {
  append(`${data.name}\n\n ${data.message}`, "left");
});

// If user leaves the chat, append the info to the container
socket.on("left", (name) => {
  append(`${name} left the chat`, "center");
});

// If the form gets submitted, send the message to the server
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(message, "right");
  socket.emit("send", message);
  messageInput.value = "";
});
