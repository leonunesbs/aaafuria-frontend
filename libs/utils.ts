export function relativeTime(dateTime: any) {
  const delta = Math.round((+new Date() - dateTime) / 1000);

  const minute = 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7;

  if (delta < 30) {
    return 'agora há pouco';
  } else if (delta < minute) {
    return delta + ' há poucos segundos';
  } else if (delta < 2 * minute) {
    return 'há um minuto';
  } else if (delta < hour) {
    return 'há ' + Math.floor(delta / minute) + ' minutos';
  } else if (Math.floor(delta / hour) == 1) {
    return 'há 1 hora';
  } else if (delta < day) {
    return 'há ' + Math.floor(delta / hour) + ' horas';
  } else {
    return false;
  }
}
