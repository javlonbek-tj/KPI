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
  return format(new Date(date), 'MM.dd.yyyy');
}
