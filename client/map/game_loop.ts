import { Application, Container, Sprite, Texture } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Assets } from './assets/assets';
import { Grid } from '../../flow-core/grid';

export interface GameLoopProps {
  delta: number;
  app: Application;
  viewport: Viewport;
  grid: Grid;
}

export const pixiGameTick = (props: GameLoopProps) => {
  buildGrid(props);
};

const buildGrid = (props: GameLoopProps) => {
  const { viewport, app, grid } = props;
  viewport.removeChildren();

  for (let i = 0; i < grid.height; i++) {
    for (let j = 0; j < grid.width; j++) {
      const container = new Container();
      container.x = i * 64;
      container.y = j * 64;

      const block = grid.blocks[i][j];
      if (!block.belongsTo) {
        // Grass block
        container.addChild(grassFull());
      }

      viewport.addChild(container);
    }
  }
};

const grassFull = () => {
  return new Sprite(Texture.from(Assets.Grass.Full));
};
