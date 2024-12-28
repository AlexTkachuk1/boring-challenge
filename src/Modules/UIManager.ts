import { Scene } from "phaser";
import { ArtKeys } from "../scenes/Boot";
import { EventNames } from "../Types";

export class UIManager {
  private _scene: Scene;

  private _events: Phaser.Events.EventEmitter;

  public spinButton: Phaser.GameObjects.Image;
  private _sountButton: Phaser.GameObjects.Image;
  private _soundIcon: Phaser.GameObjects.Image;

  constructor(scene: Scene, events: Phaser.Events.EventEmitter) {
    this._scene = scene;
    this._events = events;
  }

  public initSpinButton(): void {
    this.spinButton = this._scene.add
      .image(512, 630, ArtKeys.Button)
      .setDepth(2)
      .setInteractive()
      .on("pointerover", () => {
        this.spinButton.setTint(0xaaaaaa);
        this.bounceButtonOnHover(this.spinButton);
      })
      .on("pointerout", () => {
        this.spinButton.clearTint();
        this.bounceButtonOnOut(this.spinButton);
      })
      .on("pointerdown", () => {
        this._events.emit(EventNames.onButtonSpinCkick);

        this.bounceButtonOnClick(this.spinButton);
        this.spinButton.disableInteractive();
      });
  }

  public bounceButtonOnClick(target: Phaser.GameObjects.Image): void {
    this.spinButton.setScale(1);

    this._scene.tweens.add({
      targets: target,
      scale: 0.9,
      yoyo: true,
      duration: 100,
      ease: "Power1",
    });
  }

  public bounceButtonOnHover(target: Phaser.GameObjects.Image): void {
    this._scene.tweens.add({
      targets: target,
      scale: 1.05,
      duration: 80,
      ease: "Power1",
    });
  }

  public bounceButtonOnOut(target: Phaser.GameObjects.Image): void {
    this._scene.tweens.add({
      targets: target,
      scale: 1,
      duration: 80,
      ease: "Power1",
    });
  }

  public createVolumeControls(): void {
    this._sountButton = this._scene.add
      .image(70, 70, ArtKeys.SoundButtonDefault)
      .setDepth(2)
      .setInteractive()
      .on("pointerover", () => {
        this._sountButton.setTexture(ArtKeys.SoundButtonHover);
      })
      .on("pointerout", () => {
        this._sountButton.setTexture(ArtKeys.SoundButtonDefault);
      })
      .on("pointerdown", () => {
        this.bounceButtonOnClick(this._sountButton);
        this.bounceButtonOnClick(this._soundIcon);

        this._events.emit(EventNames.onToggleVolume);
      });

    this._soundIcon = this._scene.add
      .image(70, 65, ArtKeys.SoundOnIcon)
      .setDepth(2);
  }

  public initSceneStaticImages(): void {
    this._scene.add.image(512, 384, ArtKeys.Bg).setDepth(2);
    this._scene.add.image(330, 355, ArtKeys.ReelBg).setDepth(0);
    this._scene.add.image(508, 355, ArtKeys.ReelBg).setDepth(0);
    this._scene.add.image(688, 355, ArtKeys.ReelBg).setDepth(0);
  }

  public toggleSoundButton(active: boolean): void {
    active
      ? this._soundIcon.setTexture(ArtKeys.SoundOnIcon)
      : this._soundIcon.setTexture(ArtKeys.SoundOffIcon);
  }
}
