type ErrorsType = Record<string, { msg: string; [key: string]: any }>;

export class ErrorWithStatus {
    message: string;
    status: number;
    errors?: ErrorsType;

    constructor({
        message,
        status,
        errors,
    }: {
        message: string;
        status: number;
        errors?: ErrorsType;
    }) {
        this.message = message;
        this.status = status;
        this.errors = errors;
    }
}
