import { Game } from './game';
import { UnionFind } from './util/union-find';
import { TCoordinates } from './types';
import { belongsToPlayer } from './util/misc';

type TUnionFindPerPlayerResult = {
  [playerId: string]: UnionFind<TCoordinates>;
};

// Grid x UnionFind
export const buildUnionFindPerPlayer = (
  game: Game
): TUnionFindPerPlayerResult => {
  // Build Player to UF map
  const map: { [player: string]: UnionFind<TCoordinates> } = {};
  // Goals:
  // 1. Give I(r) to players, subtract O(r) from players
  for (const player of game.players) {
    // Build UnionFind set for this player
    const UF = new UnionFind<TCoordinates>(game.grid.width * game.grid.height);
    // 1. Register cities
    for (const city of game.cities) {
      UF.register(city.coordinates);
    }

    const blocks = game.grid.blocks;
    for (let i = 0; i < blocks.length; i++) {
      const row = blocks[i];
      for (let j = 0; j < row.length; j++) {
        const block = row[j];
        if (!block.belongsTo || !belongsToPlayer(block.belongsTo)) {
          // Early exit
          continue;
        }

        if (block.belongsTo.playerId === player.id) {
          // Block belongs to this player!
          const coordinates: TCoordinates = {
            row: i,
            column: j
          };

          // Mark this block
          UF.register(coordinates);

          const toUnion = generateAllCoordinatesToUnion(coordinates);
          toUnion.forEach(otherCoordinates => {
            // Since we only register blocks that we are on, the unions will only connect roads to other roads
            // unionIfExists so that we don't have to backtrack and re-evaluate the valid blocks
            UF.unionIfExists(coordinates, otherCoordinates);
          });
        }
      }
    } // End block registration
    map[player.id] = UF;
  } // End player loop

  return map;
};

function generateAllCoordinatesToUnion(
  coordinate: TCoordinates
): TCoordinates[] {
  // We generate all coordinates to top and left
  const { row, column } = coordinate;
  const result = [];

  // We don't care if the resulting coordinates are valid or not.
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) {
        // Current one
        continue;
      }
      result.push({
        row: row + dr,
        column: column + dc
      });
    }
  }
  return result;
}
