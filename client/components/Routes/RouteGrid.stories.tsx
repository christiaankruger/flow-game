import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { RouteGrid } from './RouteGrid';
import { IRoute } from '../../../flow-core/types';

const stories = storiesOf('Route Grid', module);

stories.add('Basic', () => {
  const routes: IRoute[] = [
    {
      from_city_name: 'Awesomcity',
      to_city_name: 'Megacity',
      expiring_in: 12,
      income: 32.21
    },
    {
      from_city_name: 'SuperCity',
      to_city_name: 'Uptown',
      expiring_in: 34,
      income: 12.21
    },
    {
      from_city_name: 'SuperCity',
      to_city_name: 'LegoCity',
      expiring_in: 12,
      income: 15.18
    },
    {
      from_city_name: 'Awesomcity',
      to_city_name: 'LegoCity',
      expiring_in: 19,
      income: 7.9
    },
    {
      from_city_name: 'Awesomcity',
      to_city_name: 'Downtown',
      expiring_in: 4,
      income: 29.1
    }
  ];
  return <RouteGrid routes={routes} />;
});
