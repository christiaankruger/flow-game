import { Application, Sprite, Texture, Container } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { DEFAULT_SQUARE_SIZE as DEFAULT_MAP_SIZE } from '../../flow-core/game';
import { Grid } from '../../flow-core/grid';
import { pixiGameTick } from './game_loop';

export interface GameMapProps {
  gridHeight: number;
  gridWidth: number;
  squareBlockSize: number;
}

export interface ViewportProps {
  screenWidth: number;
  screenHeight: number;
}

const DEFAULT_PROPS: GameMapProps = {
  gridHeight: DEFAULT_MAP_SIZE,
  gridWidth: DEFAULT_MAP_SIZE,
  squareBlockSize: 64 // We treat a block as 64px by 64px
};

export class GameMap {
  app: Application;
  viewport: Viewport;
  grid?: Grid;
  gridVersion: number = 0;
  drawnGridVersion: number = 0;

  constructor(
    gameMapProps: Partial<GameMapProps>,
    viewportProps: ViewportProps
  ) {
    const { gridHeight, gridWidth, squareBlockSize } = Object.assign(
      {},
      DEFAULT_PROPS,
      gameMapProps
    );

    const worldHeight = gridHeight * squareBlockSize;
    const worldWidth = gridWidth * squareBlockSize;

    this.app = new Application({
      height: 900,
      width: 800,
      antialias: true
    });

    this.viewport = new Viewport({
      screenWidth: viewportProps.screenHeight,
      screenHeight: viewportProps.screenWidth,
      worldWidth,
      worldHeight,
      // So that scrolling off-view doesn't make the viewport scroll
      divWheel: this.app.renderer.view,
      stopPropagation: true,
      // Stops chrome swipe left from triggering
      passiveWheel: false,
      interaction: this.app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    } as any);

    this.viewport
      .drag()
      .decelerate()
      .clamp({ direction: 'all' })
      .wheel();
    this.app.stage.addChild(this.viewport);
  }

  bindToRoot(rootElementId: string) {
    const root = document.getElementById(rootElementId)!;
    root.appendChild(this.app.view);

    // Setup game loop here too
    this.app.ticker.add(delta => {
      if (this.grid) {
        if (this.drawnGridVersion !== this.gridVersion) {
          pixiGameTick({
            delta,
            grid: this.grid,
            app: this.app,
            viewport: this.viewport
          });
          this.drawnGridVersion = this.gridVersion;
        }
      }
    });
  }

  setGrid(grid: Grid) {
    this.gridVersion++;
    this.grid = grid;
  }
}
