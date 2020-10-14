class InvalidArgument extends Error {
    constructor(message: string | undefined) {
        if (!message) {
            message = 'An invalid argument was used';
        }

        super(message);
        this.name = 'InvalidArgument';
    }
}

export {
    InvalidArgument
} 
