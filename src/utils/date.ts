import { format } from 'date-fns';
import enUS from 'date-fns/locale/en-US';

export function formatDate(date: Date | string) {
  return format(new Date(date), 'dd MMM yyyy', { locale: enUS });
}
