const questionTool = (function question() {
    function questionStart() {
        console.log("question");

        // Get the modal
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
    }
    return {
        name: "Question",
        shortcut: "q",
        listeners: {},
        icon: "tools/question/question.svg",
        onstart: questionStart
    };
})();