class Discord {
    login(messageCallback: CallableFunction): Promise<any> {
        return Promise.resolve().then(() => {
            messageCallback();
        });
    }
}

export { Discord };