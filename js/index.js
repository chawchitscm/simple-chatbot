$.getJSON("data/simple-data.json", function (jsonData) {
  let message = document.createElement("li");
  message.innerText = jsonData[0].text;
  message.classList.add("bot");
  document.getElementById("chatbox").appendChild(message);

  if (jsonData[0].messageType == "Question") {
    if (jsonData[0].options.length > 0) {
      let reply = document.createElement("li");
      let optionsEle = document.createElement("ul");
      for (let option = 0; option < jsonData[0].options.length; option++) {
        let optionEle = document.createElement("li");
        let link = document.createElement("a");
        link.innerText = jsonData[0].options[option].option;
        link.classList.add("option");
        link.setAttribute("data-nextmessageid", jsonData[0].options[option].option_nextMessageId);
        link.addEventListener("click", goToNextMessage);
        optionEle.appendChild(link);
        optionsEle.appendChild(optionEle);
      }
      reply.appendChild(optionsEle);
      reply.classList.add("reply");
      document.getElementById("chatbox").appendChild(reply);
    }
  }
  
  function goToNextMessage(event) {
    let messageId = event.target.getAttribute("data-nextmessageid");
    let message = document.createElement("li");
    message.innerText = jsonData[messageId-1].text;
    message.classList.add("bot");
    document.getElementById("chatbox").appendChild(message);

    if (jsonData[messageId-1].messageType == "Question") {
      if (jsonData[messageId-1].options.length > 0) {
        let reply = document.createElement("li");
        let optionsEle = document.createElement("ul");
        for (let option = 0; option < jsonData[messageId-1].options.length; option++) {
          let optionEle = document.createElement("li");
          let link = document.createElement("a");
          link.innerText = jsonData[messageId-1].options[option].option;
          link.classList.add("option");
          link.setAttribute("data-nextmessageid", jsonData[messageId-1].options[option].option_nextMessageId);
          link.addEventListener("click", goToNextMessage);
          optionEle.appendChild(link);
          optionsEle.appendChild(optionEle);
        }
        reply.appendChild(optionsEle);
        reply.classList.add("reply");
        document.getElementById("chatbox").appendChild(reply);
      }
    }
  }
});