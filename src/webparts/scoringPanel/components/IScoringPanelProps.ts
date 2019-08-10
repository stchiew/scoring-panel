import { PageContext } from "@microsoft/sp-page-context";

export interface IScoringPanelProps {
  listname: string;
  web: PageContext["web"];
}
