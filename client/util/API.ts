import axios from 'axios';
import { Grid } from '../../flow-core/grid';

export class API {
  static async generateTestGrid() {
    const data = await this._post('/test_grid');
    return data.data as Grid;
  }

  private static async _post(path: string, body?: Object) {
    try {
      const result = await axios.post(path, body);
      return result;
    } catch (error) {
      console.error(`API Error`, error);
      throw error;
    }
  }
}
