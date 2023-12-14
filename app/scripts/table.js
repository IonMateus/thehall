
class Table {
    constructor(tabeName) {
        this.name = tabeName
        this.participants = [];
    }

    addParticipant(client) {
        if(client && client.socket.id){
            this.participants.push(client)
            return true
        }else{
            return false
        }
    }

    removeParticipant(client){
        if(client && client.socket.id){
            let index = this.participants.findIndex(clientToRemove => clientToRemove.socket.id === client.socket.id);

            if (index !== -1) {
                participants.splice(index, 1);
                return true
            }
            return false
        }else{
            return false
        }
    }

    showParticipants(){
        let res = []
        for(i in this.participants){
            res.push({mask:this.participants[i]})
        }
        return res
    }

}

