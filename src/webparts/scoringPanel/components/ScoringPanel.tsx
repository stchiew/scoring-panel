import * as React from 'react';
import styles from './ScoringPanel.module.scss';
import { IScoringPanelProps } from './IScoringPanelProps';
import { IScoringPanelState } from './IScoringPanelState';
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Web } from '@pnp/sp';
import { IRating } from '../models/IRating';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';

export default class ScoringPanel extends React.Component<IScoringPanelProps, IScoringPanelState> {

  private _rate: IRating = { Rating: 0, Comments: '' };
  private _currentId: number = 0;

  public constructor(props: Readonly<IScoringPanelProps>) {
    super(props);
    this.state = { rating: 0, comments: '', notifications: [], status: "Empty" };

    this._getItem.bind(this);

  }
  public render(): React.ReactElement<IScoringPanelProps> {

    if (this.state.status == 'NoParam') {
      return (
        <div className={styles.scoringPanel}>
          <div className={styles.container}>
            <span>No Parameter provided</span>
          </div>
        </div >
      );
    } else if (this.state.status == 'Error') {
      return (
        <div className={styles.scoringPanel}>
          <div className={styles.container}>
            <div className={styles.row}>
              <span>Error occurred:</span>
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className={styles.scoringPanel}>
          <div className={styles.container}>
            {this.renderNotifications()}
            <span>Status : {this.state.status}</span>
            <div className={styles.row}>
              <Rating
                min={1}
                max={5}
                size={RatingSize.Large}
                rating={this.state.rating}
                onChange={this._onLargeStarChange}
                ariaLabelFormat={'{0} of {1} stars selected'}
              />
              <span>Current Rating : {this.state.rating}</span>
            </div>
            <div className={styles.row}>
              <TextField label="Comments"
                multiline rows={9}
                autoAdjustHeight={true}
                value={this.state.comments}
                onChange={this._onCommentsChange.bind(this)}
              />
            </div>
            <div className={styles.row}><PrimaryButton
              data-automation-id="test"
              disabled={false}
              text="Save This"
              iconProps={{ iconName: 'Save' }}
              allowDisabledFocus={true}
              onClick={this._updateItem.bind(this)}
            /></div>
          </div>
        </div >
      );
    }
  }

  private renderNotifications() {
    if (this.state.notifications.length === 0) {
      return null;
    }
    setTimeout(() => { this.setState({ ...this.state, notifications: [] }); }, 4000);
    return <div>
      {
        this.state.notifications.map((item, idx) =>
          <MessageBar messageBarType={MessageBarType.success}>{item}</MessageBar>
        )
      }
    </div>;
  }

  public componentDidMount() {
    if (this.state.status != "Loaded") {
      this._getItem(this.props.listname);
    }
  }

  private async _getItem(listname: string): Promise<void> {
    const web: Web = new Web(this.props.web.absoluteUrl);
    var queryParms = new UrlQueryParameterCollection(window.location.href);
    console.log("parm:" + queryParms.getValue("sub"));
    this._currentId = queryParms.getValue("sub") == undefined ? 0 : parseInt(queryParms.getValue("sub"));
    if (this._currentId != 0) {
      try {
        const _scorerating: IRating = await web.lists
          .getByTitle(listname)
          .items
          .getById(this._currentId)
          .select('Rating', 'Comments').get();
        this.setState({ rating: _scorerating.Rating, comments: _scorerating.Comments, notifications: ['Item Loaded Successfully'], status: 'Loaded' });
      }
      catch (error) {
        this.setState({ status: "Error" });
        console.log("From console:" + error.message);
      }
    } else {
      this.setState({ status: 'NoParam' });
    }
  }

  private _onLargeStarChange = (ev: React.FocusEvent<HTMLElement>, newrating: number): void => {
    this.setState({ rating: newrating });
  }

  private _onCommentsChange = (ev: React.FormEvent<HTMLInputElement>, newValue?: string) => {
    this.setState({ comments: newValue });
  }

  private _onRatingChange = (ev: React.FormEvent<HTMLInputElement>, newValue?: string) => {
    this.setState({ rating: parseInt(newValue) });
  }

  private async _updateItem(): Promise<void> {
    const web: Web = new Web(this.props.web.absoluteUrl);
    let response = await web.lists
      .getByTitle(this.props.listname)
      .items
      .getById(this._currentId)
      .update({ Rating: this.state.rating, Comments: this.state.comments });
    this.setState({ ...this.state, notifications: ['Your ratings saved successfully!'], status: "Updated" });
    //return response;

  }
}
