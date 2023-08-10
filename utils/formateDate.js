import { format } from 'date-fns';
const month = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
];

export const getMonth = queryDate => {
  const getYear = new Date(queryDate).getFullYear();
  const getMonth = month[new Date(queryDate).getMonth()];
  return ` ${getYear} yil ${getMonth}`;
};

export function formatDate(date) {
  return format(new Date(date), 'dd.MM.yyyy');
}

export function newFormatDate(date) {
  return format(new Date(date), 'yyyy-dd-MM');
}

export function parseDateWithTimezone(dateString) {
  const date = new Date(dateString);
  // Extract the timezone offset from the dateString (e.g., "+0500")
  const timezoneOffset = dateString.slice(-5);
  // Get the hours and minutes from the timezone offset string
  const hours = parseInt(timezoneOffset.slice(0, 3), 10);
  const minutes = parseInt(timezoneOffset.slice(3), 10);
  // Apply the timezone offset to the date
  date.setUTCHours(date.getUTCHours() - hours);
  date.setUTCMinutes(date.getUTCMinutes() - minutes);
  return date;
}
