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
