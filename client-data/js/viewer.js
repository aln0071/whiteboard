// document.getElementById("tools").style.display = "none";
// document.getElementById("settings").style.display = "none";

// let button = document.createElement("button");
// button.innerHTML = "Click Me";
// document.body.appendChild(button);
// button.onclick = () => {
//   Tools.enableTool(Tools.list["Pencil"]);
// };
// button.style.position = "fixed";
// button.style.right = "10px";
// button.style.top = "10px";

// button = document.createElement("button");
// button.innerHTML = "Click Me";
// document.body.appendChild(button);
// button.onclick = () => {
//   Tools.disableTool(Tools.list["Pencil"]);
// };
// button.style.position = "fixed";
// button.style.right = "10px";
// button.style.top = "60px";

Tools.registerWithStyles(pencilTool);
Tools.registerWithStyles(rectangleTool);
Tools.registerWithStyles(textTool);
Tools.registerWithStyles(lineTool);
Tools.registerWithStyles(eraserTool);
Tools.registerWithStyles(ellipseTool);
handTool.secondary = undefined;
Tools.add(handTool);
Tools.change("Hand");
