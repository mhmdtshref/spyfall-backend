import { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';

export class SocketController {
    index = (socketServer: SocketIO.Server) => {
        socketServer.on('connection', (socket) => {
            socketServer.on('gameCreated', () => {
                // TODO: Create game using soclet.IO
            })
        });
    }
}