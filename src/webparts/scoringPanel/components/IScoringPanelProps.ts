import { PageContext } from "@microsoft/sp-page-context";

export interface IScoringPanelProps {
  description: string;
  web: PageContext["web"];
  listname: string;
}
