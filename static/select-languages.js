/*
  use the jQuery select2 plugin to make an autocomplete language select
  placeholder is just to prompt user
  set the actual language options in knownlanguages.js
*/

$(function() {
  $('.languagelist').select2();
  $('.select2-search input')
    .attr('placeholder', 'English, Thai, Karen, etc')
    .css('width', '100%');
});
