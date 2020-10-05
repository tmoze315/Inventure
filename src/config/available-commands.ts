import { AdminCommands } from '../commands/admin-commands';
import { AdventureCommands } from '../commands/adventure-commands';
import { AreaCommands } from '../commands/area-commands';
import { GenericCommands } from '../commands/generic-commands';

export default {
    // Character Related Commands
    start: { class: GenericCommands, method: 'start' },
    stats: { class: GenericCommands, method: 'stats' },
    heroclass: { class: GenericCommands, method: 'selectHeroclass' },
    rebirth: { class: GenericCommands, method: 'rebirth' },
    skill: {class: GenericCommands, method: 'skillpoints'},

    // Adventuring Commands
    adventure: { class: AdventureCommands, method: 'adventure' },
    a: { class: AdventureCommands, method: 'adventure' },
    boss: { class: AdventureCommands, method: 'summonAreaBoss' },

    // Travel/Area Commands
    travel: { class: AreaCommands, method: 'travel' },
    area: { class: AreaCommands, method: 'area' },

    // Admin Commands
    ban: { class: AdminCommands, method: 'ban' },
    unban: { class: AdminCommands, method: 'unban' },
    clear: { class: AdminCommands, method: 'clearAdventure' },
    addcur: { class: AdminCommands, method: 'addCurrency' }, // Change this to "-give <currency|loot> @player"
    makeadmin: { class: AdminCommands, method: 'makeAdmin' },
    changelevel: { class: AdminCommands, method: 'changeLevel' },
    changerebirths: { class: AdminCommands, method: 'changeRebirths' },
    resetcooldowns: { class: AdminCommands, method: 'resetCooldowns' },
    setxp: { class: AdminCommands, method: 'setExperience' },
    givexp: { class: AdminCommands, method: 'giveExperience' },
    unlock: { class: AdminCommands, method: 'unlock' },
}
