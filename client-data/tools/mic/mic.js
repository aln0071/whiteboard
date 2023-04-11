const micTool = (function mic() {
  var active = false;
  const snackbar = document.getElementById("snackbar");
  const showSnack = (message) => {
    snackbar.innerHTML = message;
    snackbar.className = "show";
    setTimeout(function () {
      snackbar.className = snackbar.className.replace("show", "");
    }, 4000);
  };
  const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
  const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
  const tools = {
    pencil: "toolID-Pencil",
    line: "toolID-Straight line",
    rectangle: "toolID-Rectangle",
    ellipse: "toolID-Ellipse",
    text: "toolID-Text",
    eraser: "toolID-Eraser",
    hand: "toolID-Hand",
    grid: "toolID-Grid",
    download: "toolID-Download",
    zoom: "toolID-Zoom",
  };
  const commandsToRecognize = Object.keys(tools);
  const grammar = `#JSGF V1.0; grammar commands; public <command> = ${commandsToRecognize.join(
    " | "
  )};`;
  const recognition = new SpeechRecognition();
  const speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 0);
  recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = (e) => {
    const command = e.results[0][0].transcript;
    const toolId = tools[command];
    if (toolId !== undefined) {
      document.getElementById(toolId)?.click();
    } else {
      console.log("I heard", command);
      showSnack(`I heard ${command}`);
    }
  };
  recognition.onspeechend = () => {
    active = false;
    recognition.stop();
  };
  recognition.nomatch = () => {
    console.log("no match");
  };
  recognition.onerror = (error) => {
    console.log("Error: ", error);
  };

  function listenToUser() {
    if (active) return;
    active = true;
    recognition.start();
    console.log("ready");
  }

  return {
    name: "Mic",
    shortcut: "m",
    listeners: {},
    icon: "tools/mic/mic.svg",
    oneTouch: true,
    onstart: listenToUser,
    active,
  };
})();

