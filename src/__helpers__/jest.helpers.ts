import { registry } from '@alexlafroscia/service-locator';
import Application from "../application";

const runApplication = (message: any) => {
    const application = new Application();

    registry.register('message', message);

    return application.handleMessage();
};

const mockTime = (date: Date) => {
    jest.mock('../utils/modules/time');
    const now = require('../utils/modules/time');

    now.mockReturnValue(date);
}

export { runApplication, mockTime };