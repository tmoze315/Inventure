interface ReplyInterface {
    type: String,
    body: Array<String>,
}

class Reply {
    constructor(protected reply: ReplyInterface) { }

    getContent() {
        return this.reply.body.join('\n');
    }
}

export { ReplyInterface, Reply };
