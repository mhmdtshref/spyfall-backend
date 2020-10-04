// import { WhereAttributeHash } from "sequelize/types";
import { Game, Player } from "../classes";
import { T_GAME_STATUS } from "../types";

export class GameService {
    static games: Game[] = [];

    createGame = (adminName: string, socketId: string): Game | null => {
        const gameId = GameService.games.length + 1;
        const game = new Game(gameId, adminName, socketId);
        GameService.games.push(game);
        if (game) {
            return game;
        } else {
            return null;
        }
        
    }

    addPlayerByCode = (playerName: string, code: string, socketId: string): Game | null => {
        const game = this.findGameByCode(code);
        if(game) {
            const newPlayer = new Player(game.players.length + 1, playerName, game.id, socketId);
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

    findGameBySocketId = (socketId: string): Game | null => {
        return GameService.games.find((game: Game) => {
            return game.players.find(player => player.socketId === socketId);
        }) as Game;
    }

    deactivatePlayerBySocketId = (gameCode: string, socketId: string): Game | null => {
        const game = this.findGameByCode(gameCode);
        if (game) {
            const player = game.players.find(p => p.socketId === socketId);
            if (player) {
                player.isActive = false;
                return game;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    activatePlayerBySocketId = (gameCode: string, socketId: string): Game | null => {
        const game = this.findGameByCode(gameCode);
        if (game) {
            const player = game.players.find(p => p.socketId === socketId);
            if (player) {
                player.isActive = true;
                return game;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
