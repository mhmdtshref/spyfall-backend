// import { Request, Response, NextFunction } from 'express';
// import Boom from '@hapi/boom';
import { GameService } from '../services';

export class SocketController {

    constructor(
        private gameService: GameService,
    ) {}

    index = (socketServer: SocketIO.Server): void => {
        socketServer.on('connection', (socket) => {
            socket.on('createGame', (playerName: string) => {
                const game = this.gameService.createGame(playerName);
                // TODO: Return game to frontend
            });

            socket.on('joinGame', (data: { playerName: string, gameCode: string }) => {
                this.gameService.addPlayerByCode(data.playerName, data.gameCode);
                // Send game to socket (for player game joined with status)
            })
        });
    }
}