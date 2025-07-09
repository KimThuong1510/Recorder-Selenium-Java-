 function checkInput() {
        const input = document.getElementById("folderInput").value.trim();
        document.getElementById("okBtn").disabled = input === "";
    }