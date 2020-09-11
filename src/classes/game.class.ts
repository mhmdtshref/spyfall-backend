import { T_GAME_STATUS } from "../types";
import { Player } from ".";
import { Locations } from "../constants";
import { Location } from '../interfaces';
import { E_GAME_STATUS } from "../enums/game.enum";
import { GeneralService } from "../services";

const generalService = new GeneralService();

export class Game {
    id: number;
    players: Player[];
    private location: Location;
    private status: T_GAME_STATUS;
    private adminId: number;
    code: string;

    constructor(id: number, adminName: string){
        this.id = id;
        const adminPlayer = new Player(1, adminName, id);
        this.players = [adminPlayer];
        this.location = Locations[Math.floor(Math.random() * Locations.length)];
        this.status = E_GAME_STATUS.waiting;
        this.adminId = adminPlayer.id;
        this.code = generalService.generateRandomString(4);
    }
}