export function validateUrlCode(urlCode) {
  let urlCodeRegEx = /^[a-zA-Z0-9_-]{4,20}$/;

  return urlCodeRegEx.test(urlCode);
}

export function validateUrl(url) {
  let urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

  return urlRegEx.test(url);
}