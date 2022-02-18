const serverUrl = "http://127.0.0.1:8887/";

let iframe = document.createElement("iframe");
iframe.classList.add("iframe-container");
iframe.title = "chatbot iframe"
iframe.style.display = "none";

document.body.appendChild(iframe);

createChatButton(true);

function createChatButton(init) {
  var chatBtn = document.createElement("i");
  chatBtn.classList.add("chat-btn");
  chatBtn.setAttribute("id", "chat-btn");
  var botImg = document.createElement("img");
  botImg.alt = "bot icon"
  botImg.src  = serverUrl+"img/chatbot.png";
  chatBtn.appendChild(botImg);
  document.body.appendChild(chatBtn);
  chatBtn.addEventListener("click", function() {
    if (init) {
      iframe.src = serverUrl + "chatbot.html?publisher="+PUBLISHER;
      iframe.style.display = "block";
      init = false;
    } else {
      toggleChatWindow();
    }
  });
}

function toggleChatWindow() {
  if (iframe.style.display == "none") {
    iframe.style.display = "block";
  } else {
    iframe.style.display = "none";
  }
}
