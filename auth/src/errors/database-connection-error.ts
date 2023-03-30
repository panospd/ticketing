import { CustomError } from "./custom-error"

export class DatabaseConnetionError extends CustomError {
    statusCode = 500
    reason = "Error connecting to database"
    constructor() {
        super("Error connecting to db")

        Object.setPrototypeOf(this, DatabaseConnetionError.prototype)
    }

    serializeErrors() {
        return [
            {
                message: this.reason
            }
        ]
    }
}