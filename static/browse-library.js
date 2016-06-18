$(function() {
  // language filter
  $('.language-select').change(function() {
    var books = $('.library.row .col-md-3');
    var pickLanguage = $('.language-select').val();
    if (pickLanguage === '') {
      // all selected
      books.css('opacity', 1);
      return;
    }
    for (var b = 0; b < books.length; b++) {
      var languages = $(books[b]).find('.badge');
      var foundLanguage = false;
      for (var l = 0; l < languages.length; l++) {
        if ($(languages[l]).text() === pickLanguage) {
          $(books[b]).css('opacity', 1);
          foundLanguage = true;
          break;
        }
      }
      if (!foundLanguage) {
        $(books[b]).css('opacity', 0.5);
      }
    }
  });

  // book title search
  $('.searchable button, .searchable input').on('click input', function() {
    var q = $('.searchable input').val().toLowerCase().replace(/\s+/g, '');
    var books = $('.library.row .col-md-3');
    if (!q) {
      books.css('opacity', 1);
      return;
    }
    for (var b = 0; b < books.length; b++) {
      var text = $(books[b]).text().toLowerCase().replace(/\s+/g, '');
      if (text.indexOf(q) > -1) {
        $(books[b]).css('opacity', 1);
      } else {
        $(books[b]).css('opacity', 0.5);
      }
    }
  });
});
