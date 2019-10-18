import { Module, IRoute, ICity, TCoordinates } from './types';
import { Game } from './game';
import { sampleSize, sample } from 'lodash';
import { range, equals } from 'ramda';
import { buildUnionFindPerPlayer } from './grid_union_find';

// Responsibilities:
// Give I(r) to players
// Take O(r) from players
// Tick down on routes, expire them
// Find routes nobody is building for, remove them
// Generate new routes periodically

const EXPENSE_PER_BLOCK = 1;

export class RouteModule implements Module {
  static GenerateNewRoute(existingRoutes: IRoute[], game: Game): IRoute {
    const cities = game.cities;
    let targets = sampleSize(cities, 2);
    while (routeExists(targets[0].name, targets[1].name, existingRoutes)) {
      targets = sampleSize(cities, 2);
    }
    const expiringIn = sample(range(10, 21))!; // 10 - 20
    const income = generateIncomeAmount(distance(targets[0], targets[1]));
    return {
      from_city_name: targets[0].name,
      to_city_name: targets[1].name,
      expiring_in: expiringIn,
      income
    };
  }

  static SeedRoutes(amount: number, game: Game): IRoute[] {
    const result: IRoute[] = [];
    for (let i = 0; i < amount; i++) {
      const route = this.GenerateNewRoute(result, game);
      result.push(route);
    }
    return result;
  }

  tick(game: Game) {
    doRouteIncomeAndExpenses(game);
  }
}

function doRouteIncomeAndExpenses(game: Game) {
  // Build a UnionFind per player
  const map = buildUnionFindPerPlayer(game);

  // Go through each route
  for (const route of game.routes) {
    const fromCoordinates = game.cityByName(route.from_city_name)!.coordinates;
    const toCoordinates = game.cityByName(route.to_city_name)!.coordinates;

    // Count how many players made the route
    // CLUNKY: Make better
    let count = 0;
    for (const playerId in map) {
      const UF = map[playerId];
      if (UF.find(fromCoordinates, toCoordinates)) {
        count++;
      }
    }

    for (const playerId in map) {
      const UF = map[playerId];
      if (UF.find(fromCoordinates, toCoordinates)) {
        // Player has this route
        const player = game.playerById(playerId)!;
        player.addTransaction({
          description: `Income: ${route.from_city_name} to ${
            route.to_city_name
          }${count > 1 ? ' (shared)' : ''}`,
          amount: route.income / count
        });
      }
    }

    // Tick route down to expiry
    route.expiring_in -= count;
    // TODO: Remove if 0
  }

  // Expenses: $1 per block
  for (const playerId in map) {
    const UF = map[playerId];
    const player = game.playerById(playerId)!;

    const numberOfBlocks = UF.registeredCount() - game.cities.length;
    if (numberOfBlocks > 0) {
      player.addTransaction({
        description: `Maintenance for ${numberOfBlocks} blocks`,
        amount: numberOfBlocks * EXPENSE_PER_BLOCK * -1
      });
    }
  }
}

function routeExists(
  cityA: string,
  cityB: string,
  existingRoutes: IRoute[]
): boolean {
  return (
    existingRoutes.find(route => {
      return (
        (equals(route.from_city_name, cityA) &&
          equals(route.to_city_name, cityB)) ||
        (equals(route.from_city_name, cityB) &&
          equals(route.to_city_name, cityA))
      );
    }) !== undefined
  );
}

/**
 * Manhattan distance
 */
export function distance(cityA: ICity, cityB: ICity): number {
  return distanceByCoordinates(cityA.coordinates, cityB.coordinates);
}

export function distanceByCoordinates(
  coordinatesA: TCoordinates,
  coordinatesB: TCoordinates
): number {
  const diffRows = Math.abs(coordinatesA.row - coordinatesB.column);
  const diffColumns = Math.abs(coordinatesA.row - coordinatesB.column);
  return diffRows + diffColumns;
}

// Pricing v0
function generateIncomeAmount(distance: number) {
  // Income = B|R|
  // With: B ~ (1, 2)
  const B = Math.random() + 1;
  return B * distance;
}
