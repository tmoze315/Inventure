import Application from "../../application";

const runApplication = (message: any) => {
    const application = new Application();

    return application.handleMessage(message);
};

export { runApplication };