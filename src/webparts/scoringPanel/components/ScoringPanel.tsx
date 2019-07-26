import * as React from 'react';
import styles from './ScoringPanel.module.scss';
import { IScoringPanelProps } from './IScoringPanelProps';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { HighContrastSelectorWhite } from '@uifabric/styling';

export default class ScoringPanel extends React.Component<IScoringPanelProps, {}> {
  public render(): React.ReactElement<IScoringPanelProps> {
    return (
      <div className={styles.scoringPanel}>
        <div className={styles.container}>
          <div className="ms-fontSize-24">
            <Stack horizontal>
              <TextField label="Rating" styles={{ fieldGroup: { width: 100, color: HighContrastSelectorWhite } }} />
              <Rating
                label="Rating"
                min={1}
                max={5}
                size={RatingSize.Large}
                rating={3}
                getAriaLabel={this._getRatingComponentAriaLabel}
                ariaLabelFormat={'{0} of {1} stars selected'} /></Stack>
          </div>
          <div className={styles.row}> <TextField label="Comments" multiline rows={9} autoAdjustHeight={true} /></div>
          <div className={styles.row}><PrimaryButton
            data-automation-id="test"
            disabled={false}
            text="Save"
            iconProps={{ iconName: 'Save' }}
            allowDisabledFocus={true}
          /></div>
        </div>
      </div >
    );
  }

  private _getRatingComponentAriaLabel(rating: number, maxRating: number): string {
    return `Rating value is ${rating} of ${maxRating}`;
  }
}
