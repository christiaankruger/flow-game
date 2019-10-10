import { CityModule } from '../city_module';
import { Game } from '../game';

const dummyGame = new Game();

describe('City Module', () => {
  describe('Seeding', () => {
    it('Should generate a random city', () => {
      const city = CityModule.GenerateNewCity([], dummyGame);

      console.log(`Spec: Generated: ${JSON.stringify(city)}`);

      expect(city.name).toBeDefined();
      expect(city.coordinates.row).toBeDefined();
      expect(city.coordinates.column).toBeDefined();
    });

    it('Should seed a list of cities', () => {
      const cities = CityModule.SeedCities(10, dummyGame);

      console.log(`Spec: Generated: ${JSON.stringify(cities)}`);

      expect(cities).toBeDefined();
      expect(cities.length).toBe(10);
      for (let city of cities) {
        expect(city.name).toBeDefined();
        expect(city.coordinates.row).toBeDefined();
        expect(city.coordinates.column).toBeDefined();
      }
    });

    it('Should seed a BIG list of cities do not clash (Non Deterministic)', () => {
      const cities = CityModule.SeedCities(200, dummyGame);

      expect(cities).toBeDefined();
      expect(cities.length).toBe(200);

      // Check no clashes
      // NOT DETERMINISTIC, but useful to know it's a goal

      const names: { [key: string]: boolean } = {};
      const fmt = (row: number, col: number) => `${row}-${col}`;
      const coordinates: { [key: string]: boolean } = {};

      for (let city of cities) {
        expect(names[city.name]).toBeFalsy();
        expect(
          coordinates[fmt(city.coordinates.row, city.coordinates.column)]
        ).toBeFalsy();

        names[city.name] = true;
        coordinates[fmt(city.coordinates.row, city.coordinates.column)] = true;
      }
    });
  });
});
