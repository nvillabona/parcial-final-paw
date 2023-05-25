let socket = io();

let messages = document.getElementById("messages");
let form = document.getElementById("form");
let input = document.getElementById("input");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit("chat message", input.value);
        input.value = "";
    }
});
// Load chat history
socket.on("chat history", function (history) {
    history.forEach(function (msg) {
        let item = document.createElement("li");
        item.textContent = `${msg.user} : ${msg.content}`;
        messages.appendChild(item);
    });
    window.scrollTo(0, document.body.scrollHeight);
});
socket.on("chat message", function (msg) {
    let item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});