import format from "date-fns/format";

export const truncateAddress = (address, first = 5, last = 5) => (address ? `${address.slice(0, first)}...${address.slice(-last, address.length)}` : null);

export const truncateBalance = (balance, first = 8) => (balance ? `${balance.slice(0, first)}...` : null);

export const isValidDate = (timestamp) => new Date(timestamp).getTime() > 0;

export const formatTxTimestamp = (timestamp) => format(timestamp, "MMM d, yy | HH:mm");

export const formattedDuration = (duration, delimiter = " ", firstTwo = false) => {
  const formatted = [];
  if (duration.years) {
    formatted.push(`${duration.years}y`);
  }
  if (duration.months) {
    formatted.push(`${duration.months}mo`);
  }
  if (duration.days) {
    formatted.push(`${duration.days}d`);
  }
  if (duration.hours) {
    formatted.push(`${duration.hours}h`);
  }
  if (duration.minutes) {
    formatted.push(`${duration.minutes}m`);
  }
  if (duration.seconds != null) {
    formatted.push(`${duration.seconds}s`);
  }
  return (firstTwo ? formatted.slice(0, 2) : formatted).join(delimiter);
};

export const formatShortDate = (date) => format(date, "MMM dd, yyyy");

export const formatShortDateWithTime = (date) => format(date, "MMM d, yyyy H:mma");
