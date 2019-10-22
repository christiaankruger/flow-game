import { Application, Container, Sprite, Texture, Text } from 'pixi.js';
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

const ORDER = [
  'ice',
  'ground',
  'light-ground',
  'grass',
  'gravel',
  'sand',
  'ocean'
];

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
      let terrain = block.terrain || 'grass';
      let sprite = fullTile(terrain);
      const myDirection = direction(grid, i, j);
      if (myDirection) {
        sprite = fullTile(myDirection.element as TerrainType | 'ocean');
        sprite.addChild(directionalTerrain(terrain, myDirection.direction));
      }

      if (block.belongsTo) {
        if (belongsToObstacle(block.belongsTo)) {
          if (block.belongsTo.obstacleType === 'trees') {
            sprite.addChild(treeFor(terrain));
          }
          if (block.belongsTo.obstacleType === 'ocean') {
            sprite.addChild(oceanFull());
          }
        }
        if (belongsToCity(block.belongsTo)) {
          sprite.addChild(city());
          const nameContainer = new Container();
          nameContainer.y = i === 0 ? (i + 1) * 64 : (i - 1) * 64;
          nameContainer.x = j * 64;
          const name = new Text(block.belongsTo.cityName, {
            fontFamily: 'Lato'
          });
          name.anchor.y = -0.5;

          nameContainer.addChild(name);
          viewport.addChild(nameContainer);
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

const groundFull = () => {
  return new Sprite(Texture.from(Assets.Ground.Full));
};

const lightGroundFull = () => {
  return new Sprite(Texture.from(Assets.LightGround.Full));
};

const gravelFull = () => {
  return new Sprite(Texture.from(Assets.Gravel.Full));
};

const iceFull = () => {
  return new Sprite(Texture.from(Assets.Ice.Full));
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

const treeFor = (terrain: TerrainType) => {
  if (terrain === 'sand' || terrain === 'gravel') {
    return new Sprite(Texture.from(Assets.Tree.Cactus));
  }
  if (terrain === 'ground' || terrain === 'light-ground') {
    return new Sprite(Texture.from(Assets.Tree.Purple));
  }
  if (terrain === 'ice') {
    return new Sprite(Texture.from(Assets.Tree.Snowman));
  }
  return new Sprite(Texture.from(Assets.Tree.Green));
};

const city = () => {
  return new Sprite(Texture.from(Assets.City));
};

const oceanFull = () => {
  return new Sprite(Texture.from(Assets.Ocean.Full));
};

const fullTile = (block: TerrainType | 'ocean'): Sprite => {
  if (block === 'grass') {
    return grassFull();
  }
  if (block === 'sand') {
    return sandFull();
  }
  if (block === 'ground') {
    return groundFull();
  }
  if (block === 'light-ground') {
    return lightGroundFull();
  }
  if (block === 'gravel') {
    return gravelFull();
  }
  if (block === 'ice') {
    return iceFull();
  }
  return oceanFull();
};

const directionalTerrain = (
  terrain: TerrainType,
  direction: string // Uppercase
): Sprite => {
  const directionIndex =
    direction === 'Full' ? 'Full' : direction.toUpperCase();
  const target = (Assets as any)[toTerrainIndex(terrain)][directionIndex];
  return new Sprite(Texture.from(target));
};

const toTerrainIndex = (terrain: string) => {
  // TODO: Better
  if (terrain === 'light-ground') {
    return 'LightGround';
  }
  return [terrain[0].toUpperCase(), terrain.substring(1)].join('');
};

const direction = (grid: Grid, i: number, j: number) => {
  const blocks = grid.blocks;
  const base = blocks[i][j].terrain || 'grass';

  if (i === 0 || j === 0 || i === grid.height - 1 || j === grid.width - 1) {
    return {
      direction: 'Full',
      element: base
    };
  }

  const safeOceanOrTerrain = (x?: IBlock) => {
    if (!x) {
      return undefined;
    }
    if (x.belongsTo) {
      if (belongsToObstacle(x.belongsTo)) {
        if (x.belongsTo.obstacleType === 'ocean') {
          return 'ocean';
        }
      }
    }
    return x.terrain;
  };
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

  const UL = safeOceanOrTerrain(safeBlock(i - 1, j - 1));
  const U = safeOceanOrTerrain(safeBlock(i - 1, j));
  const UR = safeOceanOrTerrain(safeBlock(i + 1, j + 1));
  const L = safeOceanOrTerrain(safeBlock(i, j - 1));
  const R = safeOceanOrTerrain(safeBlock(i, j + 1));
  const DL = safeOceanOrTerrain(safeBlock(i + 1, j - 1));
  const D = safeOceanOrTerrain(safeBlock(i + 1, j));
  const DR = safeOceanOrTerrain(safeBlock(i + 1, j + 1));

  if (higherThan(L)) {
    if (higherThan(D)) {
      if (lowerEqualThan(R)) {
        return {
          direction: 'SW',
          element: L
        };
      }
    }
    if (higherThan(U)) {
      if (lowerEqualThan(R)) {
        return {
          direction: 'NW',
          element: L
        };
      }
    }
    return {
      direction: 'W',
      element: L
    };
  }

  if (higherThan(U)) {
    if (higherThan(R)) {
      if (lowerEqualThan(L)) {
        return {
          direction: 'NE',
          element: U
        };
      }
    }
    return {
      direction: 'N',
      element: U
    };
  }

  if (higherThan(D)) {
    if (higherThan(R)) {
      return {
        direction: 'SE',
        element: D
      };
    }
    return {
      direction: 'S',
      element: D
    };
  }

  if (higherThan(R)) {
    return {
      direction: 'E',
      element: R
    };
  }
};
