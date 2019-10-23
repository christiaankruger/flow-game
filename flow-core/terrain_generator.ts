import { Grid } from './grid';
import OpenSimplexNoise from 'open-simplex-noise';
import { ByObstacle, TerrainType, IBlock } from './types';
import { sample } from 'lodash';

const SCALE = 10;

// Takes in an empty grid, spits out terrained grid
export const terrainGenerator = (grid: Grid): void => {
  // Times and divides by random stuff to force different seeds
  const heightSimplex = new OpenSimplexNoise(Date.now() * 12);
  const temperatureSimplex = new OpenSimplexNoise(Date.now() / 5);
  const humiditySimplex = new OpenSimplexNoise(Date.now() / 10);
  const obstacleSimplex = new OpenSimplexNoise(Date.now() / 4);

  for (let i = 0; i < grid.height; i++) {
    for (let j = 0; j < grid.width; j++) {
      const heightNoise = heightSimplex.noise2D(j / SCALE, i / SCALE);
      const temperatureNoise = temperatureSimplex.noise2D(j / SCALE, i / SCALE);
      const humidityNoise = humiditySimplex.noise2D(i / SCALE, j / SCALE);
      const obstacleNoise = obstacleSimplex.noise2D(i / SCALE, j / SCALE);
      const block: IBlock = {};
      if (heightNoise < -0.65) {
        block.belongsTo = { obstacleType: 'ocean' };
      }

      const terrain = biomeNoiseToTerrain(temperatureNoise, humidityNoise);
      block.terrain = terrain;
      if (!block.belongsTo) {
        const obstacle = noiseToObstacle(obstacleNoise);
        if (obstacle && Math.random() > 0.6) {
          block.belongsTo = {
            obstacleType: obstacle
          } as ByObstacle;
        }
      }

      grid.set(block, i, j);
    }
  }

  // Cleanup
  for (let i = 1; i < grid.height - 1; i++) {
    for (let j = 1; j < grid.width - 1; j++) {
      const me = grid.blocks[i][j].terrain;
      // Is alone
      const NESWNeighbours = getNESWNeighbours(i, j).map(
        ([r, c]) => grid.blocks[r][c].terrain
      );
      const alone = NESWNeighbours.every(t => t !== me);
      if (alone) {
        console.log('Found alone at ' + i + ', ' + j);
        // Turn me into one of my neighbours
        grid.blocks[i][j].terrain = mode(NESWNeighbours);
      }
    }
  }
};

const getNESWNeighbours = (i: number, j: number): number[][] => {
  return [[i - 1, j], [i, j + 1], [i + 1, j], [i, j - 1]];
};

const biomeNoiseToTerrain = (
  temperatureNoise: number,
  humidityNoise: number
): TerrainType => {
  if (temperatureNoise > 0.6) {
    return 'sand';
  }

  if (temperatureNoise < -0.6) {
    return 'ice';
  }

  if (humidityNoise > 0) {
    if (temperatureNoise > 0) {
      return 'gravel';
    }
    return 'grass';
  }
  if (temperatureNoise > 0) {
    return 'ground';
  }
  return 'light-ground';
};

const noiseToObstacle = (noise: number): string | null => {
  if (noise > 0.7) {
    return 'trees';
  }
  return null;
};

function mode(array: any[]) {
  if (array.length == 0) return null;
  const modeMap: { [key: string]: number } = {};
  let maxEl = array[0];
  let maxCount = 1;

  for (var i = 0; i < array.length; i++) {
    const el = array[i];
    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}
