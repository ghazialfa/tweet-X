import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const timeUpload = (date) => {
  const toNumber = parseInt(date);

  if (!isNaN(toNumber) && toNumber.toString().length > 10) {
    const seconds = Math.floor(toNumber / 1000);
    return dayjs.unix(seconds).fromNow();
  } else {
    return dayjs(date).fromNow();
  }
};

export const formatHour = (date) => {
  const toNumber = parseInt(date);

  if (!isNaN(toNumber) && toNumber.toString().length > 10) {
    const seconds = Math.floor(toNumber / 1000);
    return dayjs.unix(seconds).format("HH:mm A");
  } else {
    return dayjs(date).format("hh:mm A");
  }
};

export const formatDate = (date) => {
  const toNumber = parseInt(date);

  if (!isNaN(toNumber) && toNumber.toString().length > 10) {
    const seconds = Math.floor(toNumber / 1000);
    return dayjs.unix(seconds).format("DD MMM YY");
  } else {
    return dayjs(date).format("DD MMM YY");
  }
};
