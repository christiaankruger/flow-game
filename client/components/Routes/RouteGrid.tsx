import React, { Component } from 'react';
import { createBemHelper } from '../../util/BEM';
import { IRoute } from '../../../flow-core/types';

import './RouteGrid.scss';
import repeat from 'ramda/es/repeat';
import { observer } from 'mobx-react';
const BEM = createBemHelper('route-grid');

export interface IRouteGridProps {
  routes: IRoute[];
  columns?: number;

  onCityNameClick: (cityName: string) => void;
}

@observer
export class RouteGrid extends Component<IRouteGridProps> {
  render() {
    const { routes, columns = 3 } = this.props;
    return (
      <div
        className={BEM()}
        style={{
          gridTemplateColumns: `${repeat('1fr', columns).join(' ')}`
        }}
      >
        {routes.map(route => {
          return this.route(route);
        })}
      </div>
    );
  }

  private clickOnCity(name: string) {
    return () => {
      this.props.onCityNameClick(name);
    };
  }

  private route(route: IRoute) {
    return (
      <div className={BEM('route-card')}>
        <span className={BEM('route-card-directions')}>
          <span>
            <span
              className={BEM('route-city-name')}
              onClick={this.clickOnCity(route.from_city_name)}
            >
              {route.from_city_name}
            </span>{' '}
            to{' '}
            <span
              className={BEM('route-city-name')}
              onClick={this.clickOnCity(route.to_city_name)}
            >
              {route.to_city_name}
            </span>
          </span>
          <span className={BEM('route-card-remaining')}>
            {route.expiring_in} remaining
          </span>
        </span>
        <span
          style={{
            fontWeight: 600
          }}
        >
          {formatter.format(route.income)}
        </span>
      </div>
    );
  }
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});
