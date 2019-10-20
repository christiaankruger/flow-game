import { Grid } from './grid';
import OpenSimplexNoise from 'open-simplex-noise';
import { ByObstacle, TerrainType } from './types';
import { isEmpty } from 'ramda';

const SCALE = 7;

// Takes in an empty grid, spits out terrained grid
export const terrainGenerator = (grid: Grid): void => {
  const terrainSimplex = new OpenSimplexNoise(Date.now());
  const obstacleSimplex = new OpenSimplexNoise(Date.now() / 4);

  for (let i = 1; i < grid.height - 1; i++) {
    for (let j = 1; j < grid.width - 1; j++) {
      const terrainNoise = terrainSimplex.noise2D(j / SCALE, i / SCALE);
      const obstacleNoise = obstacleSimplex.noise2D(j / SCALE, i / SCALE);

      const terrain = noiseToTerrain(terrainNoise);

      const obstacleClassification = noiseToObstacle(obstacleNoise);

      const block = Object.assign({}, obstacleClassification, {
        terrain
      });

      grid.set(block, i, j);

      if (terrain !== 'grass') {
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            grid.set(block, i + di, j + dj);
          }
        }
      }
    }
  }
};

const noiseToTerrain = (noise: number): TerrainType => {
  if (noise > 0.6) {
    return 'ground';
  }
  return 'grass';
};

const noiseToObstacle = (noise: number): ByObstacle | {} => {
  if (noise < 0.75) {
    return {
      obstacleType: 'trees'
    };
  }
  return {};
};
