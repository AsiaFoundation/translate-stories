var polyglot = new Polyglot({
  phrases: {
    'to get started, press the translate! button below.': 'ในการเริ่มต้นกด -แปล!- ปุ่ม',
    'translated by:': 'ผู้แปล:',
    'translate!': 'แปล!',
    'title:': 'หัวข้อ:',
    'language:': 'ภาษา:',
    previous: 'ก่อน',
    'random story': 'เรื่องแบบสุ่ม',
    next: 'ก่อน',
    'story id:': 'ID เรื่อง:',
    'review': 'ตรวจสอบการทำงานของคุณ',
    'review submission': 'ตรวจสอบการทำงานของคุณ',
    'your name': 'ชื่อของคุณ',
    'your email': 'อีเมลของคุณ',
    'send translation': 'ส่งการแปล',
    'your translation': 'การแปลของคุณ',
    'loading epub': 'โหลด ePUB'
  }
});

var _ = function (word, vars) {
  if (window.location.href.indexOf('thai') > -1) {
    return polyglot.t(word.toLowerCase(), vars);
  } else {
    return word;
  }
};

$(function() {
  if (window.location.href.indexOf('thai') > -1) {
    $(".translate").each(function(i, item) {
      if ($(item).text()) {
        $(item).text(_($(item).text().toLowerCase()));
      }
      if ($(item).attr('title')) {
        $(item).attr('title', _( $(item).attr('title')));
      }
      if ($(item).attr('placeholder')) {
        $(item).attr('placeholder', _( $(item).attr('placeholder')));
      }
    });
  }
});
