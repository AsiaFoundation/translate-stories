var wholepages;
var booktitle = '';

require(["readium_shared_js/globalsSetup"], function () {


    // TODO: unfortunately this is not a reliable method to discover AMD module availability with RequireJS, because:
    // 1) Almond does not implement .specified() and/or .defined()
    // 2) Package names always return false?
    // PS: not a blocking issue, just something to consider improving
    if (!require.specified) {
        console.log("!require.specified => using RequireJS-Almond as AMD loader?");
    }
    if (!require.defined) {
        console.log("!require.defined => using RequireJS-Almond as AMD loader?");
    }

    if (require.specified && require.specified('readium_plugin_annotations')) {
    //if (require.specified && require.specified('readium_plugin_annotations/main')) {
    //if (require.specified && require.specified('readium_shared_js/plugins/annotations/main') {

        //alert("readium_plugin_annotations");
        require(['readium_plugin_annotations'], function (annotationPluginConfig) {
            console.log("readium_plugin_annotations:");
            console.debug(annotationPluginConfig);
        });
    }

    if (require.specified && require.specified('readium_plugin_example')) {
    //if (require.specified && require.specified('readium_plugin_example/main')) {
    //if (require.specified && require.specified('readium_shared_js/plugins/example/main')) {

        //alert("readium_plugin_example");
          require(['readium_plugin_example'], function (examplePluginConfig) {
                console.log("readium_plugin_example:");
                console.debug(examplePluginConfig);

                examplePluginConfig.borderColor = "blue";
                examplePluginConfig.backgroundColor = "cyan";
          });
    }



    require(['readium_js/Readium'], function (Readium) {

        var readium = undefined;
        var altBook = false;

        var readiumOptions =
        {
            jsLibRoot: "../build-output/",
            cacheSizeEvictThreshold: undefined,
            useSimpleLoader: false, // false so we can load ZIP'ed EPUBs
            openBookOptions: {}
        };

              Readium.getVersion(function(version){

            console.log(version);

            window.navigator.epubReadingSystem.name = "readium-js test example demo";
            window.navigator.epubReadingSystem.version = version.readiumJs.version;

            window.navigator.epubReadingSystem.readium = {};

            window.navigator.epubReadingSystem.readium.buildInfo = {};

            window.navigator.epubReadingSystem.readium.buildInfo.dateTime = version.readiumJs.timestamp;
            window.navigator.epubReadingSystem.readium.buildInfo.version = version.readiumJs.version;
            window.navigator.epubReadingSystem.readium.buildInfo.chromeVersion = version.readiumJs.chromeVersion;

            window.navigator.epubReadingSystem.readium.buildInfo.gitRepositories = [];

            // var repo1 = {};
            // repo1.name = "readium-js-viewer";
            // repo1.sha = version.viewer.sha;
            // repo1.tag = version.viewer.tag;
            // repo1.clean = version.viewer.clean;
            // repo1.url = "https://github.com/readium/" + repo1.name + "/tree/" + repo1.sha;
            // window.navigator.epubReadingSystem.readium.buildInfo.gitRepositories.push(repo1);

            var repo2 = {};
            repo2.name = "readium-js";
            repo2.sha = version.readiumJs.sha;
            repo2.version = version.readiumJs.version;
            repo2.tag = version.readiumJs.tag;
            repo2.branch = version.readiumJs.branch;
            repo2.clean = version.readiumJs.clean;
            repo2.release = version.readiumJs.release;
            repo2.timestamp = version.readiumJs.timestamp;
            repo2.url = "https://github.com/readium/" + repo2.name + "/tree/" + repo2.sha;
            window.navigator.epubReadingSystem.readium.buildInfo.gitRepositories.push(repo2);

            var repo3 = {};
            repo3.name = "readium-shared-js";
            repo3.sha = version.readiumSharedJs.sha;
            repo3.version = version.readiumSharedJs.version;
            repo3.tag = version.readiumSharedJs.tag;
            repo3.branch = version.readiumSharedJs.branch;
            repo3.clean = version.readiumSharedJs.clean;
            repo3.release = version.readiumSharedJs.release;
            repo3.timestamp = version.readiumSharedJs.timestamp;
            repo3.url = "https://github.com/readium/" + repo3.name + "/tree/" + repo3.sha;
            window.navigator.epubReadingSystem.readium.buildInfo.gitRepositories.push(repo3);

            if (version.readiumCfiJs)
            {
                var repo4 = {};
                repo4.name = "readium-cfi-js";
                repo4.sha = version.readiumCfiJs.sha;
                repo4.version = version.readiumCfiJs.version;
                repo4.tag = version.readiumCfiJs.tag;
                repo4.branch = version.readiumCfiJs.branch;
                repo4.clean = version.readiumCfiJs.clean;
                repo4.release = version.readiumCfiJs.release;
                repo4.timestamp = version.readiumCfiJs.timestamp;
                repo4.url = "https://github.com/readium/" + repo4.name + "/tree/" + repo4.sha;
                window.navigator.epubReadingSystem.readium.buildInfo.gitRepositories.push(repo4);
            }

            // Debug check:
            //console.debug(JSON.stringify(window.navigator.epubReadingSystem, undefined, 2));

            var origin = window.location.origin;
            if (!origin) {
                origin = window.location.protocol + '//' + window.location.host;
            }
            var prefix = (self.location && self.location.pathname && origin) ? (origin + self.location.pathname + "/..") : "";

            var readerOptions =
            {
                needsFixedLayoutScalerWorkAround: false,
                el:"#viewport",
                annotationCSSUrl: prefix + "/annotations.css",
                mathJaxUrl: "/MathJax.js"
            };

            ReadiumSDK.on(ReadiumSDK.Events.PLUGINS_LOADED, function(reader) {

                // readium built-in (should have been require()'d outside this scope)
                console.log(reader.plugins.annotations);
                if (reader.plugins.annotations) {
                    reader.plugins.annotations.initialize({annotationCSSUrl: readerOptions.annotationCSSUrl});
                    reader.plugins.annotations.on("annotationClicked", function(type, idref, cfi, id) {
                        console.log("ANNOTATION CLICK: " + id);
                        reader.plugins.annotations.removeHighlight(id);
                    });
                    reader.plugins.annotations.on("textSelectionEvent", function() {
                        console.log("ANNOTATION SELECT");
                        reader.plugins.annotations.addSelectionHighlight(Math.floor((Math.random()*1000000)), "highlight");
                    });
                }

                // external (require()'d via Dependency Injection, see examplePluginConfig function parameter passed above)
                console.log(reader.plugins.example);
                if (reader.plugins.example) {

                    reader.plugins.example.on("exampleEvent", function(message) {
                        console.log("Example plugin: \n" + message);

                        var altBook_ = altBook;
                        altBook = !altBook;

                        setTimeout(function(){

                        var openPageRequest = undefined; //{idref: bookmark.idref, elementCfi: bookmark.contentCFI};

                        var ebookURL = altBook_ ? "EPUB/sample.epub" : "EPUB/sample.epub";

                        readium.openPackageDocument(
                            ebookURL,
                            function(packageDocument, options) {
                            },
                            openPageRequest
                        );

                        }, 200);
                    });
                }
            });

            $(document).ready(function () {
                wholepages = [];
                readium = new Readium(readiumOptions, readerOptions);

                var openPageRequest = undefined; //{idref: bookmark.idref, elementCfi: bookmark.contentCFI};

                var ebookURL = "EPUB/sample";

                var pages = 1;

                readium.openPackageDocument(
                    ebookURL,
                    function(packageDocument, options) {
                      booktitle = options.metadata.title;
                      var loadpages = setInterval(function() {
                        readium.reader.openPageRight();
                        pages++;
                        if (pages > wholepages.length + 10) {
                          clearInterval(loadpages);
                          setStory();
                        }
                      }, 250);
                    },
                    openPageRequest
                );
            });
        });

    });
});

