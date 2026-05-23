export type IssueType = "bug" | "feature_request";

export interface ICreateIssue {
  title: string;
  description: string;
  type: IssueType;
}

export type IssueStatus = "open" | "in_progress" | "resolved";

export interface IReporter {
  id: number;
  name: string;
  role: string;
}

export interface IIssue extends ICreateIssue {
  id: number;
  status: IssueStatus;
  reporter_id: number;
  reporter?: IReporter;
  created_at: string;
  updated_at: string;
}