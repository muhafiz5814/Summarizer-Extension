/** Get the required Element to update the DOM. */
const networkStatusEl = document.getElementById("network-status")

/** Add event listener with the load event. */
window.addEventListener("load", function() {
    getNetworkStatus()
})

/** Add event listener with the online event. */
window.addEventListener("online", function() {
    getNetworkStatus()
})

/** Add event listener with the offline event. */
window.addEventListener("offline", function() {
    getNetworkStatus()
})

/**
 * Define function to get network status using the return value of navigator property.
 * 
 * If internet is offline show message.
 */
function getNetworkStatus() {
    if(navigator.onLine){
        networkStatusEl.textContent = ""
    } else {
        networkStatusEl.innerHTML = `<p> You are Offline`
        networkStatusEl.style.backgroundColor = "red"
    }
}