const socket = io();
const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const form = welcome.querySelector("form");

room.hidden = true;

let roomName;

function addChat(event) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  ul.appendChild(li);
  li.innerText = event;
}

function submitNewMessage(event) {
  event.preventDefault();
  const messageInput = room.querySelector("input");
  const value = messageInput.value;
  socket.emit("new_message", messageInput.value, roomName, () => {
    addChat(`You:${value}`);
  });
  messageInput.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const titleOfRoom = document.querySelector("h3");
  titleOfRoom.innerText = `Rooms ${roomName}`;
  const messageForm = room.querySelector("form");
  messageForm.addEventListener("submit", submitNewMessage);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
socket.on("welcome", () => {
  addChat("Somebody joined!");
});
socket.on("bye", () => {
  addChat("Somebody left ㅜㅜ");
});
socket.on("new_message", addChat);
