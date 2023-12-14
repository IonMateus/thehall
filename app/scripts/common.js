
let client

document.addEventListener('DOMContentLoaded', function () {
    client = new Client();
});


function createTable(){

    let name = prompt("Escolha um nome (só letras/numeros seguidos):")

    let tableBtn = document.createElement("button")
    tableBtn.className = "table"
    tableBtn.id = name
    tableBtn.onclick = function(){
        window.location.href = `../table/${name}`
    }

    let tableView = document.createElement("div")
    tableView.id = "tableView"

    let participants = document.createElement("div")
    participants.id = "participantsOnTable"
    let image1 = document.createElement("img")
    image1.src = "../images/userIcon.png"
    participants.appendChild(image1)

    let text = document.createElement("p")
    text.innerText = name

    tableBtn.appendChild(tableView)
    tableBtn.appendChild(text)
    tableBtn.appendChild(participants)
    

    document.body.appendChild(tableBtn)
    
    let newTable = new Table(name)
    client.sendTable(newTable)
    

}

    function addTable(name){

        let tableBtn = document.createElement("button")
        tableBtn.className = "table"
        tableBtn.id = name
        tableBtn.onclick = function(){
            window.location.href = `../table/${name}`
        }

        let tableView = document.createElement("div")
        tableView.id = "tableView"

        let participants = document.createElement("div")
        participants.id = "participantsOnTable"
        let image1 = document.createElement("img")
        image1.src = "../images/userIcon.png"
        participants.appendChild(image1)

        let text = document.createElement("p")
        text.innerText = name

        tableBtn.appendChild(tableView)
        tableBtn.appendChild(text)
        tableBtn.appendChild(participants)
        
        document.body.appendChild(tableBtn)

    }