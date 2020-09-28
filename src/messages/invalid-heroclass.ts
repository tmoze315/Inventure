import { MessageEmbed } from 'discord.js';

const makeInvalidHeroclassMessage = (id: string) => {
    return new MessageEmbed()
        .setDescription(`Sorry ${id}! You seem to be level 10 or above, but the class you've selected is invalid! Please try again using a valid heroclass! (Berzerker, Wizard, Ranger, Cleric)`)
        .setColor('RED');
}

export { makeInvalidHeroclassMessage };