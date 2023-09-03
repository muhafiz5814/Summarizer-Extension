const networkStatusEl = document.getElementById("network-status")

window.addEventListener("load", function() {
    getNetworkStatus()
})

window.addEventListener("online", function() {
    getNetworkStatus()
})

window.addEventListener("offline", function() {
    getNetworkStatus()
})

function getNetworkStatus() {
    if(navigator.onLine){
        networkStatusEl.textContent = ""
    } else {
        networkStatusEl.innerHTML = `<p> You are Offline`
        networkStatusEl.style.backgroundColor = "red"
    }
}