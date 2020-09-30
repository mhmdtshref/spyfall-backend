import DotenvFlow from 'dotenv-flow';
DotenvFlow.config({ path: './environment' });
import { ExpressApp } from './app';
import Http from 'http';
// import { sequelize } from './models';
// import { Sequelize } from 'sequelize/types';
// import { resolve } from 'bluebird';
import { SocketController } from './controllers/';
import SocketIO from 'socket.io';

export class Server {

  expressApp = new ExpressApp();
  httpServer: Http.Server;
  private socketController: SocketController = new SocketController();

  constructor(
  ){
    this.httpServer = new Http.Server(this.expressApp.app);
  }

  runServer = (): Promise<void | Http.Server> => {
    // return this.databaseConnection()
    // .then(this.serverListen)
    // .catch(this.serverErrorHandler);
    return new Promise(resolve => resolve())
    .then(this.socketListen)
    .then(this.serverListen)
    .catch(this.serverErrorHandler);
  }

  // databaseConnection = (): Promise<Sequelize> => {
  //   return this.sequelizeAuthenticate()
  //   .then(this.sequelizeSync);
  // }

  // sequelizeAuthenticate = (): Promise<void> => {
  //   return sequelize.authenticate();
  // }

  // sequelizeSync = (): Promise<Sequelize> => {
  //   return sequelize.sync({ force: false });
  // }

  socketListen = (): Promise<null> => {
    return new Promise(resolve => {
      const socketIO = SocketIO(this.httpServer);
      socketIO.origins('*:*');
      this.socketController.index(socketIO);
      resolve();
    });
  }

  serverListen = (): Http.Server => {
    const { PORT: port, HOST: host } = process.env
    return this.httpServer.listen(port, (): void => {
      console.log(`Server is running on: http://${host}:${port}`)
    });
  }

  serverErrorHandler = (error: Error): void => {
    console.log('Server run error: ', error.message);
  }

}

const server = new Server();
server.runServer();
