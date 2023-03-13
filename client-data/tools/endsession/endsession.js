const endsessionTool = (function endsession() {
    function endsessionStart() {
        console.log("endsession");
        // Get the modal
        fetch('http://localhost:2000/api/v1/board/removeEditAccess/' + localStorage.getItem('Currentboard'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data) => console.log(data));
    }
    return {
        name: "Endsession",
        shortcut: "e",
        listeners: {},
        icon: "tools/endsession/endsession.svg",
        onstart: endsessionStart
    };
})();