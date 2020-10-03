import { MessageEmbed } from 'discord.js';

const makeShowHeroclassesMessage = (id: string) => {
    return new MessageEmbed()
        .setDescription(`So you think you're read to choose a class ${id}? Available classes are: Berserker, Wizard, Cleric, Ranger and Tinkerer.
        Use -heroclass [desired class] to choose your path.`)
        .setColor('RED');
}

export { makeShowHeroclassesMessage };