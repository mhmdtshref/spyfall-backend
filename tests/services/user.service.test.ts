import dotenvFlow from 'dotenv-flow';
dotenvFlow.config({ path: './environment' });

import { GameService } from "../../src/services";
import { Player } from '../../src/classes';
const gameService = new GameService();

describe("Test Jest package", () => {
    it("Testing should pass", async () => {
            // await expect(gameService.createGame()).resolves.toBeTruthy();
    });
});
