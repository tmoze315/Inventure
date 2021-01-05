export default (callback: CallableFunction, time: number) => {
    const timeout = require('./modules/settimeout');

    return timeout(callback, time);
}