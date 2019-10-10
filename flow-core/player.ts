import { IPlayer, ITransaction, ICity } from './types';

export class Player implements IPlayer {
  private transactions: ITransaction[] = [];
  id: string = '';
  name: string = '';
  color: string = '';
  cities: ICity[] = [];

  constructor(details?: Partial<IPlayer>) {
    if (details) {
      this.id = details.id || '';
      this.name = details.name || '';
      this.color = details.color || '';
      this.cities = details.cities || [];
    }
  }

  addTransaction(transaction: ITransaction) {
    this.transactions.push(transaction);
  }

  get money() {
    return this.transactions.reduce(
      (memo, transaction) => memo + transaction.amount,
      0
    );
  }
}
