import { TerrainType, IBlock } from '../../../flow-core/types';
import { Assets } from '../assets/assets';
import { Sprite, Texture } from 'pixi.js';
import { Grid } from '../../../flow-core/grid';
import { belongsToObstacle } from '../../../flow-core/util/misc';

export const ORDER = [
  'ice',
  'ground',
  'light-ground',
  'grass',
  'gravel',
  'sand',
  'ocean'
];

export const grassFull = () => {
  return new Sprite(Texture.from(Assets.Grass.Full));
};

export const sandFull = () => {
  return new Sprite(Texture.from(Assets.Sand.Full));
};

export const groundFull = () => {
  return new Sprite(Texture.from(Assets.Ground.Full));
};

export const lightGroundFull = () => {
  return new Sprite(Texture.from(Assets.LightGround.Full));
};

export const gravelFull = () => {
  return new Sprite(Texture.from(Assets.Gravel.Full));
};

export const iceFull = () => {
  return new Sprite(Texture.from(Assets.Ice.Full));
};

export const roadIntersection = () => {
  return new Sprite(Texture.from(Assets.Road.Intersection));
};

export const rock = () => {
  const grass = grassFull();
  const rock = new Sprite(Texture.from(Assets.Rock));
  grass.addChild(rock);
  return grass;
};

export const tree = () => {
  return new Sprite(Texture.from(Assets.Tree.Green));
};

export const treeFor = (terrain: TerrainType) => {
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

export const city = () => {
  return new Sprite(Texture.from(Assets.City));
};

export const oceanFull = () => {
  return new Sprite(Texture.from(Assets.Ocean.Full));
};

export const fullTile = (block: TerrainType | 'ocean'): Sprite => {
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

export const directionalTerrain = (
  terrain: TerrainType,
  direction: string // Uppercase
): Sprite => {
  const directionIndex =
    direction === 'Full' ? 'Full' : direction.toUpperCase();
  const target = (Assets as any)[toTerrainIndex(terrain)][directionIndex];
  return new Sprite(Texture.from(target));
};

export const toTerrainIndex = (terrain: string) => {
  // TODO: Better
  if (terrain === 'light-ground') {
    return 'LightGround';
  }
  return [terrain[0].toUpperCase(), terrain.substring(1)].join('');
};

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

// PLEASE NOTE: This algorithm is by no means perfect and was supposed to be a POC
// export const direction = (grid: Grid, i: number, j: number) => {
//   const blocks = grid.blocks;
//   const base = blocks[i][j].terrain || 'grass';

//   if (i === 0 || j === 0 || i === grid.height - 1 || j === grid.width - 1) {
//     return {
//       direction: 'Full',
//       element: base
//     };
//   }

//   const safeBlock = (x: number, y: number) => {
//     const xSafe = inRange(x, 0, grid.height);
//     const ySafe = inRange(y, 0, grid.height);
//     if (xSafe && ySafe) {
//       return blocks[x][y];
//     }
//     return undefined;
//   };

//   const higherThan = (target?: string) => {
//     if (!target) {
//       return true;
//     }
//     return ORDER.indexOf(base) < ORDER.indexOf(target);
//   };

//   const lowerEqualThan = (target?: string) => {
//     if (!target) {
//       return true;
//     }
//     return ORDER.indexOf(base) >= ORDER.indexOf(target);
//   };

//   const UL = safeOceanOrTerrain(safeBlock(i - 1, j - 1));
//   const U = safeOceanOrTerrain(safeBlock(i - 1, j));
//   const UR = safeOceanOrTerrain(safeBlock(i + 1, j + 1));
//   const L = safeOceanOrTerrain(safeBlock(i, j - 1));
//   const R = safeOceanOrTerrain(safeBlock(i, j + 1));
//   const DL = safeOceanOrTerrain(safeBlock(i + 1, j - 1));
//   const D = safeOceanOrTerrain(safeBlock(i + 1, j));
//   const DR = safeOceanOrTerrain(safeBlock(i + 1, j + 1));

//   if (higherThan(L)) {
//     if (higherThan(D)) {
//       if (lowerEqualThan(R)) {
//         return {
//           direction: 'SW',
//           element: L
//         };
//       }
//     }
//     if (higherThan(U)) {
//       if (lowerEqualThan(R)) {
//         return {
//           direction: 'NW',
//           element: L
//         };
//       }
//     }
//     return {
//       direction: 'W',
//       element: L
//     };
//   }

//   if (higherThan(U)) {
//     if (higherThan(R)) {
//       if (lowerEqualThan(L)) {
//         return {
//           direction: 'NE',
//           element: U
//         };
//       }
//     }
//     return {
//       direction: 'N',
//       element: U
//     };
//   }

//   if (higherThan(D)) {
//     if (higherThan(R)) {
//       return {
//         direction: 'SE',
//         element: D
//       };
//     }
//     return {
//       direction: 'S',
//       element: D
//     };
//   }

//   if (higherThan(R)) {
//     return {
//       direction: 'E',
//       element: R
//     };
//   }
// };
