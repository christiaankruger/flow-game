import { Application, Container, Sprite, Texture } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Assets } from './assets/assets';
import { Grid } from '../../flow-core/grid';
import { belongsToObstacle, belongsToCity } from '../../flow-core/util/misc';
import { TerrainType, IBlock } from '../../flow-core/types';
import ifElse from 'ramda/es/ifElse';

export interface GameLoopProps {
  delta: number;
  app: Application;
  viewport: Viewport;
  grid: Grid;
}

const ORDER = ['ice', 'ground', 'sand', 'grass'];

let currentGridHash: string | undefined = undefined;

export const pixiGameTick = (props: GameLoopProps) => {
  buildGrid(props);
};

const buildGrid = (props: GameLoopProps) => {
  const { viewport, app, grid } = props;
  viewport.removeChildren();

  for (let i = 0; i < grid.height; i++) {
    for (let j = 0; j < grid.width; j++) {
      const container = new Container();
      container.y = i * 64;
      container.x = j * 64;

      const block = grid.blocks[i][j];
      let sprite = fromTerrain(block.terrain || 'grass');

      if (block.terrain === 'ground') {
        // Only doing directional ground for now
        const myDirection = direction(grid, i, j);
        if (myDirection) {
          sprite = grassFull();
          sprite.addChild(directionalTerrain('ground', myDirection));
        }
      }

      if (block.terrain === 'sand') {
        // Only doing directional ground for now
        const myDirection = direction(grid, i, j);
        if (myDirection) {
          sprite = grassFull();
          sprite.addChild(directionalTerrain('sand', myDirection));
        }
      }

      if (block.belongsTo) {
        if (belongsToObstacle(block.belongsTo)) {
          if (block.belongsTo.obstacleType === 'trees') {
            sprite.addChild(tree());
          }
          if (block.belongsTo.obstacleType === 'ocean') {
            sprite.addChild(oceanFull());
          }
        }
        if (belongsToCity(block.belongsTo)) {
          sprite.addChild(city());
        }
      }
      container.addChild(sprite);
      viewport.addChild(container);
    }
  }
};

const grassFull = () => {
  return new Sprite(Texture.from(Assets.Grass.Full));
};

const sandFull = () => {
  return new Sprite(Texture.from(Assets.Sand.Full));
};

const rock = () => {
  const grass = grassFull();
  const rock = new Sprite(Texture.from(Assets.Rock));
  grass.addChild(rock);
  return grass;
};

const tree = () => {
  return new Sprite(Texture.from(Assets.Tree.Green));
};

const city = () => {
  return new Sprite(Texture.from(Assets.City));
};

const oceanFull = () => {
  return new Sprite(Texture.from(Assets.Ocean.Full));
};

const fromTerrain = (terrain: TerrainType): Sprite => {
  if (terrain === 'grass') {
    return new Sprite(Texture.from(Assets.Grass.Full));
  }
  if (terrain === 'sand') {
    return new Sprite(Texture.from(Assets.Sand.Full));
  }
  if (terrain === 'ground') {
    return new Sprite(Texture.from(Assets.Ground.Full));
  }
  return new Sprite(Texture.from(Assets.Ice.Full));
};

const directionalTerrain = (
  terrain: TerrainType,
  direction: string // Uppercase
): Sprite => {
  const target = (Assets as any)[toCapCase(terrain)][direction.toUpperCase()];
  return new Sprite(Texture.from(target));
};

const toCapCase = (word: string) => {
  return [word[0].toUpperCase(), word.substring(1)].join('');
};

const direction = (grid: Grid, i: number, j: number) => {
  const blocks = grid.blocks;
  const base = blocks[i][j].terrain || 'grass';

  const safeTerrain = (x?: IBlock) => (x ? x.terrain : undefined);
  const inRange = (x: number, lower: number, upper: number) =>
    lower <= x && x < upper;

  const safeBlock = (x: number, y: number) => {
    const xSafe = inRange(x, 0, grid.height);
    const ySafe = inRange(y, 0, grid.height);
    if (xSafe && ySafe) {
      return blocks[x][y];
    }
    return undefined;
  };

  const higherThan = (target?: string) => {
    if (!target) {
      return true;
    }
    return ORDER.indexOf(base) < ORDER.indexOf(target);
  };

  const lowerEqualThan = (target?: string) => {
    if (!target) {
      return true;
    }
    return ORDER.indexOf(base) >= ORDER.indexOf(target);
  };

  const UL = safeTerrain(safeBlock(i - 1, j - 1));
  const U = safeTerrain(safeBlock(i - 1, j));
  const UR = safeTerrain(safeBlock(i + 1, j + 1));
  const L = safeTerrain(safeBlock(i, j - 1));
  const R = safeTerrain(safeBlock(i, j + 1));
  const DL = safeTerrain(safeBlock(i + 1, j - 1));
  const D = safeTerrain(safeBlock(i + 1, j));
  const DR = safeTerrain(safeBlock(i + 1, j + 1));

  if (higherThan(L)) {
    if (higherThan(D)) {
      if (lowerEqualThan(R)) {
        return 'SW';
      }
    }
    if (higherThan(U)) {
      if (lowerEqualThan(R)) {
        return 'NW';
      }
    }
    return 'W';
  }

  if (higherThan(U)) {
    if (higherThan(R)) {
      if (lowerEqualThan(L)) {
        return 'NE';
      }
    }
    return 'N';
  }

  if (higherThan(D)) {
    if (higherThan(R)) {
      return 'SE';
    }
    return 'S';
  }

  if (higherThan(R)) {
    return 'E';
  }
};
