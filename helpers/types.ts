export type SQLResponse = {
  error: string;
  text: string;
  sql: string;
};

export type RUNResponse = {
  id(id: any): unknown;
  df: string;
  type: string;
};

export type TMessage = {
  ai: string;
  user: string;
  messageId: string;
  type: string;
};

export type TQuestions = {
  header: string;
  questions: Array<string>;
  type: string;
};

export type PlotlyResponse = {
  id(id: any): unknown;
  fig: any;
  df: string;
  type: string;
};
