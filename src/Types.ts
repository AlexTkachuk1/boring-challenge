
export type Symbol = {
    x: number;
    y: number;
    startX: number;
    startY: number;
    image: Phaser.GameObjects.Image;
    needToResetPos: boolean;
};

export enum EventNames {
    stopSound ='stopSound',
    onWin = 'onWin',
    onStopSpin = 'onStopSpin',
    onButtonSpinCkick = 'onButtonSpinCkick',
    onToggleVolume = 'onToggleVolume'
};

export type Ticket = string[];