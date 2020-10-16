interface HeroClass {
    name: string,
    description: string,
    thumbnail: string,
}

interface HeroClasses {
    [key: string]: HeroClass,
}

const Berserker = <HeroClass>{
    name: 'Berserker',
    description: 'Berserkers have the option to rage and add big bonuses to attacks, but fumbles hurt. Use the rage command when attacking in an adventure.',
    thumbnail: 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/5cc20b78734ffe0d264885ada90cd961/CLASSBarbarian.JPG',
};

const Wizard = <HeroClass>{
    name: 'Wizard',
    description: 'Wizards have the option to focus and add large bonuses to their magic, but their focus can sometimes go astray...\nUse the focus command when attacking in an adventure.',
    thumbnail: 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/34b30b92157ecc2bf75af2bcf708ba5a/CLASSWizard.JPG',
};

const Ranger = <HeroClass>{
    name: 'Ranger',
    description: 'Rangers can gain a special pet, which can find items and give reward bonuses.\nUse the pet command to see pet options.',
    thumbnail: 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/2f0bc2ec03ff460ee815abe46b725347/CLASSRanger.JPG',
};

const Tinkerer = <HeroClass>{
    name: 'Tinkerer',
    description: 'Tinkerers can forge two different items into a device bound to their very soul.\nUse the forge command.',
    thumbnail: 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/b633bd0239f0ee1ef5f47272c7814c01/CLASSNecromancer.JPG',
};

const Cleric = <HeroClass>{
    name: 'Cleric',
    description: 'Clerics can bless the entire group when praying.\nUse the bless command when fighting in an adventure.',
    thumbnail: 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/56783c25637a39cb722076bec44bb29e/CLASSCleric.JPG',
};

const NoClass = <HeroClass>{
    name: 'Hero',
    description: 'All heroes are destined for greatness, your journey begins now.',
    thumbnail: 'https://trello-attachments.s3.amazonaws.com/5f6ae9c8643990173240eb3c/5f6b44d2da1f5b269987c47e/618476d18c95662c3352f18b5c3b5118/CLASSRogue.JPG',
};

const heroClasses = <HeroClasses>{
    Wizard,
    Berserker,
    Ranger,
    Tinkerer,
    Cleric,
    NoClass,
};

const getHeroClass = (heroClass: string): HeroClass => {
    return heroClasses[heroClass] || NoClass;
}

const getHeroClassOrFail = (heroClass: string): HeroClass => {
    const heroClassKey = Object.keys(heroClasses).find((item) => {
        return heroClasses[item].name.toLowerCase() === heroClass.toLowerCase();
    });

    if (!heroClassKey) {
        throw new Error('Invalid hero class');
    }

    return heroClasses[heroClassKey];
}

export { getHeroClass, getHeroClassOrFail, HeroClass };