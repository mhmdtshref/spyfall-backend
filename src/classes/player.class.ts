export class Player {
    id: number;
    name: string;
    gameId: number;
    isSpy: boolean;
    socketId: string;
    isActive: boolean;

    constructor(id: number, name: string, gameId: number, socketId: string, isSpy = false) {
        this.id = id;
        this.name = name;
        this.gameId = gameId;
        this.isSpy = isSpy;
        this.socketId = socketId;
        this.isActive = true;
    }
}