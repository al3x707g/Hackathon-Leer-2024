import {io} from "socket.io-client";

const socket = io("https://games.uhno.de", {
    transports: ['websocket']
})

export default socket