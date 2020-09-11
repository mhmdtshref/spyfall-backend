import { T_GAME_STATUS } from "../types";
import { Player } from ".";
import { Locations } from "../constants";
import { Location } from '../interfaces';
import { E_GAME_STATUS } from "../enums/game.enum";

export class Game {
    private id: number;
    private players: Player[];
    private location: Location;
    private status: T_GAME_STATUS;
    private adminId: number;

    constructor(id: number, adminPlayer: Player){
        this.id = id;
        this.players = [adminPlayer];
        this.location = Locations[Math.floor(Math.random() * Locations.length)];
        this.status = E_GAME_STATUS.waiting;
        this.adminId = adminPlayer.id;
    }
}