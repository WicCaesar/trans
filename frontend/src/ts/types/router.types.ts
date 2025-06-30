export interface RouterParams {
  [key: string]: string;
}

export interface Route {
  path: string;
  component: () => Promise<string> | string;
  init?: () => void;
} 