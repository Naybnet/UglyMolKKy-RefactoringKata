export type MolkkyState = 'GAME ALREADY WON' | 'GAME ALREADY LOST' | 'WON' | 'LOST' | 'RUNNING' | 'SCORE OVERFLOW';

export class Molkky {
  private _score: number;
  private _nFailuresInARow: number;
  private _hasOverflow;
  private currentState: MolkkyState;
  private running;
  private _hasDuplicates;

  constructor() {
    this._score = 0;
    this._nFailuresInARow = 0;
    this._hasOverflow = false;
    this.currentState = 'RUNNING';
    this.running = true;
    this._hasDuplicates = false;
  }

  get score() {
    return this._score;
  }

  get state() {
    return this.currentState;
  }

  get iswon() {
    return this._score >= 50;
  }

  get hasOverflow() {
    return this._hasOverflow;
  }

  get hasDuplicates() {
    return this._hasDuplicates;
  }

  endGame() {
    this.running = false;
    this.currentState = this.iswon ? 'WON' : 'LOST';
  }

  manageEndedGame() {
    if (['GAME ALREADY WON', 'GAME ALREADY LOST'].includes(this.currentState || '')) return;
    this.currentState = this.iswon ? 'GAME ALREADY WON' : 'GAME ALREADY LOST';
  }

  public shoot(pinValues: number[]) {
    if (!this.running) {
      this.manageEndedGame();
      return;
    }

    const shotHasMissed = pinValues.length === 0;

    if (shotHasMissed) {
      this._nFailuresInARow++;
      if (this._nFailuresInARow >= 3) this.endGame();
      return;
    }

    this._nFailuresInARow = 0;

    const uniquePins = Array.from(new Set(pinValues)).filter((pin) => pin >= 1 && pin <= 12);

    if (uniquePins.length != pinValues.length) {
      this._hasDuplicates = true;
    }

    const shotHasHitMultiplePins = uniquePins.length > 1;

    if (shotHasHitMultiplePins) {
      this._score += uniquePins.length;
    } else {
      this._score += uniquePins[0] || 0;
    }

    // if (this.currentState === 'SCORE OVERFLOW') this.currentState = 'RUNNING'; // ??
    if (this._score > 50) {
      this._score = 25;
      this._hasOverflow = true;
      //this.currentState = 'SCORE OVERFLOW';
    }

    if (this.iswon) this.endGame();
  }
}
