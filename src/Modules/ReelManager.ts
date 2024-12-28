import { Scene } from "phaser";
import { ArtKeys, getRandomSymbol } from "../scenes/Boot";
import { EventNames, Symbol, Ticket } from "../Types";
import { TicketManager } from "./TicketManager";

export class ReelManager {
  private _scene: Scene;

  private _events: Phaser.Events.EventEmitter;

  public isSpinning: boolean = false;
  private _symbols: Symbol[] = [];
  private _targetSymbols: Symbol[] = [];

  private _maxVelocity: number = 2;
  private _currentVelocity: number = 0;
  private _acceleration: number = 0.006;
  private _deceleration: number = 0.009;

  private _maxSpinCount: number = 8;
  private _spinCount: number = 0;
  private _currentTicket: Ticket | null = null;
  private _ticketManager: TicketManager;

  constructor(scene: Scene, events: Phaser.Events.EventEmitter) {
    this._scene = scene;
    this._ticketManager = new TicketManager();
    this._events = events;
  }

  public initReels(): void {
    for (let x = 0; x < 3; x += 1) {
      for (let y = 0; y < 3; y += 1) {
        const posX: number = 328 + 180 * x;
        const posY: number = 355 - 170 + 170 * y;
        const key: string = getRandomSymbol();

        const image: Phaser.GameObjects.Image = this._scene.add
          .image(posX, posY, key)
          .setDepth(1)
          .setScale(0.33);
        const symbol: Symbol = {
          x,
          y,
          startX: posX,
          startY: posY,
          image,
          needToResetPos: false,
        };
        this._symbols.push(symbol);

        if (symbol.y === 1) {
          this._targetSymbols.push(symbol);
        }
      }
    }
  }

  public updateReel(dt: number): void {
    if (this.isSpinning) {
      if (
        this._currentVelocity !== this._maxVelocity &&
        this._spinCount < this._maxSpinCount
      ) {
        this.accelerateVelocity(dt);
      }

      if (this._spinCount >= this._maxSpinCount && this._currentVelocity > 0) {
        this.deaccelerateVelocity(dt);
      }

      this.moveSymbols(dt);

      if (this._spinCount === this._maxSpinCount && !this._currentTicket) {
        this._currentTicket = this._ticketManager.getTicket();
        this.setTargetSymbols(this._currentTicket);
      }

      if (this._currentVelocity < 0.005) {
        const needToResetReels: boolean = !this._symbols.every(
          (e) => e.image.y === e.startY
        );
        if (needToResetReels) {
          this.resetReelsPos(dt);
        } else {
          this.stopSpin();
        }
      }
    }
  }

  public async stopSpin(): Promise<void> {
    this._currentVelocity = 0;
    this._spinCount = 0;
    this.isSpinning = false;

    if (this.isWin()) {
      await this.onWin();
    }

    this._events.emit(EventNames.onStopSpin);
    this._currentTicket = null;
  }

  public resetReelsPos(dt: number): void {
    for (let index = 0; index < this._symbols.length; index++) {
      const symbol: Symbol = this._symbols[index];

      this._scene.tweens.add({
        targets: symbol.image,
        y: symbol.startY,
        duration: 300,
        ease: "Linear",
      });
    }

    this.stopSpin();
    this._events.emit(EventNames.stopSound);
  }

  public moveSymbols(dt: number): void {
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

  public resetSymbol(symbol: Symbol): void {
    symbol.image.setY(symbol.image.y - 170 * 3 - 70);

    if (symbol.y === 1 && this._currentTicket) {
      return;
    }

    symbol.image.setTexture(getRandomSymbol());
  }

  public accelerateVelocity(dt: number): void {
    this._currentVelocity = Phaser.Math.Linear(
      this._currentVelocity,
      this._maxVelocity,
      this._acceleration * dt
    );
  }

  public deaccelerateVelocity(dt: number): void {
    this._currentVelocity = Phaser.Math.Linear(
      this._currentVelocity,
      0,
      this._deceleration * dt
    );
  }

  public setTargetSymbols(ticket: Ticket): void {
    for (let index = 0; index < this._targetSymbols.length; index += 1) {
      const symbol = this._targetSymbols[index];

      symbol.image.setTexture(ticket[index]);
    }
  }

  public isWin(): boolean {
    let isWin: boolean = true;

    let key: string = this._currentTicket![0];

    for (let index = 1; index < this._currentTicket!.length; index++) {
      if (this._currentTicket![index] !== key) return false;
    }

    return isWin;
  }

  public async onWin(): Promise<void> {
    this._events.emit(EventNames.onWin);

    const anim = this._scene.add
      .spine(508, 500, ArtKeys.Win, ArtKeys.BigWin, false)
      .setDepth(3);
    anim.timeScale = 1.7;

    await new Promise((resolve) => {
      anim.state.addListener({
        start: () => {},
        interrupt: () => {},
        end: () => {},
        dispose: () => {},
        event: () => {},
        complete: () => {
          this._scene.tweens.add({
            targets: anim,
            alpha: 0,
            duration: 300,
            onComplete: () => {
              anim.destroy();
              resolve(true);
            },
          });
        },
      });
    });
  }
}
