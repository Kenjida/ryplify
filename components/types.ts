

export interface TimeEntry {
  start: number;
  end: number;
  note: string;
}

export interface Project {
  id: string;
  name: string;
  totalSeconds: number;
  isActive: boolean;
  isFree: boolean;
  startTime: number | null;
  timeEntries: TimeEntry[];
}

