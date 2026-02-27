export enum Status {
  Default = 'default',
  InProgress = 'in-progress',
  Success = 'success',
  Warning = 'warning',
  Error = 'error'
}

export enum Type {
  Circle = 'circle',
  Dashboard = 'dashboard'
}

export interface ProgressProps {
  radius: number;
  stroke: number;
  progress: number;
  type: Type;
  status?: Status;
}
