/*
  list of language names for each language
  the database stores a language by its code (English -> en)
  then in English it displays "English"
  in Thai it displays "ภาษาไทย"
*/

const keys = {
  en: {
    en: 'English',
    th: 'Thai',
    karen: 'Karen',
    kh: 'Khmer'
  },
  th: {
    en: 'อังกฤษ',
    th: 'ภาษาไทย',
    karen: 'ภาษากะเหรี่ยง',
    kh: 'ภาษาเขมร'
  }
};

// base language selection on user profile or on HTTP request headers
function names(user_or_req) {
  if (user_or_req) {
    if (user_or_req.preferredLanguage) {
      // user object
      return keys[user_or_req.preferredLanguage];
    } else {
      // request object
      var language = user_or_req.query.language || user_or_req.cookies.language || (user_or_req.headers['accept-language'] || 'en').split(",")[0].split('-')[0].split('_')[0];
      return keys[language];
    }
  } else {
    return keys['en'];
  }
}

module.exports = {
  keys: keys,
  names: names
};
