// import { Request, Response, NextFunction } from 'express';
// import Boom from '@hapi/boom';
import { GameService } from '../services';
import { E_GAME_STATUS } from '../enums/game.enum';

export class SocketController {

    private gameService: GameService = new GameService();

    index = (socketServer: SocketIO.Server): void => {
        socketServer.on('connection', (socket) => {
            socket.on('createGame', (data: { playerName: string }) => {
                const game = this.gameService.createGame(data.playerName);
                if(game) {
                    const data = { game, player: game.players[0] };
                    const gameRoomName = game.getRoomName();
                    socket.join(gameRoomName)
                    socketServer.to(gameRoomName).emit('gameCreated', data);
                }
            });

            socket.on('joinGame', (data: { playerName: string; gameCode: string }) => {
                const game = this.gameService.addPlayerByCode(data.playerName, data.gameCode);
                if(game) {
                    const gameRoomName = game.getRoomName();
                    socket.join(gameRoomName);
                    socketServer.to(gameRoomName).emit('playerJoined', { game });
                    const player = game.players[game.players.length-1];
                    socket.emit('joinSuccess', { game, player });
                } else {
                    // TODO: Fail response to socket.
                }
                
            });

            socket.on('startGame', (data: { code: string }) => {
                const game = this.gameService.findGameByCode(data.code);
                if(game) {
                    game.status = E_GAME_STATUS.started;
                    game.players[1].isSpy = true; // TODO: find random player to be the spy
                    // TODO: send game details to ALL PLAYERS.
                } else {
                    // TODO: Fail response to socket.
                }                
            });

            socket.on('leaveGame', (data: { playerId: number; code: string }) => {
                this.gameService.leaveGame(data.playerId, data.code);
            });

            socket.on('finishGame', (data: { gameId: number }) => {
                this.gameService.finishGame(data.gameId);
            });

            socket.on('restartGame', (data: { gameId: number }) => {
                this.gameService.setGameStatus(data.gameId, E_GAME_STATUS.waiting);
            })
        });
    }
}