// import { WhereAttributeHash } from "sequelize/types";
import { Game, Player } from "../classes";

export class GameService {
    static games: Game[] = [];

    createGame = (adminName: string): Game => {
        const gameId = GameService.games.length + 1;
        const game = new Game(gameId, adminName);
        return game;
    }

    addPlayerByCode = (playerName: string, code: string): Game => {
        const game = GameService.games.find(game => code === game.code) as Game;
        const newPlayer = new Player(game.players.length + 1, playerName, game.id);
        game.players.push(newPlayer);
        return game;
    }
}
