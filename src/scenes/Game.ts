import { Scene } from 'phaser';
import { ArtKeys, AudioKeys, getRandomSymbol } from './Boot';

export class Game extends Scene
{
    private _button: Phaser.GameObjects.Image;
    private _sountButton: Phaser.GameObjects.Image;
    private _soundIcon: Phaser.GameObjects.Image;
    private _symbols: Symbol[] = [];
    private _targetSymbols: Symbol[] = [];

    private _maxVelocity: number = 2;
    private _currentVelocity: number = 0;
    private _acceleration: number = 0.003;
    private _deceleration: number = 0.003;
    
    private _maxSpinCount: number = 6;
    private _spinCount: number = 0;
    private _isSpinning: boolean = false;
    private _currentTicket: Ticket|null = null;

    private _musicVolume: number = 0.5;
    private _soundsVolume: number = 1;

    private _spinSound: Phaser.Sound.BaseSound | null = null;
    private _ambientSound: Phaser.Sound.BaseSound | null = null;
    private _clickSound: Phaser.Sound.BaseSound | null = null;
    private _winSound: Phaser.Sound.BaseSound | null = null;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.initSceneStaticImages();
        this.initReels();
        this.initSpinButton();
        this._ambientSound = this.sound.add(AudioKeys.Ambient, { loop: true, volume: this._musicVolume });
        this._ambientSound.play();

        this._spinSound = this.sound.add(AudioKeys.Spin, { loop: false, volume: this._soundsVolume });
        this._clickSound = this.sound.add(AudioKeys.Click, { loop: false, volume: this._soundsVolume });
        this._winSound = this.sound.add(AudioKeys.WinSound, { loop: false, volume: this._soundsVolume });

