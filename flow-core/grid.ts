import { IBlock, IGrid } from './types';

export class Grid implements IGrid {
  blocks: IBlock[][] = [];

  constructor(public height: number, public width: number) {
    // Initialize empty grid
    for (let i = 0; i < height; i++) {
      const row: IBlock[] = [];
      for (let j = 0; j < width; j++) {
        row.push({});
      }
      this.blocks.push(row);
    }
  }

  set(block: IBlock, row: number, column: number): void {
    this.blocks[row][column] = block;
  }
}
