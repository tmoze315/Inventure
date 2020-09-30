import { Constructable } from "discord.js";
import { IArea } from "../areas/base-area";
import { DaggerfordArea } from "../areas/daggerford/area";
import { BayhillArea } from "../areas/bayhill/area";
import { DregMarshesArea } from "../areas/dreg-marshes/area";
import { ForestOfAngelsArea } from "../areas/forest-of-angels/area";
import { KingdomOfMinasArea } from "../areas/kingdom-of-minas/area";
import { RedbayArea } from "../areas/redbay/area";
import { TheLostRuinsArea } from "../areas/the-lost-ruins/area";
import { TriggalaDivideArea } from "../areas/triggala-divide/area";

interface Area {
    key: string,
    class: Constructable<IArea>,
    acceptedValues: Array<string>,
}

export default [
    <Area>{
        key: 'bayhill',
        class: BayhillArea,
        acceptedValues: ['bayhill', 'bay hill', 'bay-hill'],
    },
    <Area>{
        key: 'daggerford',
        class: DaggerfordArea,
        acceptedValues: ['daggerford'],
    },
    <Area>{
        key: 'dreg-marshes',
        class: DregMarshesArea,
        acceptedValues: ['dreg-marshes', 'dreg marshes'],
    },
    <Area>{
        key: 'redbay',
        class: RedbayArea,
        acceptedValues: ['redbay'],
    },
    <Area>{
        key: 'the-lost-ruins',
        class: TheLostRuinsArea,
        acceptedValues: ['the-lost-ruins', 'the lost ruins', 'lost-ruins', 'lost ruins'],
    },
    <Area>{
        key: 'forest-of-angels',
        class: ForestOfAngelsArea,
        acceptedValues: ['forest-of-angels', 'forest of angels'],
    },
    <Area>{
        key: 'trigalla-divide',
        class: TriggalaDivideArea,
        acceptedValues: ['trigalla-divide', 'trigalla divide'],
    },
    <Area>{
        key: 'kingdom-of-minas',
        class: KingdomOfMinasArea,
        acceptedValues: ['kingdom-of-minas', 'kingdom of minas'],
    },
];