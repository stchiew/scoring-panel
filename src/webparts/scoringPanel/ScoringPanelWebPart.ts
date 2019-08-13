import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneLabel
} from '@microsoft/sp-property-pane';

import * as strings from 'ScoringPanelWebPartStrings';
import ScoringPanel from './components/ScoringPanel';
import { IScoringPanelProps } from './components/IScoringPanelProps';
import { sp, Web } from '@pnp/sp';

export interface IScoringPanelWebPartProps {
  listname: string;
  //web: Web;
  //listname: string;
}

export default class ScoringPanelWebPart extends BaseClientSideWebPart<IScoringPanelWebPartProps> {

  public async onInit(): Promise<void> {
    const _ = await super.onInit();
    // other init code may be present

    sp.setup({
      spfxContext: this.context
    });
  }

  public render(): void {
    const element: React.ReactElement<IScoringPanelProps> = React.createElement(
      ScoringPanel,
      {
        listname: this.properties.listname,
        web: this.context.pageContext.web,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('listname', {
                  label: strings.ListnameFieldLabel
                })
              ]
            },
            {
              groupName: "Version",
              groupFields: [PropertyPaneLabel('version', {
                text: this.manifest.version.toString()
              })

              ]
            }
          ]
        }
      ]
    };
  }
}
