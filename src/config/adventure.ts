interface Config {
    adventureCooldownInSeconds: number,
    bossCooldownInSeconds: number,
    adminPassword: string,
    prefix: string,
    discordKey: string,
};

export default <Config>{
    adventureCooldownInSeconds: process.env.ADVENTURE_COOLDOWN_IN_SECONDS || 30,
    bossCooldownInSeconds: process.env.BOSS_COOLDOWN_IN_SECONDS || 3600, // 1 hour
    adminPassword: process.env.ADMIN_PASSWORD,
    prefix: process.env.PREFIX || '-',
    discordKey: process.env.DISCORD_KEY,
};
