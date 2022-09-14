import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500
    
    constructor() {
        super("Error connecton to database")

        Object.setPrototypeOf(this, CustomError.prototype);
    }

    serializeErrors = () => [{ message: this.message}]    
}