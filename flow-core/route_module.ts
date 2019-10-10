import { IModule, Module, IRoute, ICity } from './types';
import { Game } from './game';
import { sampleSize, sample } from 'lodash';
import { range, equals } from 'ramda';

// Responsibilities:
// Give I(r) to players
// Take O(r) from players
// Tick down on routes, expire them
// Generate new routes periodically

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

  tick(game: Game) {}
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

type TCoordinates = { row: number; column: number };
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
