import { GameService } from '../services';
import { E_GAME_STATUS } from '../enums/game.enum';
import { Server, Socket } from 'socket.io';

export class SocketController {

    private gameService: GameService = new GameService();

    index = (socketServer: Server): void => {
        socketServer.on('connection', (socket) => {
            socket.on('createGame', (data: { playerName: string }) => {
                const game = this.gameService.createGame(data.playerName, socket.id);
                if(game) {
                    const data = { game, player: game.players[0] };
                    const gameRoomName = game.getRoomName();
                    socket.join(gameRoomName)
                    socketServer.to(gameRoomName).emit('gameCreated', data);
                    this.setAdminListeners(socketServer, socket);
                }
            });

            socket.on('joinGame', (data: { playerName: string; gameCode: string }) => {
                const game = this.gameService.addPlayerByCode(data.playerName, data.gameCode, socket.id);
                if(game) {
                    const gameRoomName = game.getRoomName();
                    socket.join(gameRoomName);
                    socketServer.to(gameRoomName).emit('playerJoined', { game });
                    const player = game.players[game.players.length-1];
                    socket.emit('joinSuccess', { game, player });
                    this.setPlayerListeners(socketServer, socket);
                } else {
                    // TODO: Fail response to socket.
                }
            });
        });
    }

    setPlayerListeners = (socketServer: Server, socket: Socket): void => {
        socket.on('leaveGame', (data: { playerId: number; code: string }) => {
            const game = this.gameService.leaveGame(data.playerId, data.code);
            if (game) {
                socket.emit('leftGame');
                const gameRoomName = game.getRoomName()
                socketServer.to(gameRoomName).emit('gameUpdated', { game });
            }
        });

        socket.on('disconnect', () => {
            const game = this.gameService.findGameBySocketId(socket.id);
            if (game) {
                const updatedGameAfterDisconnection = this.gameService.deactivatePlayerBySocketId(game.code, socket.id);
                if(updatedGameAfterDisconnection){
                    const gameRoomName = updatedGameAfterDisconnection.getRoomName();
                    socketServer.to(gameRoomName).emit('gameUpdated', { game: updatedGameAfterDisconnection });
                    socket.on('reconnect', () => {
                        const updatedGameAfterReconnet = this.gameService.activatePlayerBySocketId(game.code, socket.id);
                        if (updatedGameAfterReconnet) {
                            socketServer.to(gameRoomName).emit('gameUpdated', { game: updatedGameAfterReconnet });
                        }
                    });
                }
            }
        });
    }

    setAdminListeners = (socketServer: Server, socket: Socket): void => {
        socket.on('startGame', (data: { code: string }) => {
            const game = this.gameService.findGameByCode(data.code);
            if (game) {
                game.status = E_GAME_STATUS.started;
                const activePlayers = game.players.filter(player => player.isActive);
                const spyId = activePlayers[Math.floor(Math.random()*game.players.length)].id;
                const player = game.players.find(player => player.id === spyId);
                if(player) {
                    const spyIndex = game.players.findIndex(p => p.id === spyId);
                    game.players[spyIndex].isSpy = true;
                }
                socketServer.to(game.getRoomName()).emit('gameUpdated', { game });
            }             
        });

        socket.on('endGame', (data: { code: string }) => {
            const game = this.gameService.findGameByCode(data.code);
            if (game) {
                this.gameService.endGame(data.code);
                socketServer.to(game.getRoomName()).emit('gameEnded');
            }
        });

        socket.on('restartGame', (data: { code: string }) => {
            const game = this.gameService.setGameStatus(data.code, E_GAME_STATUS.waiting);
            if (game) {
                game.players.map(player => {
                    player.isSpy = false;
                    return player;
                });
                socketServer.to(game.getRoomName()).emit('gameUpdated', { game });
            }
        });
    }
}