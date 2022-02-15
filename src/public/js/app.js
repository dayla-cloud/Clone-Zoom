const chatList = document.querySelector("ul");
const nickForm = document.getElementById("nickname");
const chatForm = document.getElementById("chat");
const changeBtn = document.getElementById("change");
const socket = new WebSocket(`ws://${window.location.host}`);

function submitNickname(e) {
  e.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(recieveData("nickname", input.value));
  input.placeholder = input.value;
  input.disabled = true;
}

function submitChat(e) {
  e.preventDefault();
  const input = chatForm.querySelector("input");
  socket.send(recieveData("new_chat", input.value));
  input.value = "";
}

function recieveData(type, dataOfType) {
  const dataSocket = { type, dataOfType };
  return JSON.stringify(dataSocket);
}

function changeNickname() {
  const input = nickForm.querySelector("input");
  input.disabled = false;
}

socket.addEventListener("open", () => {
  console.log("Just Connected to BE");
});

socket.addEventListener("close", () => {
  console.log("Disconnected");
});

socket.addEventListener("message", (dataOfMessage) => {
  const li = document.createElement("li");
  li.innerText = dataOfMessage.data;
  chatList.append(li);
});

nickForm.addEventListener("submit", submitNickname);
chatForm.addEventListener("submit", submitChat);
changeBtn.addEventListener("click", changeNickname);
