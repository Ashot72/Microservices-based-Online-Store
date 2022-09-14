import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode = 404

    constructor() {
        super("Not authorized")

        Object.setPrototypeOf(this, CustomError.prototype);
    }

    serializeErrors = () => [{ message: this.message}]    
}