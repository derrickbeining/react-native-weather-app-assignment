export default function createDateTimeString () {
  const dt = new Date();
  return `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()} at ${dt.getHours()}:${dt.getMinutes()}`
}