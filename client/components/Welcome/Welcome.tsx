import React, { Component, RefObject } from 'react';
import { createBemHelper } from '../../util/BEM';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Input, Button, Icon } from 'semantic-ui-react';
import './Welcome.scss';

const BEM = createBemHelper('welcome');

export interface IWelcomeScreenProps {
  onJoin: (value: string) => void;
}

@observer
export class WelcomeScreen extends Component<IWelcomeScreenProps> {
  @observable
  name?: string;

  render() {
    return (
      <div className={BEM()}>
        <div className={BEM('container')}>
          <div className={BEM('heading')}>Flow</div>
          <div className={BEM('input')}>
            <label>Name</label>
            <Input
              fluid={true}
              placeholder={'e.g. McFlowyFace'}
              onChange={this.onInputChange}
            />
          </div>
          <div className={BEM('button-container')}>
            <Button primary={true} onClick={this.onClick}>
              Join
            </Button>
          </div>
        </div>
      </div>
    );
  }

  @action
  private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.name = event.target.value;
  };

  private onClick = () => {
    this.props.onJoin(this.name!);
  };
}
