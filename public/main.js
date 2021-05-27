const usersList = document.getElementById("users");
const board = document.getElementById("board");
const userMessage = document.getElementById("msg_txt");
const userName = document.getElementById("msg_name");
const sendButton = document.getElementById("msg_btn");

const socket = io();
const messages = [];
const LIMIT_MESSAGES = 10;

const render = (body, elements) => {
  body.innerHTML = "";
  const fragment = document.createDocumentFragment();

  elements.forEach((element) => {
    fragment.appendChild(element);
  });

  body.appendChild(fragment);
};

const renderListOfMessages = ({ name, message }) => {
  const divName = document.createElement("DIV");
  divName.className = "alert alert-primary col-md-3";
  divName.textContent = name;

  const divMessage = document.createElement("DIV");
  divMessage.className = "alert alert-dark col-md-9";
  divMessage.textContent = message;

  const divWrapper = document.createElement("DIV");
  divWrapper.className = "row";

  divWrapper.appendChild(divName);
  divWrapper.appendChild(divMessage);

  if (messages.unshift(divWrapper) > LIMIT_MESSAGES) {
    messages.pop();
  }

  render(board, messages);
};

const renderListOfUsers = (data) => {
  const userElement = Object.values(data).map((user) => {
    const li = document.createElement("LI");
    li.classList.add("list-group-item");
    li.textContent = user;
    return li;
  });
  render(usersList, userElement);
};

const pressEnterKey = (e) => {
  if (e.keyCode === 13) {
    sendUserMessage();
  }
};

const sendUserMessage = () => {
  let name = userName.value;
  const message = userMessage.value;

  if (message === "" || name === "") {
    return;
  }

  socket.emit("message", {
    message,
    name,
  });

  userMessage.value = "";
  userMessage.focus();
};

sendButton.addEventListener("click", sendUserMessage);
userMessage.addEventListener("keyup", pressEnterKey);

socket.on("user", renderListOfUsers);
socket.on("message", renderListOfMessages);
