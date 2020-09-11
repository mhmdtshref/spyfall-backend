export class GeneralService {
    generateRandomCode = (length = 4): string => {
        return Math.random().toString(20).substr(2, length);
    }
}