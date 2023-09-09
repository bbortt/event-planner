import dayjs from 'dayjs/esm';

export const isDateInProjectRange = (date: dayjs.Dayjs, startOfProject: dayjs.Dayjs, endOfProject: dayjs.Dayjs): boolean =>
  (date.isSame(startOfProject) || date.isAfter(startOfProject)) && (date.isSame(endOfProject) || date.isBefore(endOfProject));
