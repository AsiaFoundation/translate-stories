// window.applicationCache.swapCache();

var carr;

function translate_story(nav) {
  var story_table = $("#story_table");
  var messages = $("#messages");
  var translator = $("#translator");
  var translator_div = $("#translator_div");
  var idx_store = $("#idx");
  var serial_store = $("#serial");
  var nav_buttons = $("#nav_buttons");
  var next = $("#next");
  var previous = $("#prev");
  var translate_button = $("#translate_button");

  n = parseInt(serial_store.html());
  if (nav == "prev") {
    n = n-1;
  } else if (typeof nav == "number") {
    n = nav;
  }

  idx = json[n].i;
  title = json[n].t;
  attribution = json[n].a.replace(/^(.)\|(.*?)\|(.*)/, "* License: [CC-$1]\n* Text: $2\n* Illustration: $3\n* Language: English\n").replace(/,/g, ", ").replace(/CC\-b/, "CC-BY").replace(/CC\-n/, "CC-BY-NC");

  sections = json[n].s;

  messages
    .removeClass('translate')
    .html(_("Story ID:") + " #" + idx + " - <i>" + title + "</i> | " + _('Language:') +  " <select id='language'><option>Spanish</option></select>");
  var language = $("#language");
  language.on("input", function() {
    localStorage['gtr_l'] = language.val();
    check_lang();
  });
  if (localStorage["gtr_l"]) {
    language.html(localStorage["gtr_l"]);
  }
  if (localStorage["gtr_a"]) {
    translator.html(localStorage["gtr_a"]);
  }
  translator_div.css({ display: '' });
  translate_button.css({ display: 'none' });
  nav_buttons.css({ display: 'inline-block' });

  next_story = parseInt(n) + 1;
  prev_story = parseInt(n) - 1;

  if ($(next)[0] && $(prev)[0]) {
    $(next)[0].onclick = function() {
      translate_story(next_story);
    };
    $(prev)[0].onclick = function() {
      translate_story(prev_story);
    };
  }

  check_lang();


  storytable = $("<div>");
  $("#story_table").html("").append(storytable);
  $("#previouser, #nexter").off("click");

  var cover = $("<div>").addClass("item");
  cover.append($("<div class='img-holder'>").append(
    $('<img/>')
      .attr('src', "//raw.githubusercontent.com/global-asp/asp-imagebank/master/medium/" + idx + "/01.jpg")
    )
  );
  cover.append(
    $('<label>').text(_('Title:') + ' ' + title)
  );
  cover.append($('<br/>'));
  cover.append(
    $('<input id="title_text" class="form-control"/>')
      .attr('placeholder', _('Your translation'))
  );
  storytable.append(cover);

  var page_offset = 2;

  for (var i = 0; i < sections.length; i++) {
    page_number = i + page_offset;
    if (page_number < 10) {
      page_number = "0" + page_number;
    }

    var sentences = json[n].s[i][page_number].split(/[\.\?]”?\s/g);

    for (var s = 0; s < sentences.length; s++) {
      var pageText = sentences[s];
      var page = $("<div>").addClass("item");
      page.append($("<div class='img-holder'>").append(
        $("<img>")
          .attr("src", "//raw.githubusercontent.com/global-asp/asp-imagebank/master/medium/" + idx + "/" + page_number + ".jpg")
        )
      );
      page.append($("<span id='story_src_" + i + "_" + s + "'>").text(pageText));
      page.append(
        $("<div class='form-group'></div>").append(
          $("<textarea id='story_tgt_" + i + "_" + s + "' class='story_tgt' class='form-control'></textarea>")
            .attr('placeholder', _('Your translation'))
        )
      );
      storytable.append(page);
    }
  }
  storytable.append(
    $("<div class='item'></div>").css({ textAlign: 'center' }).append(
      $('<button class="done">').text(_('Review submission')).click(review_translation)
    )
  );

  translang = "Translation: " + translator.html() + "<br>* Language: " + language.html();

  carr = storytable.owlCarousel({
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


  nav_buttons.css({ display: '' });
  idx_store.html(idx);
  serial_store.html(n);
  $("#number_of_sections").html(sections.length);
  get_storage(idx);
  tr_title.focus();

  if (typeof window.location.hash !== 'undefined') {
    window.location.hash = '' + idx;
  }
}

function get_storage(idx) {
  number_of_sections = parseInt($("#number_of_sections").html());

  // update local storage as soon as user changes title field
  tr_title = $("#title_text");
  tr_title.on("input", function() {
    localStorage['gtr_' + idx + '_title'] = tr_title.val();
  });
  if (localStorage["gtr_" + idx + "_title"]) {
    tr_title.val(localStorage["gtr_" + idx + "_title"]);
  }

  // update local storage as soon as user changes any text field
  $(".story_tgt").on("input", function(e) {
    var id = $(e.currentTarget).attr('id').split('_').slice(2).join('_');
    var pageCode = 'gtr_' + idx + '_s_' + (id.split('_')[0]);
    var section = id.split('_')[1];
    if (!localStorage[pageCode]) {
      localStorage[pageCode] = '[]';
    }
    var pageRecord = JSON.parse(localStorage[pageCode]);
    pageRecord[section] = $(e.currentTarget).val();
    localStorage[pageCode] = JSON.stringify(pageRecord);
  });

  for (var i = 0; i < number_of_sections; i++) {
    // store each page in localStorage as an array of sentences
    var pageCode = "gtr_" + idx + "_s_" + i;
    if (!localStorage[pageCode]) {
      localStorage[pageCode] = '[]';
    }
    var pageRecord = JSON.parse(localStorage[pageCode]);
    for (var s = 0; s < pageRecord.length; s++) {
      $("#story_tgt_" + i + "_" + s).val(pageRecord[s]);
    }
  }

  // store user e-mail in localStorage
  if (localStorage["gtr_email"]) {
    $("#email").val(localStorage["gtr_email"]);
  }
}

function review_translation() {
  tr_title = $("#title_text").val();
  attribution = $("#attribution").html();
  number_of_sections = parseInt($("#number_of_sections").html());
  var translator = $("#translator");
  var language = $("#language");
  translation_output = $("#translation_output");
  var container = $("#container");

  // initialize table header
  var content_div = $("<table>").attr("id", "content_table");
  content_div.html('');
  var header = $("<tr>")
    .append(
      $("<th style='width:25%'>")
    )
    .append(
      $("<th style='width:65%'>").text(_('your translation'))
    );
  content_div.append(header);

  // title row
  var titleRow = $("<tr>")
    .append(
      $("<td>").append(
        $("<img class='revthumb'/>").attr("src", "//raw.githubusercontent.com/global-asp/asp-imagebank/master/medium/" + idx + "/01.jpg")
      )
    )
    .append(
      $("<td>").append(
        $("<em>").text(tr_title)
      )
    );
  content_div.append(titleRow);
  format_content = [tr_title];

  // add a row for each page, including all sentences
  for (var i = 0; i < number_of_sections; i++) {
    page_number = i + 2;
    if (page_number < 10) {
      page_number = "0" + page_number;
    }

    // this reconnects all sentences to their one page
    var storySentences = $.map($(".owl-item [id^=story_tgt_" + i + "_]"), function(page) {
      return $(page).val()
    });
    storySentences = storySentences.join("|||");

    format_content.push(storySentences.replace(/\|\|\|/g, "\n"));

    var pageRow = $("<tr>")
      .append(
        $("<td>").append(
          $("<img class='revthumb'/>").attr('src', $('#story_img_' + i).attr('src'))
        )
      )
      .append(
        $("<td class='t'>").text(storySentences)
      );

    // escape user's translations for HTML, except for <br/>
    pageRow.find('td.t').html( pageRow.find('td.t').html().replace(/\|\|\|/g, "<br/>") );
    content_div.append(pageRow);
  }

  translang = "Translation: " + translator.html() + "\n* Language: " + language.html();
  format_content.push(attribution.replace(/<br>/g, "\n").replace(/Language: .*/, translang));
  translation_output.val(JSON.stringify(format_content));
  $("#submit_form").css({ display: '' });

  var review_table = $("#review_table");
  review_table.append(content_div);

  prepare_submission();

  $('#modal-review').modal('show');
}

function story_api() {
  var geturl = location.href;
  if (/[#\?]\d/.test(geturl) == true) {
    var args = /[#\?](\d+)/.exec(geturl)[1];
    serial = 0;
    for (var n = 0; n < json.length; n++) {
      if (json[n].i == args) {
        serial = n;
        break
      }
    }
    translate_story(serial);
  }
}

function random_story() {
  rand = Math.floor(Math.random()*json.length);
  translate_story(rand);
}

function prepare_submission() {
  var sub = $("#subject_line");
  var rev = $("#review_sub");
  sub.val('New translation: #' + idx + ', "' + $("#messages i").text() + '" into ' + $("#language").val() + " by " + $("#translator").val());
  $("#name_line").val($('#translator').val());
  $("#story_number").val(idx);
  $("#md_title").val($("#messages i").text());
  $("#story_translation").val($('#translation_output').val());
  rev.css({ width: "80%" });
  rev.removeClass("tooltip");
  $("#rev_msg").html("If you are satisfied with your translation, press the submit button below to send it for inclusion:");
}

function check_lang() {
  var language = $("#language");
  localStorage["gtr_l"]=language.html().replace(/\n|<br>/g, "");
  language.css({ "background-color": "#fff" });
  var iso = "";
  var full_name = "";
  var msg_bar = $("#translated_msg");
  msg_bar.css({ display: 'none' });
  for (var i = 0; i < names.length; i++) {
    for (var n = 0; n < names[i].l.length; n++) {
      if (language.html().toLowerCase() == names[i].l[n].toLowerCase()) {
        iso = names[i].l[0];
        full_name = names[i].l[1];
        break;
      }
    }
    if (iso != "") {
      for (var i = 0; i < gasp.length; i++) {
        if (gasp[i][iso]) {
          idx_array = gasp[i][iso].split(",");
          var foundTranslation = false;
          for (var n = 0; n < idx_array.length; n++) {
            if (idx_array[n] == idx) {
              language.css({ "background-color": "#FF8C8E" });
              tr_msg = "This story (#" + idx + ") has already been translated into " + full_name;
              msg_format = "<span style=\"background-color:#FFFFC2;margin-right:12px;\">" + tr_msg + "</span>";
              //nx_msg = "Skip translated stories";
              //msg_format += "<a href='#' onclick='skip_translated()'>" + nx_msg + "</a>";
              msg_bar.html(msg_format);
              msg_bar.css({ display: '' });
              return;
            }
          }
          return;
        }
      }
    }
  }
}
