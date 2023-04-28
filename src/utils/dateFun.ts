import {format} from 'date-fns';

export function formatDate(date: number | Date) {
  return format(date, 'yyyy-MM-dd');
}
