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
var arr_vel_x = null;
var arr_vel_y = null;
img1.src = './imgs/oct_source.png';
img2.src = './imgs/oct_target.png';
var ctx  = $('#canvas').get(0).getContext('2d');
var ctx2 = $('#canvas2').get(0).getContext('2d');
def_url = git_raw_url + '/json_files/json_oct.json'

url = def_url

get_vel(url);
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
    img1.src = './imgs/oct_source.png';
    img2.src = './imgs/oct_target.png';
    url = def_url
  }
  if ($(this).val() == 'MRI-CT'){
    img1.src = './imgs/MRI_source_131.png';
    img2.src = './imgs/CT_translated_131.png';
    url = git_raw_url + '/json_files/json_MRI_CT.json'
  }

  if ($(this).val() == 'cardiac'){
    img1.src = './imgs/.png';
    img2.src = './imgs/cardiac_translated.png';
    url = git_raw_url + '/json_files/json_cardiac.json'
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
  // AoA.unshift(header);
  return AoA;
}



function get_vel(url){
  $.ajax({
    type: 'GET',
    dataType: "json",
    url: url,
    async: false,
    success:  function(jsonData) {
        arr_vel_x = jsonArrayTo2D(jsonData.D_V_x); 
        arr_vel_y = jsonArrayTo2D(jsonData.D_V_y); 
        console.log(arr_vel_x);
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
    var x = Math.ceil(event.clientX - rect.left);
    var y = Math.ceil(event.clientY - rect.top );

    document.getElementById("x").innerHTML = x;
    document.getElementById("y").innerHTML = y;

    var ctx =  $('#canvas').get(0).getContext("2d");
    drawCoordinates(x,y,ctx,img1);

    var ctx2 =  $('#canvas2').get(0).getContext("2d");
    // dis_x = arr_vel_x[x][Math.abs(256-y)]/2.0+127;
    // dis_y = arr_vel_y[x][Math.abs(256-y)]/2.0+127;

    // dis_x = arr_vel_x[Math.abs(256-x)][y];
    // dis_y = arr_vel_y[Math.abs(256-x)][y];
    // new_x = x-dis_y;
    // new_y = y-dis_x;

    dis_x = arr_vel_x[255-y][x];
    dis_y = arr_vel_y[255-y][x];
    new_x = x+dis_y;
    new_y = y+dis_x;

    // new_x = dis_x;
    // new_y = Math.abs(255-dis_y);
    drawCoordinates2(x, y, ctx2,img2, new_x, new_y);
    drawArrow(ctx2, x, y, new_x,new_y, 0.5, 'black');

    $('#t_x').text(String(new_x.toFixed(2))) ;
    $('#t_y').text(String(new_y.toFixed(2))) ;

    $('#d_x').text(String(dis_y.toFixed(2))) ;
    $('#d_y').text(String(dis_x.toFixed(2))) ;
}

function drawCoordinates(x,y, ctx, img, style="#ff2626"){	
    // const img1 = new Image()
    // img1.src = './imgs/cropped-oct106.png';
    // var ctx =  $('#canvas').get(0).getContext("2d");
    ctx.drawImage(img,0 ,0 ,256, 256);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = style; // Red color
    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
}


function drawCoordinates2(x,y, ctx, img, x2,y2){	
  ctx.drawImage(img,0 ,0 ,256, 256);
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#ff2626"; // Red color
  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.fillStyle = "#00ff00"; // green color
  ctx.beginPath();
  ctx.arc(x2, y2, pointSize, 0, Math.PI * 2, true);
  ctx.fill();
}


function drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color){
  //variables to be used when creating the arrow
  var headlen = 10;
  var angle = Math.atan2(toy-fromy,tox-fromx);

  ctx.save();
  ctx.strokeStyle = color;

  //starting path of the arrow from the start square to the end square
  //and drawing the stroke
  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineWidth = arrowWidth;
  ctx.stroke();

  //starting a new path from the head of the arrow to one of the sides of
  //the point
  ctx.beginPath();
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
             toy-headlen*Math.sin(angle-Math.PI/7));

  //path from the side point of the arrow, to the other side point
  ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
             toy-headlen*Math.sin(angle+Math.PI/7));

  //path from the side point back to the tip of the arrow, and then
  //again to the opposite side point
  ctx.lineTo(tox, toy);
  ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
             toy-headlen*Math.sin(angle-Math.PI/7));

  //draws the paths created above
  ctx.stroke();
  ctx.restore();
}