export default function generateCode() {
  var numbers = '0123456789';
  var chars = 'acdefhiklmnoqrstuvwxyz';
  var string_length = 3;
  var randomstring = '';
  var randomstring2 = '';
  for (var x = 0; x < string_length; x++) {
    var letterOrNumber = Math.floor(Math.random() * 2);
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  for (var y = 0; y < string_length; y++) {
    var letterOrNumber2 = Math.floor(Math.random() * 2);
    var rnum2 = Math.floor(Math.random() * numbers.length);
    randomstring2 += numbers.substring(rnum2, rnum2 + 1);
  }
  return `${randomstring.toUpperCase()}${randomstring2}`;
}
