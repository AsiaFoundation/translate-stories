var wholepages;
var booktitle = '';
var readium = undefined;
var $$, pkg;

if (typeof target === 'undefined') {
  target = 'EPUB';
}

require(["readium_shared_js/globalsSetup"], function () {
  require(['readium_js/Readium'], function (Readium) {
    var altBook = false;
    var readiumOptions = {
      jsLibRoot: "../build-output/",
      cacheSizeEvictThreshold: undefined,
      useSimpleLoader: false, // false so we can load ZIP'ed EPUBs
      openBookOptions: {}
    };
    Readium.getVersion(function(version){
      window.navigator.epubReadingSystem.name = "readium-js test example demo";
      window.navigator.epubReadingSystem.version = version.readiumJs.version;
      window.navigator.epubReadingSystem.readium = {};
      window.navigator.epubReadingSystem.readium.buildInfo = {};
      window.navigator.epubReadingSystem.readium.buildInfo.dateTime = version.readiumJs.timestamp;
      window.navigator.epubReadingSystem.readium.buildInfo.version = version.readiumJs.version;
      window.navigator.epubReadingSystem.readium.buildInfo.chromeVersion = version.readiumJs.chromeVersion;

      var origin = window.location.origin;
      if (!origin) {
          origin = window.location.protocol + '//' + window.location.host;
      }
      var prefix = (self.location && self.location.pathname && origin) ? (origin + self.location.pathname + "/..") : "";

      var readerOptions = {
        needsFixedLayoutScalerWorkAround: false,
        el: "#viewport"
      };

      $$ = $;

      $(function () {
        wholepages = [];
        readium = new Readium(readiumOptions, readerOptions);

        var openPageRequest = undefined; //{idref: bookmark.idref, elementCfi: bookmark.contentCFI};

        var ebookURL = "/" + targetEPUB;

        readium.openPackageDocument(ebookURL, function(packageDocument, options) {
          // pkg = packageDocument;
          booktitle = options.metadata.title;
          var maxPages = packageDocument.spineLength();
          if (maxPages === 1) {
            // one-page format - needs special consideration
            var allContentURL = '/' + targetEPUB + '/OEBPS/' + packageDocument.getSpineItem(0).href;
            $.get(allContentURL, function (content) {
              var segments = $(content).find('img, p');
              for (var s = 0; s < segments.length; s++) {
                if (segments[s].tagName.toUpperCase() === 'IMG') {
                  wholepages.push(['', '/../../OEBPS/' + $(segments[s]).attr('src')]);
                } else {
                  if (!wholepages.length) {
                    wholepages.push(['', '']);
                  }
                  wholepages[wholepages.length - 1][0] += segments[s].outerHTML;
                }
              }
              setStory();
            });
          } else {
            // multiple-page format
            $("#messages").text("Loaded 0 / " + maxPages);
            var lastPages = [0, new Date()];
            var loadpages = setInterval(function() {
              readium.reader.openPageRight();
              $("#messages").text("Loaded " + wholepages.length + " / " + maxPages);
              if (wholepages.length >= maxPages) {
                clearInterval(loadpages);
                setStory();
              } else {
                // update time of last new page added
                if (wholepages.length > lastPages[0]) {
                  lastPages = [wholepages.length, new Date()];
                }
                // if it's been too long since I added a page, I probably did reach the end
                // skip to translation phase
                if ((new Date() - lastPages[1]) > 2000) {
                  clearInterval(loadpages);
                  setStory();
                }
              }
            }, 150);
          }
        }, openPageRequest);
      });
    });
  });
});

