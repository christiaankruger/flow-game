import React, { Component, RefObject } from 'react';
import { createBemHelper } from '../../util/BEM';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Input, Button, Icon } from 'semantic-ui-react';
import './Waiting.scss';

const BEM = createBemHelper('waiting');

export interface IWaitingScreenProps {}

@observer
export class WaitingScreen extends Component<IWaitingScreenProps> {
  render() {
    return (
      <div className={BEM()}>
        <div className={BEM('container')}>
          <div className={BEM('heading')}>Waiting</div>
        </div>
      </div>
    );
  }
}
