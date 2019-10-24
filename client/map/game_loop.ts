import { Application, Container, Sprite, Texture, Text } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Assets } from './assets/assets';
import { Grid } from '../../flow-core/grid';
import { belongsToObstacle, belongsToCity } from '../../flow-core/util/misc';
import { TerrainType, IBlock } from '../../flow-core/types';
import ifElse from 'ramda/es/ifElse';
import { fullTile, treeFor, oceanFull, city } from './util/misc';

export interface GameLoopProps {
  delta: number;
  app: Application;
  viewport: Viewport;
  grid: Grid;
  onClick: (i: number, j: number) => void;
}

export const buildGridPixi = (props: GameLoopProps) => {
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
      // Can't make up my mind if I like the directional sprites yet.
      // const myDirection = direction(grid, i, j);
      // if (myDirection) {
      //  sprite = fullTile(myDirection.element as TerrainType | 'ocean');
      //  sprite.addChild(directionalTerrain(terrain, myDirection.direction));
      // }

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
          nameContainer.y = (i - 1) * 64;
          nameContainer.x = j * 64;
          const name = new Text(block.belongsTo.cityName, {
            fontFamily: 'Lato'
          });
          name.anchor.y = -0.5;

          nameContainer.addChild(name);
          viewport.addChild(nameContainer);
        }
      } else {
        // Doesn't belong to anything, i.e. we can place a road if we want to
        container.interactive = true;

        container.addListener('mouseover', function() {
          container.alpha = 0.8;
        });
        container.addListener('mouseout', () => {
          container.alpha = 1;
        });

        container.addListener('click', () => {
          props.onClick(i, j);
        });
      }

      container.addChild(sprite);
      viewport.addChild(container);
    }
  }
};
