const startId = 1;
const delay = 1500;
const serverUrl = "http://127.0.0.1:8887/";

let container = document.createElement("div");
container.classList.add("chatbot-container");

let chatbox = document.createElement("ul");
chatbox.classList.add("chat-window");
chatbox.setAttribute("id", "chatbox");

container.appendChild(chatbox);

document.body.appendChild(container);

window.onload = function(){
  // container.addEventListener("click", function() {
    loadJSON(function(response) {
      var jsonData = JSON.parse(response);
      startChat(jsonData);
      // setTimeout(function() {
      //   console.log("click")
      //   container.click();
      // }, 10);
    });
  // })
  // window.addEventListener("mouseover", function() {
  //   container.click();
  // })
}

function startChat(data) {
  var message = findMessageInJsonById(data, startId);
  generateMessage(data, message);
}

function findMessageInJsonById(data, id) {
  for (let index = 0; index < data.length; index++) {
    if (data[index].id == id) {
      return data[index];
    }
  }
}

function generateMessage(data, message) {
  toggleLoader("show");
  setTimeout(function() {
    toggleLoader("hide");

    let audioCls = null;
    if (message.audioPath) {
      audioCls = new Audio(message.audioPath);
    }
    if (audioCls) {
      audioCls.play();
    }

    let messageEle = document.createElement("li");
    let div = document.createElement("div");
    div.innerText = message.text;
    div.classList.add("text");
    messageEle.classList.add("bot");
    messageEle.appendChild(div);
    chatbox.insertBefore(messageEle, chatbox.firstChild);

    if (message.messageType == "Question") {
      if (message.options) {
        if (message.options.length > 0) {
          let replyEle = document.createElement("li");
          let optionsEle = document.createElement("ul");
          for (let option = 0; option < message.options.length; option++) {
            let optionEle = document.createElement("li");
            optionEle.innerText = message.options[option].option;
            optionEle.setAttribute("data-nextmessageid", message.options[option].option_nextMessageId);
            optionEle.addEventListener("click", function(event) {
              let nextMessageId = event.target.getAttribute("data-nextmessageid");
              message = findMessageInJsonById(data, nextMessageId);
              
              // create reply text after choosing option
              let replyEle = document.createElement("li");
              let replyDiv = document.createElement("div");
              replyDiv.classList.add("text");
              replyDiv.innerText = event.target.innerText;
              replyEle.classList.remove("bot");
              replyEle.classList.add("user");
              replyEle.appendChild(replyDiv);
              chatbox.insertBefore(replyEle, chatbox.firstChild);
              event.target.parentElement.parentElement.style.display = "none";
              
              generateMessage(data, message);
            });
            optionsEle.appendChild(optionEle);
          }
          replyEle.appendChild(optionsEle);
          replyEle.classList.add("options");
          chatbox.insertBefore(replyEle, chatbox.firstChild);
        }
      }
    } else {
      if (message.nextMessageId != "") {
        var nextMessage = findMessageInJsonById(data, message.nextMessageId);
        generateMessage(data, nextMessage);
      }
    }
  }, delay);
}

function toggleLoader(status) {
  if (status == "show"){
    let typingEle = document.createElement("li");
    typingEle.classList.add("typing-indicator");
    for (let index = 0; index < 3; index++) {
      let span = document.createElement("span");
      typingEle.appendChild(span);
    }
    chatbox.insertBefore(typingEle, chatbox.firstChild);
  } else {
    var typingEle = document.getElementsByClassName("typing-indicator");
    while (typingEle[0]) {
      typingEle[0].parentNode.removeChild(typingEle[0])
    }
  }
}

function loadJSON(callback) {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var publisher_param = url.searchParams.get("publisher");

  var json_file = "data/simple-data.json";

  if (publisher_param == "publisher1") {
    json_file = "data/data1.json";
  } else if (publisher_param == "publisher2") {
    json_file = "data/data2.json";
  }

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", serverUrl + json_file, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);  
}