// window.applicationCache.swapCache();

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

  content_div = "      <table id=\"content_table\">\n        <tr><th style='width:5%'></th><th style='width:30%'>original asp story</th><th style='width:65%'>your translation</th></tr><tr>\n          <td><img class=\"thumbnail\" src=\"https://raw.githubusercontent.com/global-asp/asp-imagebank/master/medium/" + idx + "/01.jpg\"></td>\n          <td id=\"title\">Title: <i>" + title + "</i></td>\n          <td id=\"story_tgt_title\"><input type=\"text\" id=\"title_text\" /></td></tr><tr>\n";

  $(messages).html("Now translating story #" + idx + " - <i>" + title + "</i> into: <span class=\"editable\" contenteditable=\"true\" id=\"language\" placeholder=\"Target language\"></span>");
  var language = $("#language");
  language.on("input", function() {
    localStorage['gtr_l'] = language.html();
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

  $(next)[0].onclick = function() {
    translate_story(next_story);
  };
  $(prev)[0].onclick = function() {
    translate_story(prev_story);
  };

  check_lang();

  for (var i = 0; i < sections.length; i++) {
    page_number = i + 2;
    if (page_number < 10) {
      page_number = "0" + page_number;
    }
    content_div = content_div + "          <td><img class=\"thumbnail\" src=\"https://raw.githubusercontent.com/global-asp/asp-imagebank/master/medium/" + idx + "/" + page_number + ".jpg\"></td>\n          <td id=\"story_src_" + i + "\">" + json[n].s[i][page_number] + "</td>\n          <td><textarea id=\"story_tgt_" + i + "\"></textarea></td>        </tr>"
  }

  translang = "Translation: " + translator.html() + "<br>* Language: " + language.html();

  story_table = $("#story_table");
  attribution_row = "          <td></td>\n          <td id=\"attribution\">" + attribution.replace(/\n/g, "<br>") + "</td>\n          <td>" + attribution.replace(/\n/g, "<br>").replace(/Language: .*/, translang) + "</td>        </tr>";
  story_table.html(content_div + attribution_row + "      </table>");

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
  tr_title = $("#title_text");
  tr_title.on("input", function() {
    localStorage['gtr_' + idx + '_title'] = tr_title.val();
  });
  if (localStorage["gtr_" + idx + "_title"]) {
    tr_title.val(localStorage["gtr_" + idx + "_title"]);
  }

  function checkForInput(i) {
    $("#story_tgt_" + i).on("input", function(e) {
      localStorage['gtr_' + idx + '_s_' + i] = $(e.currentTarget).val();
    });
  }

  for (var i = 0; i < number_of_sections; i++) {
    checkForInput(i);
    if (localStorage["gtr_" + idx + "_s_" + i]) {
      $("#story_tgt_" + i).val(localStorage["gtr_" + idx + "_s_" + i]);
    }
  }
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

  content_div = "      <table id=\"content_table\">\n        <tr><th style='width:25%'></th><th style='width:65%'>your translation</th></tr><tr>\n          <td><img class=\"revthumb\" src=\"https://raw.githubusercontent.com/global-asp/asp-imagebank/master/medium/" + idx + "/01.jpg\"></td>\n          <td><em>" + tr_title + "</em></td></tr><tr>\n";

  format_content = "# " + tr_title + "\n\n##\n";
  for (var i = 0; i < number_of_sections; i++) {
    tr_text = $("#story_tgt_" + i).val();
    format_content = format_content + tr_text + "\n\n##\n";

    page_number = i + 2;
    if (page_number < 10) {
      page_number = "0" + page_number;
    }
    if (page_number != 0 || page_number != page_number.length) {
      content_div = content_div + "          <td><img class=\"revthumb\" src=\"https://raw.githubusercontent.com/global-asp/asp-imagebank/master/medium/" + idx + "/" + page_number + ".jpg\"></td>\n          <td>" + $("#story_tgt_" + i).val() + "</td>        </tr>"
    }

  }
  translang = "Translation: " + translator.html() + "\n* Language: " + language.html();

  translation_output.val(format_content + attribution.replace(/<br>/g, "\n").replace(/Language: .*/, translang));

  $("#submit_form").css({ display: '' });

  format_attribution = "<ul>" + attribution.replace(/Language: .*/, "") + translang.replace(/\n/g, "<br>") + "</ul>";
  format_attribution = format_attribution.replace(/\* (.*?)</g, "<li>$1</li><").replace(/<br>/g, "");

  var review_table = $("#review_table");
  review_table.html(content_div + "<tr><td></td><td>" + format_attribution + "</td></tr></table>");

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
  sub.val('New translation: #' + $("#idx").html() + ', "' + $("#title i").html()+ '" into ' + $("#language").html() + " by " + $("#translator").html());
  $("#name_line").val(window.translator.html());
  $("#story_number").val(window.idx);
  $("#story_language").val(window.language.html());
  $("#md_title").val(window.idx + "_" + window.title_text.val().toLowerCase().replace(/ /g, "-").replace(/[\!\?,\.:'¿¡`]/g, "") + ".md");
  $("#story_translation").val(window.translation_output.val());
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
