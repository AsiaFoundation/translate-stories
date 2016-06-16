document.getElementById("fileup").onchange = function(e) {
  console.log(e.target.files[0]);

  var new_zip = new JSZip();
  // more files !
  new_zip.loadAsync(e.target.files[0])
    .then(function(unzipped) {
      console.log(unzipped.files);
    });
};