function setStory(nav) {
  $("#viewport").addClass("hide");
  var story_table = $("#story_table");
  var messages = $("#messages");
  var translator = $("#translator");
  var translator_div = $("#translator_div");
  var idx_store = $("#idx");
  var serial_store = $("#serial");
  var nav_buttons = $("#nav_buttons");
  var translate_button = $("#translate_button");

  idx = -1;
  title = booktitle;
  attribution = '';
  sections = wholepages;

  messages.html("Now translating story #" + idx + " - <i>" + title + "</i> into: <select id='language'><option>Spanish</option></select>");
  var language = $("#language");
  language.on("input", function() {
    localStorage['gtr_l'] = language.val();
  });
  translator_div.css({ display: '' });
  translate_button.css({ display: 'none' });
  nav_buttons.css({ display: 'inline-block' });

  story_table = $("#story_table").html("");

  var cover = $("<div>").addClass("item");
  cover.append($("<div class='img-holder'>").append(
    $('<img/>')
      .attr('src', "/" + targetEPUB + "/OPS/" + wholepages[0][1])
    )
  );
  cover.append(
    $('<label>').text('Title: ' + booktitle)
  );
  cover.append($('<br/>'));
  cover.append(
    $('<input id="title_text" class="form-control" placeholder="Your translation"/>')
  );

  // add title comments
  function cmform(pgnum) {
    return $('<div class="form">').append(
      $('<div class="form-group">')
        .append($('<input name="page" class="page" type="hidden"/>').val(pgnum))
        .append($('<textarea class="form-control" name="text" placeholder="Make a comment"></textarea>'))
        .append($('<button class="btn btn-primary">').text('Post')
      )
    );
  }
  function addComment (comment) {
    return $('<div>')
      .text(comment.text)
      .append($('<div>').text('Comment by ' + comment.user_name));
  }
  var commentCursor = 0;
  /*
  cover.append(cmform(0));
  for (commentCursor; commentCursor < comments.length; commentCursor++) {
    if (comments[commentCursor].page > 0) {
      break;
    } else if (comments[commentCursor].page === 0) {
      cover.append(addComment(comments[commentCursor]));
    }
  }
  */

  story_table.append(cover);

  for (var i = 1; i < sections.length; i++) {
    var page = $("<div>").addClass("item");
    page.append($("<div class='img-holder'>").append(
      $("<img>")
        .attr("src", "/" + targetEPUB + "/OPS/" + sections[i][1])
      )
    );
    page.append($("<div class='form-group translatetext'>").append(
      $("<span id='story_src_" + i + "'>").html(sections[i][0])
    ).append(
      $("<textarea id='story_tgt_" + i + "' class='form-control' placeholder='Your translation'>")
    ));

    // add page comments
    var commentSection = $('<div class="comment">')
      .append(cmform(i));
    var commentList = $('<div class="list">');
    var commentCount = 0;
    for (commentCursor; commentCursor < comments.length; commentCursor++) {
      if (comments[commentCursor].page > i) {
        break;
      } else if (comments[commentCursor].page === i) {
        commentList.append(addComment(comments[commentCursor]));
        commentCount++;
      }
    }
    var commentNote = $('<button class="comment-note">').text(commentCount).click(function(e) {
      $(e.currentTarget)
        .hide()
        .parents('.item').find('.comment').show();
    });
    page.append(commentNote);
    commentSection.append(commentList);
    page.append(commentSection);

    story_table.append(page);
  }
  story_table.append(
    $("<div class='item'></div>").css({ textAlign: 'center' }).append(
      $('<button class="done">').text('Review submission').click(review_translation)
    )
  );

  // submit comments using an AJAX post
  $('.comment .form button').click(function(e) {
    var frm = $(e.currentTarget).parents('div.form');
    var txt = frm.find('textarea').val();
    $.post('/api/comment', {
      _csrf: csrf,
      book_id: book_id,
      page: frm.find('.page').val(),
      text: txt
    }, function (data) {
      var list = frm.parent().find('.list');
      list.prepend(addComment({
        user_name: userName,
        text: txt
      }));
      console.log(data);
    });
  });

  translang = "Translation: " + translator.html() + "<br>* Language: " + language.html();

  carr = story_table.owlCarousel({
    items: 1,
    maxItems: 1,
    center: true,
    margin: 20,
    nav: false,
    loop: false
  });

  $("#previouser").click(function() {
    carr.trigger('prev.owl.carousel');
  });

  $("#nexter").click(function () {
    carr.trigger('next.owl.carousel');
  });

  $("#attribution").html(attribution.replace(/\*/g, '<br/>*'));

  idx_store.html(idx);
  $("#number_of_sections").html(sections.length);
}
