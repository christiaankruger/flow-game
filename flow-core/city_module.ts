import { Module, ICity } from './types';
import { Game } from './game';
import { sampleSize, sample } from 'lodash';
import { range } from 'ramda';
import { allCities } from './data/cities';

export class CityModule implements Module {
  static GenerateNewCity(existingCities: ICity[], game: Game): ICity {
    // Generate a new name
    let name = sample(allCities)!;
    while (existingCities.find(c => c.name === name)) {
      name = sample(allCities)!;
    }

    // Generate new coordinates
    let row = sample(range(1)(game.grid.height + 1))!;
    let column = sample(range(1)(game.grid.width + 1))!;
    while (
      existingCities.find(
        c => c.coordinates.row === row && c.coordinates.column === column
      )
    ) {
      row = sample(range(1, game.grid.height + 1))!;
      column = sample(range(1, game.grid.width + 1))!;
    }

    return {
      name,
      coordinates: {
        row,
        column
      }
    };
  }

  static SeedCities(amount: number, game: Game) {
    let result: ICity[] = [];
    for (let i = 0; i < amount; i++) {
      const newCity = this.GenerateNewCity(result, game);
      result.push(newCity);
    }
    return result;
  }

  tick(game: Game) {}
}
