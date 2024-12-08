import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.setPath('assets');

        for (let index = 0; index < ArtPath.length; index+=1) {
            const key: string = Art[index];            
            const path: string = ArtPath[index];
            
            this.load.image(key, path);
        }

        this.load.spine(ArtKeys.Win, 'Spine/timless_hw.json', 'Spine/timless_hw.atlas');

        for (let index = 0; index < AudioPath.length; index+=1) {
            const key: string = Audio[index];            
            const path: string = AudioPath[index];

            this.load.audio(key, path);
        }
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}

export enum ArtKeys {
    Bg = 'Bg',
    Logo = 'Logo',
    ReelBg = 'ReelBg',
    Button = 'Button',
    Symbols1 = 'Symbols1',
    Symbols2 = 'Symbols2',
    Symbols3 = 'Symbols3',
    Symbols4 = 'Symbols4',
    Symbols5 = 'Symbols5',
    Symbols6 = 'Symbols6',
    Symbols7 = 'Symbols7',
    Symbols8 = 'Symbols8',
    Symbols9 = 'Symbols9',
    Win = 'Win',
    BigWin = 'BigWin',
    SoundButtonDefault = 'SoundButtonDefault',
    SoundButtonHover = 'SoundButtonHover',
    SoundOffIcon = 'SoundOffIcon',
    SoundOnIcon = 'SoundOnIcon',
}

export enum Art {
    Bg = 0,
    Logo = 1,
    ReelBg = 2,
    Button = 3,
    Symbols1 = 4,
    Symbols2 = 5,
    Symbols3 = 6,
    Symbols4 = 7,
    Symbols5 = 8,
    Symbols6 = 9,
    Symbols7 = 10,
    Symbols8 = 11,
    Symbols9 = 12,
    SoundButtonDefault = 13,
    SoundButtonHover = 14,
    SoundOffIcon = 15,
    SoundOnIcon = 16,
}

export const ArtPath = [
    'bg.png',
    'logo.png',
    'reelBg.png',
    'button.png',
    'Symbols/1.png',
    'Symbols/2.png',
    'Symbols/3.png',
    'Symbols/4.png',
    'Symbols/5.png',
    'Symbols/6.png',
    'Symbols/7.png',
    'Symbols/8.png',
    'Symbols/9.png',
    'Default.png',
    'Hover.png',
    'SoundOff.png',
    'SoundOn.png',
];

export enum AudioKeys {
    Ambient = 'Ambient',
    Click = 'Click',
    Spin = 'Spin',
    WinSound = 'WinSound',
}

export enum Audio {
    Ambient = 0,
    Click = 1,
    Spin = 2,
    WinSound = 3,
}

export const AudioPath = [
    'Audio/ambient.mp3',
    'Audio/click.mp3',
    'Audio/spin.mp3',
    'Audio/win.mp3',
];

export const Symbols = [
    'Symbols1',
    'Symbols2',
    'Symbols3',
    'Symbols4',
    'Symbols5',
    'Symbols6',
    'Symbols7',
    'Symbols8',
    'Symbols9',
];

export function getRandomSymbol(): string {
    const randomIndex = Math.floor(Math.random() * Symbols.length);
    return Symbols[randomIndex];
}