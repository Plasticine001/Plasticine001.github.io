// function FindPosition(oElement){
//   if(typeof( oElement.offsetParent ) != "undefined")
//   {
//     for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
//     {
//       posX += oElement.offsetLeft;
//       posY += oElement.offsetTop;
//     }
//       return [ posX, posY ];
//     }
//     else
//     {
//       return [ oElement.x, oElement.y ];
//     }
// }

// function GetCoordinates(e){
//   var PosX = 0;
//   var PosY = 0;
//   var ImgPos;
//   ImgPos = FindPosition(myImg);
//   if (!e) var e = window.event;
//   if (e.pageX || e.pageY)
//   {
//     PosX = e.pageX;
//     PosY = e.pageY;
//   }
//   else if (e.clientX || e.clientY)
//     {
//       PosX = e.clientX + document.body.scrollLeft
//         + document.documentElement.scrollLeft;
//       PosY = e.clientY + document.body.scrollTop
//         + document.documentElement.scrollTop;
//     }
//   PosX = PosX - ImgPos[0];
//   PosY = PosY - ImgPos[1];
//   document.getElementById("t_x").innerHTML = PosX;
//   document.getElementById("t_y").innerHTML = PosY;
// }

// async function printJSON() {
//   const response = await fetch("../json_files/json_MRI_CT.json");
//   const json = await response.json();
//   console.log(json);
// }


git_raw_url = 'https://raw.githubusercontent.com/Plasticine001/Plasticine001.github.io/main'


var myImg  = $('#canvas').get(0);
var myImg2 = $('#canvas2').get(0);
const img1 = new Image();
const img2 = new Image();
var arr_vel = null;
img1.src = './imgs/cropped-oct106.png';
img2.src = './imgs/Group1_Volume2-5.png';
var ctx  = $('#canvas').get(0).getContext('2d');
var ctx2 = $('#canvas2').get(0).getContext('2d');
img1.onload = function () {
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
// ctx.imageSmoothingQuality = "high";
ctx.drawImage(img1,0,0,256,256);
};
img2.onload = function () {
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx2.imageSmoothingEnabled = false;
        ctx2.drawImage(img2, 0, 0, 256, 256);
};



function readJsonFile(jsonFile) { 
  var reader = new FileReader(); 
  reader.addEventListener('load', (loadEvent) => { 
    try { 
      json = JSON.parse(loadEvent.target.result); 
      console.log(json); 
    } catch (error) { 
      console.error(error); 
    } 
  }); 
  reader.readAsText(jsonFile); 
} 

$('#dataset').change(function() {
  if ($(this).val() == 'OCT'){
    img1.src = './imgs/cropped-oct106.png';
    img2.src = './imgs/Group1_Volume2-5.png';
    url = git_raw_url + '/json_files/json_MRI_CT.json'
  }
  if ($(this).val() == 'MRI-CT'){
    img1.src = './imgs/img0012_tcia_MRslice_131.png';
    img2.src = './imgs/trans_img0012_tcia_MRslice_131.png';
    url = git_raw_url + '/json_files/json_MRI_CT.json'
  }

  if ($(this).val() == 'cardiac'){
    img1.src = './imgs/.png';
    img2.src = './imgs/.png';
    url = git_raw_url + '/json_files/json_MRI_CT.json'
  }
  
  get_vel(url);
});

function jsonArrayTo2D(arrayOfObjects){
  let header = [],
      AoA = [];
  arrayOfObjects.forEach(obj => {
    Object.keys(obj).forEach(key => header.includes(key) || header.push(key))
    let thisRow = new Array(header.length);
    header.forEach((col, i) => thisRow[i] = obj[col] || '')
    AoA.push(thisRow);
  })
  AoA.unshift(header);
  return AoA;
}



function get_vel(url){
  $.ajax({
    type: 'GET',
    dataType: "json",
    url: url,
    async: false,
    // data: {array:obj_vel},
    // D_V_xy, D_V_yx
    success:  function(jsonData) {
        arr_vel = jsonArrayTo2D(jsonData.array); 
      }, 
    });
  // $.getJSON(url, function(data) {
  //   // tst = JSON.parse(data)
  //   arr = data.array
  //   obj_vel =  jsonArrayTo2D(arr)
  // });  

};

$("#canvas").click(function(e){ 
    getPosition(e); 
   
  });

var pointSize = 3;



function getPosition(event){
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    document.getElementById("x").innerHTML = x;
    document.getElementById("y").innerHTML = y;

    var ctx =  $('#canvas').get(0).getContext("2d");
    drawCoordinates(x,y,ctx,img1);

    var ctx2 =  $('#canvas2').get(0).getContext("2d");
    dis_x = (arr_vel[parseInt(x)][parseInt(y)]+1)*256;
    console.log(dis_x);

    drawCoordinates(x+dis_x,y,ctx2,img2);
    $('#t_x').text(String(x+dis_x)) ;
}

function drawCoordinates(x,y, ctx, img){	
    // const img1 = new Image()
    // img1.src = './imgs/cropped-oct106.png';
    // var ctx =  $('#canvas').get(0).getContext("2d");
    ctx.drawImage(img,0 ,0 ,256, 256);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#ff2626"; // Red color
    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
}

