Date.prototype.addDays = function(days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export default function addDays(days) {
  const date = new Date();

  return date.addDays(Number(days));
}
