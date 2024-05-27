import * as moment from 'moment';

/**
 * Calculate the expiration time based on the current time and a 5-second interval.
 *
 * @return {Date} The calculated expiration time
 */
export const getExpiry = (
  amount: number,
  unit: moment.unitOfTime.DurationConstructor,
): Date => {
  const createdAt = new Date();
  const expiresAt = moment(createdAt).add(amount, unit).toDate();

  return expiresAt;
};
