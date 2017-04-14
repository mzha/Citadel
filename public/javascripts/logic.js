function downloadFile(file_id) {
  $.post("/downloadFile", {file_id: file_id}, function(data, status){
    download(data.name + ".txt", data.content);
  })
}

function clearFile(file_id) {
  $.post("/clearFile", {file_id: file_id}, function(data, status) {

  });
}


function downloadHistory(address) {
  console.log("history " + address);
  $.post("/downloadHistory", {address: address}, function(data, status){
        download(address + " history.txt", data);
    });
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
