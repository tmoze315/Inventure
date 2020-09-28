interface Config {
    adventureCooldownInSeconds: number,
};

export default <Config>{
    adventureCooldownInSeconds: process.env.ADVENTURE_COOLDOWN_IN_SECONDS || 30,
};
