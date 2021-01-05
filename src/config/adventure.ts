interface IAdventureConfig {
    adventureCooldownInSeconds: number,
    bossCooldownInSeconds: number,
    adminPassword: string,
    prefix: string,
    discord: {
        key: string,
    },
    mongodb: {
        url: string,
        useCreateIndex: boolean,
        autoIndex: boolean,
    },
};

const AdventureConfig = <IAdventureConfig>{
    adventureCooldownInSeconds: process.env.ADVENTURE_COOLDOWN_IN_SECONDS || 30,
    bossCooldownInSeconds: process.env.BOSS_COOLDOWN_IN_SECONDS || 3600, // 1 hour
    adminPassword: process.env.ADMIN_PASSWORD,
    prefix: process.env.PREFIX || '-',
    discord: {
        key: process.env.DISCORD_KEY,
    },
    mongodb: {
        url: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/inventure',
        useCreateIndex: process.env.MONGODB_CREATE_INDEX || true,
        autoIndex: process.env.MONGODB_AUTO_INDEX || true,
    },
};

export { AdventureConfig, IAdventureConfig }
