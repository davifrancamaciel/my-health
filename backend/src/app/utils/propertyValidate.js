export default function propertyValidate(value) {
  switch (value) {
    case 'null':
    case null:
    case 'undefined':
    case undefined:
    case 'null':
      return null;
    default:
      return value;
  }
}
