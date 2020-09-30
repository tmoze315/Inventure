import { Constructable } from "discord.js";
import { IArea } from "../areas/base-area";
import { DalelandsArea } from "../areas/dalelands/area";

interface Area {
    key: string,
    class: Constructable<IArea>,
    acceptedValues: Array<string>,
}

export default [
    <Area>{
        key: 'dalelands',
        class: DalelandsArea,
        acceptedValues: ['dalelands'],
    },
    // <Area>{
    //     key: 'daggerford',
    //     class: DaggerfordArea,
    //     acceptedValues: ['daggerford'],
    // },
    // <Area>{
    //     key: 'dreg-marshes',
    //     class: DregMarshesArea,
    //     acceptedValues: ['dreg-marshes', 'dreg marshes'],
    // },
    // <Area>{
    //     key: 'redbay',
    //     class: RedbayArea,
    //     acceptedValues: ['redbay'],
    // },
    // <Area>{
    //     key: 'the-lost-ruins',
    //     class: TheLostRuinsArea,
    //     acceptedValues: ['the-lost-ruins', 'the lost ruins', 'lost-ruins', 'lost ruins'],
    // },
    // <Area>{
    //     key: 'forest-of-angels',
    //     class: ForestOfAngelsArea,
    //     acceptedValues: ['forest-of-angels', 'forest of angels'],
    // },
    // <Area>{
    //     key: 'trigalla-divide',
    //     class: TriggalaDivideArea,
    //     acceptedValues: ['trigalla-divide', 'trigalla divide'],
    // },
    // <Area>{
    //     key: 'kingdom-of-minas',
    //     class: KingdomOfMinasArea,
    //     acceptedValues: ['kingdom-of-minas', 'kingdom of minas'],
    // },
];