import * as React from 'react';
import styles from './ScoringPanel.module.scss';
import { IScoringPanelProps } from './IScoringPanelProps';
import { IScoringPanelState } from './IScoringPanelState';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Web } from '@pnp/sp';
import { IRating } from '../models/IRating';

export default class ScoringPanel extends React.Component<IScoringPanelProps, IScoringPanelState> {

  private _rate: IRating = { ScoringRatings: 0, ScoringComments: '' };

  public constructor(props: Readonly<IScoringPanelProps>) {
    super(props);
    this.state = { rating: this._rate, status: "Empty" };

    this._getItem.bind(this);
    this._updateItem.bind(this);
  }
  public render(): React.ReactElement<IScoringPanelProps> {
    return (
      <div className={styles.scoringPanel}>
        <div className={styles.container}>
          <span>Status : {this.state.status}</span>
          <div className={styles.row}>
            <TextField label="Ratings" value={this.state.rating.ScoringRatings.toString()} />
          </div>
          <div className={styles.row}>
            <TextField label="Comments" multiline rows={9} autoAdjustHeight={true} value={this.state.rating.ScoringComments} />
          </div>
          <div className={styles.row}><PrimaryButton
            data-automation-id="test"
            disabled={false}
            text="Save This"
            iconProps={{ iconName: 'Save' }}
            allowDisabledFocus={true}
            onClick={this._updateItem}
          /></div>
        </div>
      </div >
    );
  }
  public componentDidMount() {
    this._getItem();
  }
  private async _getItem(): Promise<void> {
    const web: Web = new Web(this.props.web.absoluteUrl);
    const rating: IRating = await web.lists.getByTitle('ScoringList').items.getById(1).select('ScoringRatings', 'ScoringComments').get();
    this.setState({ rating, status: 'Loaded' });
  }

  private _handleRatingChange(newValue: string) {
    this._rate = this.state.rating;
    this._rate.ScoringRatings = parseInt(newValue);
    this.setState({ rating: this._rate });
  }

  private async _updateItem(): Promise<any> {
    const web: Web = new Web(this.props.web.absoluteUrl);
    this._rate = this.state.rating;
    console.log(this._rate);
    //this.setState({ status: "Updated" });
    return await web.lists.getByTitle('ScoringList').items.getById(1).update(this._rate);

  }
}
