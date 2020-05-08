import { observable, action, runInAction, computed } from 'mobx';
import { IRoute, ITransaction, ICity } from '../../flow-core/types';
import { TICK_DURATION } from '../../common/constants';
import { range } from 'ramda';
import { sequentially, Stream } from 'kefir';

export class GameStore {
  @observable
  playerId: string = '';

  @observable
  routes: IRoute[] = [];

  @observable
  transactions: ITransaction[] = [];

  @observable
  cities: ICity[] = [];

  @observable
  currentTickId: string = '';

  @observable
  timerValue: number = 0;

  @observable
  actionThisTick: boolean = false;

  interval?: NodeJS.Timeout;

  @action
  resetTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.actionThisTick = false;
    this.timerValue = TICK_DURATION;
    this.interval = setInterval(() => {
      runInAction(() => {
        this.timerValue--;
      });
      if (this.timerValue === 0) {
        clearInterval(this.interval!);
      }
    }, 1000);
  }

  @action
  setCurrentTickId(id: string) {
    this.currentTickId = id;
  }

  @action
  actionPerformedThisTick() {
    this.actionThisTick = true;
  }

  @computed get canPerformAction() {
    return this.actionThisTick === false;
  }

  @computed get money() {
    return this.transactions.reduce((memo, t) => memo + t.amount, 0);
  }

  @action
  setRoutes(routes: IRoute[]) {
    this.routes = routes;
  }

  @action
  setCities(cities: ICity[]) {
    this.cities = cities;
  }

  @action
  setTransactions(transactions: ITransaction[]) {
    this.transactions = transactions;
  }

  cityByName(name: string) {
    return this.cities.find(c => c.name === name)!;
  }
}
