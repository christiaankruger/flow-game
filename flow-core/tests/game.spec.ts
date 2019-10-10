import { createGameWithModules, Game } from '../game';
import { Module } from '../types';
import { Player } from '../player';

class PlayerAddModule implements Module {
  tick(game: Game) {
    game.players.push(
      new Player({ id: 'c', name: 'Christiaan', color: 'red' })
    );
  }
}

class PlayerNameChangeModule implements Module {
  tick(game: Game) {
    game.players[0].name = 'New name!';
  }
}

test('Module alters game state', () => {
  const game = createGameWithModules();
  // Nonsense modules
  game.registerModule(new PlayerAddModule());
  game.registerModule(new PlayerNameChangeModule());
  game.tick();

  expect(game.players.length).toBe(1);
  expect(game.players[0].name).toBe('New name!');
});
