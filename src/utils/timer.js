export const msToTime = (duration) => {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}


export const secToTime = (d) => {
  d = Number(d);
  var hours = Math.floor(d / 3600);
  var minutes = Math.floor(d % 3600 / 60);
  var seconds = Math.floor(d % 3600 % 60);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;

  // var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  // var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  // return hDisplay + mDisplay + sDisplay;
}


export const diffTime = (end, start) => {
  var diffMs = (end.getTime() - start.getTime()) //? milliseconds between now & Christmas
  // var diffMs = (new Date() - start) //? milliseconds between now & Christmas

  var diffDays = Math.floor(diffMs / 86400000) //? days
  var diffHrs = Math.floor((diffMs % 86400000) / 3600000) //? hours
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000) //? minutes
  var diffSecs = Math.round(((diffMs % 86400000) % 3600000 % 60000) / 1000) //? seconds

  var str = ''
  if (diffDays > 0) str += diffDays + ' days, '
  if (diffHrs > 0) str += diffHrs + 'h'
  if (diffMins > 0) str += diffDays + 'm'
  if (diffSecs > 0) str += diffSecs + 's'

  return str
}