// import { WhereAttributeHash } from "sequelize/types";
import { Game, Player } from "../classes";
import { T_GAME_STATUS } from "../types";

export class GameService {
    static games: Game[] = [];

    createGame = (adminName: string): Game | null => {
        const gameId = GameService.games.length + 1;
        const game = new Game(gameId, adminName);
        GameService.games.push(game);
        if (game) {
            return game;
        } else {
            return null;
        }
        
    }

    addPlayerByCode = (playerName: string, code: string): Game | null => {
        const game = this.findGameByCode(code);
        if(game) {
            const newPlayer = new Player(game.players.length + 1, playerName, game.id);
            game.players.push(newPlayer);
            return game;
        } else {
            return null;
        }
        
    }

    findGameByCode = (code: string): Game | null => {
        const game = GameService.games.find(g => code === g.code);
        if (game) {
            return game;
        } else {
            return null;
        }
    }

    findGameById = (gameId: number): Game | null => {
        const game = GameService.games.find(g => g.id === gameId);
        if(game) {
            return game;
        } else {
            return null;
        }
    }

    leaveGame = (playerId: number, code: string): Game | null => {
        const game = this.findGameByCode(code);
        if(game) {
            const newPlayers = this.removePlayerById(playerId, game.players);
            game.players = newPlayers;
            return game;
        } else {
            return null;
        }
    }

    removePlayerById = (playerId: number, players: Player[]): Player[] => {
        const newPlayers = players.filter(p => p.id !== playerId);
        return newPlayers;
    }

    endGame = (code: string): void => {
        GameService.games = GameService.games.filter(g => g.code !== code);
    }

    setGameStatus = (code: string, status: T_GAME_STATUS): Game | null => {
        const game = this.findGameByCode(code);
        if(game) {
            game.status = status;
            return game;
        } else {
            return null;
        }
    }
}
