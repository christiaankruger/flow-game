import { CityModule } from '../city_module';
import { Game } from '../game';
import { RouteModule, distanceByCoordinates } from '../route_module';

const dummyGame = new Game();
dummyGame.cities = CityModule.SeedCities(10, dummyGame);

describe('Route Module', () => {
  describe('Seeding', () => {
    it('Should generate a random city', () => {
      const route = RouteModule.GenerateNewRoute([], dummyGame);
      const fromCoordinates = dummyGame.cities.find(
        x => x.name === route.from_city_name
      )!.coordinates;
      const toCoordinates = dummyGame.cities.find(
        x => x.name === route.to_city_name
      )!.coordinates;
      const distance = distanceByCoordinates(fromCoordinates, toCoordinates);

      console.log(
        `Spec: Generated: ${JSON.stringify({
          ...route,
          distance
        })}`
      );

      expect(route.from_city_name).toBeDefined();
      expect(route.to_city_name).toBeDefined();
      expect(route.income).toBeDefined();
      expect(route.income).toBeGreaterThan(distance);
      expect(route.expiring_in).toBeDefined();
    });
  });
});
