import axios from 'axios';

export class API {
  static registerPlayer(name: string) {
    return this._post('/player', {
      name
    });
  }

  private static async _post(path: string, body: Object) {
    try {
      const result = await axios.post(path, body);
      return result;
    } catch (error) {
      console.error(`API Error`, error);
      throw error;
    }
  }
}
