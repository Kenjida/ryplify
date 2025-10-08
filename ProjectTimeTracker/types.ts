
export interface TimeEntry {
  start: number;
  end: number;
}

export interface Project {
  id: string;
  name: string;
  totalSeconds: number;
  isActive: boolean;
  startTime: number | null;
  timeEntries: TimeEntry[];
}
