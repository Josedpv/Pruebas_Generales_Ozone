
//------------------------------------------------------------download

function download_image(){
      var link = document.createElement('a');
      link.download = "Lluvia.mp4";
      link.href = "images/Lluvia.mp4";
      link.click();
    }