import { Status } from '@/types';

export const COLORS: Record<Status, string> = {
  [Status.Default]: '#9ca3af',
  [Status.InProgress]: '#3b82f6',
  [Status.Success]: '#10b981',
  [Status.Warning]: '#f59e0b',
  [Status.Error]: '#ef4444'
};
