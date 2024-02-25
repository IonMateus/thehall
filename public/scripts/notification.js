
function createNotification(text){
    div = document.getElementById("notificationsDiv")
    notification = document.createElement("p")
    notification.className = "flex items-center justify-between text-lg font-bold max-w-sm m-2 p-2 bg-blue-700 rounded-lg shadow-lg"
    span = document.createElement("span")
    span.className = "flex-grow p-1 break-all"
    span.innerText = text
    button = document.createElement("button")
    button.onclick = function() {
        this.parentNode.remove();
    };
    button.className = "text-red-700 font-bold p-1"
    button.innerText = "X"
    notification.appendChild(span)
    notification.appendChild(button)
    div.appendChild(notification)
}