function setStory(nav) {
  var story_table = $("#story_table");
  var messages = $("#messages");
  var translator = $("#translator");
  var translator_div = $("#translator_div");
  var idx_store = $("#idx");
  var serial_store = $("#serial");
  var nav_buttons = $("#nav_buttons");
  var translate_button = $("#translate_button");

  idx = -1;
  title = 'Blank Title';
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
      .attr('src', "/EPUB/sample/OPS/" + wholepages[0][1])
    )
  );
  cover.append(
    $('<label>').text('Title: ' + booktitle)
  );
  cover.append($('<br/>'));
  cover.append(
    $('<input id="title_text" class="form-control" placeholder="Your translation"/>')
  );
  story_table.append(cover);

  for (var i = 1; i < sections.length; i++) {
    var page = $("<div>").addClass("item");
    page.append($("<div class='img-holder'>").append(
      $("<img>")
        .attr("src", "/EPUB/sample/OPS/" + sections[i][1])
      )
    );
    page.append($("<span id='story_src_" + i + "'>").text(sections[i][0]));
    page.append($("<div class='form-group'><textarea id='story_tgt_" + i + "' class='form-control' placeholder='Your translation'></textarea></div>"));
    story_table.append(page);
  }
  story_table.append(
    $("<div class='item'></div>").css({ textAlign: 'center' }).append(
      $('<button class="done">').text('Review submission').click(review_translation)
    )
  );

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
