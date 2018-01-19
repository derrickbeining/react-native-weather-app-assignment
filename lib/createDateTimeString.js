



function formatMinute (num) {
  return num < 10
    ? `0${num}`
    : `${num}`;
}

function to12HourFormat (num) {
  return (num + 12) % 12 === 0
    ? 12
    : num % 12;
}

function amOrPm (num) {
  return num > 11
    ? 'PM'
    : 'AM';
}

function makeDate () {
  const dt = new Date();
  return {
    month: dt.getMonth() + 1,
    day: dt.getDate(),
    year: dt.getFullYear(),
    hours: to12HourFormat(dt.getHours()),
    minutes: formatMinute(dt.getMinutes()),
    amOrPm: amOrPm(dt.getHours())
  }
}

export default function createDateTimeString () {
  const dt = makeDate();
  return `${dt.month}/${dt.day}/${dt.year} at ${dt.hours}:${dt.minutes} ${dt.amOrPm}`
}
