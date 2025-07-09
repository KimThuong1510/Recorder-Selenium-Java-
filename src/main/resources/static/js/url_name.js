  function checkInput() {
        const url = document.getElementById("urlInput").value.trim();
        document.getElementById("startBtn").disabled = url === "";
    }
