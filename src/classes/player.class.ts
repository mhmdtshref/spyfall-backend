export class Player {
    id: number;
    name: string;
    gameId: number;
    isSpy: boolean;

    constructor(id: number, name: string, gameId: number, isSpy = false) {
        this.id = id;
        this.name = name;
        this.gameId = gameId;
        this.isSpy = isSpy;
    }
}