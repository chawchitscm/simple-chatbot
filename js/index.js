const startId = 1;

let container = document.createElement("div");
container.classList.add("container");
let chatbox = document.createElement("ul");
chatbox.setAttribute("id", "chatbox");
container.appendChild(chatbox);
document.body.appendChild(container);

document.getElementById("start").addEventListener("click", function() {
  document.getElementById("start").remove();
  $.getJSON("data/simple-data.json", function (jsonData) {
    startChat(jsonData);
  });
});

function startChat(data) {
  var message = findMessageInJsonById(data, startId);
  generateMessage(data, message)
}

function findMessageInJsonById(data, id) {
  for (let index = 0; index < data.length; index++) {
    if (data[index].id == id) {
      return data[index];
    }
  }
}

function generateMessage(data, message) {
  let audioCls = null;
  if (message.audioPath) {
    audioCls = new Audio(message.audioPath);
  }
  if (audioCls) {
    audioCls.play();
  }
  let messageEle = document.createElement("li");
  messageEle.innerText = message.text;
  messageEle.classList.add("bot");
  chatbox.appendChild(messageEle);

  if (message.messageType == "Question") {
    if (message.options) {
      if (message.options.length > 0) {
        let replyEle = document.createElement("li");
        let optionsEle = document.createElement("ul");
        for (let option = 0; option < message.options.length; option++) {
          let optionEle = document.createElement("li");
          let link = document.createElement("a");
          link.innerText = message.options[option].option;
          link.classList.add("option");
          link.setAttribute("data-nextmessageid", message.options[option].option_nextMessageId);
          link.addEventListener("click", function(event) {
            let nextMessageId = event.target.getAttribute("data-nextmessageid");
            message = findMessageInJsonById(data, nextMessageId);
            setTimeout(function() {
              generateMessage(data, message);
            }, 1500);
          });
          optionEle.appendChild(link);
          optionsEle.appendChild(optionEle);
        }
        setTimeout(function() {
          replyEle.appendChild(optionsEle);
          replyEle.classList.add("reply");
          chatbox.appendChild(replyEle);
        }, 1500);
      }
    }
  }

  setTimeout(function() {
    if (message.nextMessageId != "") {
      var nextMessage = findMessageInJsonById(data, message.nextMessageId);
      generateMessage(data, nextMessage);
    }
  }, 1500);
}