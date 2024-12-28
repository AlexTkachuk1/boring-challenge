import { Scene } from "phaser";
import { AudioKeys } from "../scenes/Boot";

export class SoundManager {
  private _scene: Scene;
  private _musicVolume: number = 0.5;
  private _soundsVolume: number = 1;

  public spinSound: Phaser.Sound.BaseSound | null = null;
  public winSound: Phaser.Sound.BaseSound | null = null;
  public clickSound: Phaser.Sound.BaseSound | null = null;
  private _ambientSound: Phaser.Sound.BaseSound | null = null;

  constructor(scene: Scene) {
    this._scene = scene;
  }

  public get isSoundOn(): boolean {
    return this._soundsVolume > 0;
  }

  public initSounds(): void {
    this._ambientSound = this._scene.sound.add(AudioKeys.Ambient, {
      loop: true,
      volume: this._musicVolume,
    });
    this._ambientSound.play();
    this.spinSound = this._scene.sound.add(AudioKeys.Spin, {
      loop: false,
      volume: this._soundsVolume,
    });
    this.clickSound = this._scene.sound.add(AudioKeys.Click, {
      loop: false,
      volume: this._soundsVolume,
    });
    this.winSound = this._scene.sound.add(AudioKeys.WinSound, {
      loop: false,
      volume: this._soundsVolume,
    });
  }

  public playAmbient(): void {
    this._ambientSound.play();
  }

  public playSpin(): void {
    this.spinSound.play();
  }

  public playClick(): void {
    this.clickSound.play();
  }

  public playWinSound(): void {
    this.winSound.play();
  }

  public toggleVolume(): void {
    if (this._soundsVolume === 0) {
      this._soundsVolume = 1;
      this._musicVolume = 0.5;

      this.updateSounds();
    } else {
      this._soundsVolume = 0;
      this._musicVolume = 0;

      this.updateSounds();
    }
  }

  public updateSounds(): void {
    // @ts-ignore
    this._scene.sound.sounds.forEach((sound) => {
      if (
        sound instanceof Phaser.Sound.WebAudioSound ||
        sound instanceof Phaser.Sound.HTML5AudioSound
      ) {
        sound.setVolume(
          sound.key === AudioKeys.Ambient
            ? this._musicVolume
            : this._soundsVolume
        );
      }
    });
  }
}
