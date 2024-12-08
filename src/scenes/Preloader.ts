import { Scene } from 'phaser';
import { Art, ArtKeys, ArtPath } from './Boot';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(512, 384, ArtKeys.Logo).setScale(0.8);

        this.add.rectangle(512, 600, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512-230, 600, 4, 28, 0xffffff);

        //A real loader.
        // this.load.on('progress', (progress: number) => {
        //     bar.width = 4 + (460 * progress);
        // });

        // This is done intentionally. Loading bars often don't reflect reality. In this example, there's not much art to load,
        // so the actual loading process will be almost instantaneous. But you have to check out my logo)
        this.tweens.add({
            targets: bar,
            width: 464,
            duration: 1000,
            ease: 'Linear',
            onStart: () => {
                bar.width = 4;
            },
        });
    }

    preload ()
    {
        this.load.setPath('assets');
        
        this.load.image(ArtKeys.Logo, ArtPath[Art.Logo]);
    }

    create ()
    {
        //You have to check out my logo)
        setTimeout(() => {
            this.scene.start('Game'); 
        }, 1000);
    }
}
