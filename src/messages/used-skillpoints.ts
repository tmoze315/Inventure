import { MessageEmbed } from 'discord.js';
import { SkillpointResults } from '../models/Player'

const makeUsedSkillpointsMessage = (skillpointResults: SkillpointResults) => {

    let end = 's';

    if (skillpointResults.finalPoints == 1) {
        end = '';
    }

    return new MessageEmbed()
        .setDescription(`Congratulations ${skillpointResults.player.username}! You now have ${skillpointResults.finalPoints} skillpoint${end} in ${skillpointResults.skill}`)
        .setColor('DARK_GREEN');
}

export { makeUsedSkillpointsMessage };