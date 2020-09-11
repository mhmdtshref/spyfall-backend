import { WhereAttributeHash } from "sequelize/types";
import { Game, Player } from "../classes";

export class GameService {
    static games: Game[] = [];

    createGame = (adminPlayer: Player) => {
        const gameId = GameService.games.length + 1;
        const game = new Game(gameId, adminPlayer);
        return game;
    }
}
