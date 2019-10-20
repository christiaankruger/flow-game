import { Game } from '../game';
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
  const game = new Game();
  // Nonsense modules
  game.registerModule({
    name: 'player-add',
    module: new PlayerAddModule()
  });
  game.registerModule({
    name: 'player-change',
    module: new PlayerNameChangeModule()
  });
  game.tick();

  expect(game.players.length).toBe(1);
  expect(game.players[0].name).toBe('New name!');
});
