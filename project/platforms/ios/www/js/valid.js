// Function to serialize a Object
function serialize(obj, prefix) {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push(typeof v == "object" ?
                    serialize(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}

/**
 * VERIFY BIRTHDATE
 * @param  {[type]} birthdate [description]
 * @return {[type]}           [description]
 */
function verifyBirthdate (birthdate) {
    console.log(birthdate);

    if (!birthdate) {
        return false;
    }
    else {
        var arrayBirthdate = birthdate.split('/');
        var day = parseInt(arrayBirthdate[0]);
        var month = parseInt(arrayBirthdate[1]);
        var year = parseInt(arrayBirthdate[2]);

        birthdate = new Date(year, month, day);
        
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        today.setFullYear(today.getFullYear() - 3);

        if (birthdate.getTime() <= today.getTime()) {
            return true;
        }
        else {
            return false;
        }
    }
}

/**
 * CONVERT DATE TO API
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
function convertDateToAPI (date) {
    var day = null;
    var month = null;
    var year = null;
    var formatedDate = null;
    if (!date) {
        var now = new Date();
        
        day = now.getDate();
        if (day < 10) {
            day = '0' + day;
        }

        month = now.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }

        year = now.getFullYear();

        formatedDate = year + '-' + month + '-' + day;

        return formatedDate;
    }
    else {
        var arrayDate = date.split('/');
        
        day = parseInt(arrayDate[0]);
        if (day < 10) {
            day = '0' + day;
        }

        month = parseInt(arrayDate[1]);
        if (month < 10) {
            month = '0' + month;
        }

        year = parseInt(arrayDate[2]);

        formatedDate = year + '-' + month + '-' + day;

        return formatedDate;
    }
}

/**
 * CONVERT DATE TO INPUT
 * @return {[type]} [description]
 */
function convertDateToInput (dbDate) {
    var arrayDate = dbDate.split('-');

    return arrayDate[2] + '/' + arrayDate[1] + '/' + arrayDate[0];
}

/**
 * CONVERT DATE TO INPUT
 * @return {[type]} [description]
 */
function convertDateToSession (inputDate) {
    var arrayDate = dbDate.split('/');

    return arrayDate[2] + '-' + arrayDate[1] + '-' + arrayDate[0];
}

/**
 * GET OBJECT LENGTH
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function getObjectLength (obj) {
    var count = 0;
    for (var i in obj) {
        count++;
    }
    return count;
}

/**
 * NUMBER FORMAT
 * @param  {[type]} number       [description]
 * @param  {[type]} decimals     [description]
 * @param  {[type]} decPoint     [description]
 * @param  {[type]} thousandsSep [description]
 * @return {[type]}              [description]
 */
function number_format (number, decimals, decPoint, thousandsSep) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/number_format/
  // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: davook
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Theriault (https://github.com/Theriault)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Michael White (http://getsprink.com)
  // bugfixed by: Benjamin Lupton
  // bugfixed by: Allan Jensen (http://www.winternet.no)
  // bugfixed by: Howard Yeend
  // bugfixed by: Diogo Resende
  // bugfixed by: Rival
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  //  revised by: Luke Smith (http://lucassmith.name)
  //    input by: Kheang Hok Chin (http://www.distantia.ca/)
  //    input by: Jay Klehr
  //    input by: Amir Habibi (http://www.residence-mixte.com/)
  //    input by: Amirouche
  //   example 1: number_format(1234.56)
  //   returns 1: '1,235'
  //   example 2: number_format(1234.56, 2, ',', ' ')
  //   returns 2: '1 234,56'
  //   example 3: number_format(1234.5678, 2, '.', '')
  //   returns 3: '1234.57'
  //   example 4: number_format(67, 2, ',', '.')
  //   returns 4: '67,00'
  //   example 5: number_format(1000)
  //   returns 5: '1,000'
  //   example 6: number_format(67.311, 2)
  //   returns 6: '67.31'
  //   example 7: number_format(1000.55, 1)
  //   returns 7: '1,000.6'
  //   example 8: number_format(67000, 5, ',', '.')
  //   returns 8: '67.000,00000'
  //   example 9: number_format(0.9, 0)
  //   returns 9: '1'
  //  example 10: number_format('1.20', 2)
  //  returns 10: '1.20'
  //  example 11: number_format('1.20', 4)
  //  returns 11: '1.2000'
  //  example 12: number_format('1.2000', 3)
  //  returns 12: '1.200'
  //  example 13: number_format('1 000,50', 2, '.', ' ')
  //  returns 13: '100 050.00'
  //  example 14: number_format(1e-8, 8, '.', '')
  //  returns 14: '0.00000001'
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
  var n = !isFinite(+number) ? 0 : +number
  var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
  var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
  var s = ''
  var toFixedFix = function (n, prec) {
    var k = Math.pow(10, prec)
    return '' + (Math.round(n * k) / k)
      .toFixed(prec)
  }
  // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}