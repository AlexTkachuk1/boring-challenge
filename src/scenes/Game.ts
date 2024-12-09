import { Scene } from 'phaser';
import { ReelManager } from '../Modules/ReelManager';
import { SoundManager } from '../Modules/SoundManager';
import { UIManager } from '../Modules/UIManager';
import { EventNames } from '../Types';
export class Game extends Scene
{
    private _events: Phaser.Events.EventEmitter;
    private _uiManager: UIManager;
    private _soundManager: SoundManager;
    private _reelManager: ReelManager;

    constructor () {
        super('Game');
    }

    create ()
    {
        this._events = new Phaser.Events.EventEmitter();
        
        this._uiManager = new UIManager(this, this._events);
        this._soundManager = new SoundManager(this);
        this._reelManager = new ReelManager(this, this._events);

        this._uiManager.initSceneStaticImages();
        this._uiManager.createVolumeControls();
        this._reelManager.initReels();
        this._uiManager.initSpinButton();
        this._soundManager.initSounds();

        this._events.addListener(EventNames.stopSound, this.stopSpinSound, this);
        this._events.addListener(EventNames.onWin, this.win, this);
        this._events.addListener(EventNames.onStopSpin, this.stopSpin, this);
        this._events.addListener(EventNames.onButtonSpinCkick, this.buttonSpinCkick, this);
        this._events.addListener(EventNames.onToggleVolume, this.toggleVolume, this);
    }

    shutdown() {
        this.events.removeListener(EventNames.stopSound, this.stopSpinSound, this);
        this.events.removeListener(EventNames.onWin, this.win, this);
        this.events.removeListener(EventNames.onStopSpin, this.stopSpin, this);
        this.events.removeListener(EventNames.onButtonSpinCkick, this.buttonSpinCkick, this);
        this.events.removeListener(EventNames.onToggleVolume, this.toggleVolume, this);
    }

    update(_time: number, dt: number): void {
        this._reelManager.updateReel(dt);
    }

    private stopSpinSound(): void {        
        this._soundManager.spinSound.stop();
    }

    private stopSpin(): void {
        this._uiManager.spinButton.setInteractive();
        this._uiManager.spinButton.clearTint();
    }

    private win(): void {
        setTimeout(() => {
            this._soundManager.winSound.play();
        }, 400);
    }

    private buttonSpinCkick() {
        this._soundManager.clickSound.play();
        this._soundManager.spinSound.play();
        this._reelManager.isSpinning = true;
    }

    private toggleVolume(): void {
        this._soundManager.toggleVolume();
        this._uiManager.toggleSoundButton(this._soundManager.isSoundOn);
    }
}