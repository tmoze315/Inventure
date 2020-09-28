import { AdminCommands } from '../commands/admin-commands';
import { AdventureCommands } from '../commands/adventure-commands';
import { GenericCommands } from '../commands/generic-commands';

export default {
    start: { class: GenericCommands, method: 'start' },
    stats: { class: GenericCommands, method: 'stats' },
    heroclass: { class: GenericCommands, method: 'selectHeroclass' },
    adventure: { class: AdventureCommands, method: 'adventure' },
    a: { class: AdventureCommands, method: 'adventure' },
    clear: { class: AdminCommands, method: 'clearAdventure' },
    addcur: { class: AdminCommands, method: 'addCurrency' },
    makeadmin: { class: AdminCommands, method: 'makeAdmin' },
    changelevel: { class: AdminCommands, method: 'changeLevel' },
    changerebirths: { class: AdminCommands, method: 'changeRebirths' },
    resetcooldowns: { class: AdminCommands, method: 'resetCooldowns' },
}
