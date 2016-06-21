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
      if (!$(books[b]).find('.badge.' + pickLanguage).length) {
        $(books[b]).css('opacity', 0.5);
      } else {
        $(books[b]).css('opacity', 1);
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
