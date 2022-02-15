import express, { application } from "express";
import http from "http";
import WebSocket from "ws";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on https://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];
const onSocketClose = () => console.log("Disconnected from the Browser🥲");

wss.on("connection", (socket) => {
  console.log("connedted to FE");
  sockets.push(socket);
  socket["nickname"] = "noname";
  socket.on("close", () => {
    console.log("Disconnected from BE");
  });
  socket.on("message", (backDataOfMessage) => {
    const responseFromBack = JSON.parse(backDataOfMessage);
    if (responseFromBack.type === "new_chat") {
      sockets.forEach((aSocket) =>
        aSocket.send(`${socket.nickname}:${responseFromBack.dataOfType}`)
      );
    } else if (responseFromBack.type === "nickname") {
      socket["nickname"] = responseFromBack.dataOfType;
    }
  });
});
server.listen(3000, handleListen);
