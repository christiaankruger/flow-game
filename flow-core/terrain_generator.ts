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

      const block: IBlock = {};

      if (heightNoise > 0.6) {
        block.terrain = 'ice';
      } else if (heightNoise < -0.6) {
        block.belongsTo = { obstacleType: 'ocean' };
      }

      const terrain = biomeNoiseToTerrain(temperatureNoise, humidityNoise);
      if (!block.terrain) {
        block.terrain = terrain;
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
        grid.blocks[i][j].terrain = sample(NESWNeighbours);
      }
    }
  }
};

const getNESWNeighbours = (i: number, j: number): number[][] => {
  let result = [];
  result = [[i - 1, j], [i, j + 1], [i + 1, j], [i, j - 1]];
  return result;
};

const biomeNoiseToTerrain = (
  temperatureNoise: number,
  humidityNoise: number
): TerrainType => {
  if (temperatureNoise > 0.5) {
    return 'sand';
  }
  if (humidityNoise > -0.1) {
    return 'grass';
  }
  return 'ground';
};

const noiseToObstacle = (noise: number): ByObstacle | {} => {
  if (noise < 0.75) {
    return {
      obstacleType: 'trees'
    };
  }
  return {};
};
