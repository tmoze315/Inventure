import { MockMessage } from 'jest-discordjs-mocks';
import Application from "../../application";

const runApplication = (message: any) => {
    const application = new Application();

    return application.handleMessage(message);
};

const createMessage = (content: string = '') => {
    jest.mock('../message');

    const { Message } = require('../message');
    const message = new Message(new MockMessage);

    jest.spyOn(message, 'send');

    if (content !== '') {
        message._content = content;
    }

    return message;
}

export { runApplication, createMessage };