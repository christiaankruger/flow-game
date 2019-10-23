import { Module, ICity } from '../types';
import { Game } from '../game';
import { range } from 'ramda';
import { allCities } from '../data/cities';

export class CityModule implements Module {
  static GenerateNewCity(existingCities: ICity[], game: Game): ICity {
    // Generate a new name
    let name = sample(allCities)!;
    while (existingCities.find(c => c.name === name)) {
      name = sample(allCities)!;
    }

    // let row = ROW
    let row = sample(range(1)(game.grid.height - 1))!;
    let column = sample(range(1)(game.grid.width - 1))!;
    while (
      existingCities.find(
        c => c.coordinates.row === row && c.coordinates.column === column
      ) ||
      existingCities.find(c => {
        return (
          distance(c, {
            name: 'lazy',
            coordinates: {
              row,
              column
            }
          }) <
          // Expected value is 2/3k, which puts 10%-tile at 2/15k
          (2 / 15) * game.grid.height
        );
      }) ||
      !!game.grid.blocks[row][column].belongsTo
    ) {
      row = sample(range(1)(game.grid.height - 1))!;
      column = sample(range(1, game.grid.width - 1))!;
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

const sample = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const distance = (a: ICity, b: ICity) => {
  let d =
    Math.abs(a.coordinates.column - b.coordinates.column) +
    Math.abs(a.coordinates.row - b.coordinates.row);
  return d;
};
