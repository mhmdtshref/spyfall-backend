import { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';

export class SocketController {
    index = (socketServer: SocketIO.Server) => {
        socketServer.on('connection', () => {
            // Here set the login of game, players and more...
        });
    }
}