        this.createVolumeControls();
    }

    update(_time: number, dt: number): void {
        if (this._isSpinning) {
            if (this._currentVelocity !== this._maxVelocity && this._spinCount < this._maxSpinCount) {
                this.accelerateVelocity(dt);
            } 
            
            if (this._spinCount >= this._maxSpinCount && this._currentVelocity > 0) {
                this.deaccelerateVelocity(dt);
            }

            this.moveSymbols(dt);

            if (this._spinCount === this._maxSpinCount && !this._currentTicket) {
                this._currentTicket = this.getTicket();
                this.setTargetSymbols(this._currentTicket);
            }

            if (this._currentVelocity < 0.005) {
                const needToResetReels: boolean = !this._symbols.every(e => e.image.y === e.startY);
                if (needToResetReels) {
                    this._spinSound.stop();
                    this.resetReelsPos(dt);
                } else {
                    this.stopSpin();
                }
            } 
        }
    }

    private async stopSpin(): Promise<void> {
        this._currentVelocity = 0;
        this._spinCount = 0;
        this._isSpinning = false;

        if (this.isWin()) {
            await this.onWin();
        }

        this._button.setInteractive();
        this._button.clearTint();
        this._currentTicket = null;
    }

    private initReels(): void {
        for (let x = 0; x < 3; x+=1) {
            for (let y = 0; y < 3; y+=1) {
                const posX: number = 360 + 180 * x;
                const posY: number = (346 - 170) + 170 * y;
                const key: string = getRandomSymbol();

                const image: Phaser.GameObjects.Image = this.add.image(posX, posY, key).setDepth(1).setScale(0.33);
                const symbol: Symbol = {
                    x,
                    y,
                    startX: posX,
                    startY: posY,
                    image,
                    needToResetPos: false
                };
                this._symbols.push(symbol);

                if (symbol.y === 1) {
                    this._targetSymbols.push(symbol);
                }
            }
        } 
    }

    private resetReelsPos(dt: number): void {
        for (let index = 0; index < this._symbols.length; index++) {
            const symbol: Symbol = this._symbols[index];

            let pos: number = Phaser.Math.Linear(
                symbol.image.y,
                symbol.startY,
                0.03
            );

            if (Math.abs(pos - symbol.startY) < 0.3) {
                pos = symbol.startY;

                if (index === this._symbols.length - 1) {
                    this.stopSpin();
                }
            }

            symbol.image.setY(pos);
        }
    }

    private initSceneStaticImages(): void {
        this.add.image(512, 384, ArtKeys.Bg).setDepth(2);
        this.add.image(362, 346, ArtKeys.ReelBg).setDepth(0);
        this.add.image(540, 346, ArtKeys.ReelBg).setDepth(0);
        this.add.image(720, 346, ArtKeys.ReelBg).setDepth(0);
    }

    private initSpinButton(): void {
        this._button = this.add.image(512, 630, ArtKeys.Button)
            .setDepth(2)
            .setInteractive()
            .on('pointerover', () => {
                this._button.setTint(0xaaaaaa);
                this.bounceButtonOnHover(this._button);
            })
            .on('pointerout', () => {
                this._button.clearTint();
                this.bounceButtonOnOut(this._button);
            })
            .on('pointerdown', () => {
                this._clickSound.play();
                this._spinSound.play();

                this.bounceButtonOnClick(this._button);
                this._isSpinning = true;
                
                this._button.disableInteractive();
            });
    }
    
    private bounceButtonOnClick(target: Phaser.GameObjects.Image): void {
        this._button.setScale(1);

        this.tweens.add({
            targets: target,
            scale: 0.9,
            yoyo: true,
            duration: 100,
            ease: 'Power1',
        });
    }

    private bounceButtonOnHover(target: Phaser.GameObjects.Image): void {
        this.tweens.add({
            targets: target,
            scale: 1.05,
            duration: 80,
            ease: 'Power1',
        });
    }

    private bounceButtonOnOut(target: Phaser.GameObjects.Image): void {
        this.tweens.add({
            targets: target,
            scale: 1,
            duration: 80,
            ease: 'Power1',
        });
    }

    private moveSymbols(dt: number): void {
        for (let index = 0; index < this._symbols.length; index++) {
            const symbol: Symbol = this._symbols[index];
            const posY = symbol.image.y;

            symbol.image.setY(posY + this._currentVelocity * dt);
            if (symbol.image.y > 560) {
                if (symbol.x === 0 && symbol.y === 0) {
                    this._spinCount += 1;
                }

                this.resetSymbol(symbol);
            }
        }
    }
    
    private resetSymbol(symbol: Symbol): void {
        symbol.image.setY(symbol.image.y - (170 * 3));

        if (symbol.y === 1 && this._currentTicket) {
            return;
        }

        symbol.image.setTexture(getRandomSymbol());
    }

    private accelerateVelocity(dt: number): void {
        this._currentVelocity = Phaser.Math.Linear(
            this._currentVelocity,
            this._maxVelocity,
            this._acceleration * dt
        );
    }

    private deaccelerateVelocity(dt: number): void {
        this._currentVelocity = Phaser.Math.Linear(
            this._currentVelocity,
            0,
            this._deceleration * dt
        );
    }

    private setTargetSymbols(ticket: Ticket): void {
        for (let index = 0; index < this._targetSymbols.length; index+=1) {
            const symbol = this._targetSymbols[index];
            
            symbol.image.setTexture(ticket[index]);
        }
    }

    private getTicket(): Ticket {
        let ticket: Ticket = [];

        if ( Math.floor(Math.random() * 11) > 6) {
            const key: string = getRandomSymbol();

            for (let index = 0; index < 3; index+=1) {
                ticket.push(key);
            }
        } else {
            for (let index = 0; index < 3; index+=1) {
                ticket.push(getRandomSymbol());
            }
        }
        
        return ticket;
    }

    private isWin(): boolean {
        let isWin: boolean = true;

        let key: string = this._currentTicket![0];

        for (let index = 1; index < this._currentTicket!.length; index++) {
            if (this._currentTicket![index] !== key) return false;
        }

        return isWin;
    }

    private async onWin(): Promise<void> {
        setTimeout(() => {
            this._winSound.play();
        }, 400);

        const anim = this.add.spine(540, 500, ArtKeys.Win, ArtKeys.BigWin, false).setDepth(3);
        anim.timeScale = 1.7;

        await new Promise(resolve => {
            anim.state.addListener({
                start: () => {},
                interrupt: () => {},
                end: () => {},
                dispose: () => {},
                event: () => {},
                complete: () => {
                    this.tweens.add({
                        targets: anim,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => {
                            anim.destroy();
                            resolve(true);
                        }
                    });
                }
            });
        });
    }

    private createVolumeControls(): void {
        this._sountButton = this.add.image(70, 70, ArtKeys.SoundButtonDefault)
        .setDepth(2)
        .setInteractive()
        .on('pointerover', () => {
            this._sountButton.setTexture(ArtKeys.SoundButtonHover);
        })
        .on('pointerout', () => {
            this._sountButton.setTexture(ArtKeys.SoundButtonDefault);
        })
        .on('pointerdown', () => {
            this.bounceButtonOnClick(this._sountButton);
            this.bounceButtonOnClick(this._soundIcon);
            this.toggleVolume();
        });

        this._soundIcon = this.add.image(70, 65, ArtKeys.SoundOnIcon).setDepth(2);
    }

    private toggleVolume(): void {
        if (this._soundsVolume === 0) {
            this._soundsVolume = 1;
            this._musicVolume = 0.5;
            this._soundIcon.setTexture(ArtKeys.SoundOnIcon);
            this.updateSounds();
        } else {
            this._soundsVolume = 0;
            this._musicVolume = 0;
            this._soundIcon.setTexture(ArtKeys.SoundOffIcon);
            this.updateSounds();
        }
    }

    private updateSounds(): void {
        this.sound.sounds.forEach(sound => {
            if (sound instanceof Phaser.Sound.WebAudioSound || sound instanceof Phaser.Sound.HTML5AudioSound) {
                sound.setVolume(sound.key === AudioKeys.Ambient ? this._musicVolume : this._soundsVolume);
            }
        });
    }
}

export type Symbol = {
    x: number;
    y: number;
    startX: number;
    startY: number;
    image: Phaser.GameObjects.Image;
    needToResetPos: boolean;
};

export type Ticket = string[];