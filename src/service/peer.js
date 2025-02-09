class peerservice {
    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: "stun:stun.l.google.com:19302"
                    }
                ]
            })
        }
    }

    async getOffer () {
        if(this.peer) {
            const offer = await this.peer
        }
    }

}