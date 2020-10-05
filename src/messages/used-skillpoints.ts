import { MessageEmbed } from 'discord.js';
import { SkillpointResults } from '../models/Player'

const makeUsedSkillpointsMessage = (skillpointResults: SkillpointResults) => {

    let end = 's';
    const caseCorrected = skillpointResults.skill.charAt(0).toUpperCase() + skillpointResults.skill.slice(1).trim();
    
    if (skillpointResults.finalPoints == 1){
        end = '';
    }

    return new MessageEmbed()
        .setDescription(`Congratulations ${skillpointResults.player.username}! You now have ${skillpointResults.finalPoints} skillpoint${end} in ${caseCorrected}`)
        .setColor('DARK_GREEN');
}

export { makeUsedSkillpointsMessage };