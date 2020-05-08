import { Application, Sprite, Texture, Container, Graphics } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { DEFAULT_SQUARE_SIZE as DEFAULT_MAP_SIZE } from '../../flow-core/game';
import { Grid } from '../../flow-core/grid';
import { buildGridPixi } from './game_loop';

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
  onClick: (i: number, j: number) => void = () => {};

  dragActive = false;

  constructor(
    gameMapProps: Partial<GameMapProps>,
    viewportProps: ViewportProps,
    onClick: (i: number, j: number) => void
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
      // CONFIRM THAT THIS IS CORRECT
      screenWidth: 800,
      screenHeight: 900,
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

    // this.viewport.moveCenter()

    this.viewport.on('drag-start', () => {
      this.dragActive = true;
    });

    this.viewport.on('drag-end', () => {
      this.dragActive = false;
    });

    this.app.stage.addChild(this.viewport);

    this.onClick = onClick;
  }

  focusAtBlockCoordinates(i: number, j: number) {
    this.viewport.moveCenter(j * DEFAULT_MAP_SIZE, i * DEFAULT_MAP_SIZE);
  }

  bindToRoot(rootElementId: string) {
    const root = document.getElementById(rootElementId)!;
    root.appendChild(this.app.view);

    // Setup game loop here too
    this.app.ticker.add(delta => {
      if (this.grid) {
        if (this.drawnGridVersion !== this.gridVersion) {
          buildGridPixi({
            delta,
            grid: this.grid,
            app: this.app,
            viewport: this.viewport,
            onClick: (i: number, j: number) => {
              // Guard against false positives
              if (this.dragActive) {
                return;
              }
              this.onClick(i, j);
            }
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
