// TODO: Write a (much) better spec

import { CityModule } from '../city_module';
import { Game } from '../game';
import { RouteModule, distanceByCoordinates } from '../route_module';
import { buildUnionFindPerPlayer } from '../grid_union_find';
import { Player } from '../player';
import { TCoordinates } from '../types';
import { Grid } from '../grid';

const dummyGame = new Game();
dummyGame.cities = [
  {
    name: 'A0',
    coordinates: {
      row: 0,
      column: 0
    }
  },
  {
    name: 'A1',
    coordinates: {
      row: 0,
      column: 4
    }
  },
  {
    name: 'B0',
    coordinates: {
      row: 2,
      column: 0
    }
  },
  {
    name: 'B1',
    coordinates: {
      row: 2,
      column: 4
    }
  },
  {
    name: 'C0',
    coordinates: {
      row: 4,
      column: 0
    }
  },
  {
    name: 'C1',
    coordinates: {
      row: 4,
      column: 4
    }
  }
];
dummyGame.players.push(new Player({ id: 'RED', name: 'RED' }));
dummyGame.players.push(new Player({ id: 'GREEN', name: 'GREEN' }));
dummyGame.players.push(new Player({ id: 'BLUE', name: 'BLUE' }));

const RED_COORDINATE_ARRAY = [[0, 1], [0, 2], [0, 3]];
const GREEN_COORDINATE_ARRAY = [[2, 1], [2, 2], [2, 3]];
const BLUE_COORDINATE_ARRAY = [[4, 1], [4, 2], [4, 3]];

assignToPlayer(RED_COORDINATE_ARRAY, 'RED');
assignToPlayer(GREEN_COORDINATE_ARRAY, 'GREEN');
assignToPlayer(BLUE_COORDINATE_ARRAY, 'BLUE');

describe('Grid x Union-Find', () => {
  it('Should build a Union Find per player', () => {
    const map = buildUnionFindPerPlayer(dummyGame);
    expect(Object.keys(map).length).toBe(3);

    // Test individual coordinates

    const UFRed = map['RED'];
    expect(UFRed.registeredCount()).toBe(3 + 6);
    const redCombinations = combinations(
      RED_COORDINATE_ARRAY.map(arrayToCoordinate)
    );

    for (let c of redCombinations) {
      expect(UFRed.find(c[0], c[1])).toBe(true);
    }

    const UFGreen = map['GREEN'];
    expect(UFGreen.registeredCount()).toBe(3 + 6);
    const greenCombinations = combinations(
      GREEN_COORDINATE_ARRAY.map(arrayToCoordinate)
    );

    for (let c of greenCombinations) {
      expect(UFGreen.find(c[0], c[1])).toBe(true);
    }

    const UFBlue = map['BLUE'];
    expect(UFBlue.registeredCount()).toBe(3 + 6);
    const blueCombinations = combinations(
      BLUE_COORDINATE_ARRAY.map(arrayToCoordinate)
    );

    for (let c of blueCombinations) {
      expect(UFBlue.find(c[0], c[1])).toBe(true);
    }

    // Cities

    expect(
      UFRed.find(
        dummyGame.cityByName('A0')!.coordinates,
        dummyGame.cityByName('A1')!.coordinates
      )
    ).toBe(true);
    expect(
      UFGreen.find(
        dummyGame.cityByName('A0')!.coordinates,
        dummyGame.cityByName('A1')!.coordinates
      )
    ).toBe(false);
    expect(
      UFBlue.find(
        dummyGame.cityByName('A0')!.coordinates,
        dummyGame.cityByName('A1')!.coordinates
      )
    ).toBe(false);

    expect(
      UFGreen.find(
        dummyGame.cityByName('B0')!.coordinates,
        dummyGame.cityByName('B1')!.coordinates
      )
    ).toBe(true);
    expect(
      UFBlue.find(
        dummyGame.cityByName('B0')!.coordinates,
        dummyGame.cityByName('B1')!.coordinates
      )
    ).toBe(false);
    expect(
      UFRed.find(
        dummyGame.cityByName('B0')!.coordinates,
        dummyGame.cityByName('B1')!.coordinates
      )
    ).toBe(false);
  });
});

function assignToPlayer(coordinateArray: number[][], playerId: string) {
  coordinateArray.map(arrayToCoordinate).forEach(coordinate => {
    dummyGame.grid.set(
      {
        player_id: playerId
      },
      coordinate.row,
      coordinate.column
    );
  });
}

function arrayToCoordinate(arr: number[]): TCoordinates {
  return { row: arr[0], column: arr[1] };
}

function combinations<T>(arr: T[]) {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      result.push([arr[i], arr[j]]);
    }
  }
  return result;
}
