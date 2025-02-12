//Virtual canvas so that I can draw whichever size of canvas I need
var virtCanvas=document.createElement("canvas");
var virtCtx=virtCanvas.getContext("2d");
var defStarting=Math.PI*0.5;
var globalCount=0;
// Function to draw a segment of a ring
// The angles are in radians
//center is a javascript object with "x" and "y" keys
function drawRingSegment(center={"x":200,"y":200},startingAngle=defStarting, endAngle=Math.PI, innerRadius=50, outerRadius=80){
    //First get the normalized vector that indicates the direction of the offset
    let startAngleVector={"x":Math.cos(startingAngle),"y":Math.sin(startingAngle)};
    virtCtx.beginPath();
    virtCtx.arc(center["x"],center["y"],innerRadius,startingAngle,endAngle,false);
    virtCtx.arc(center["x"],center["y"],outerRadius,endAngle,startingAngle,true);
    virtCtx.moveTo(center["x"]+(startAngleVector["x"]*innerRadius),center["y"]+(startAngleVector["y"]*innerRadius));
    virtCtx.lineTo(center["x"]+(startAngleVector["x"]*outerRadius),center["y"]+(startAngleVector["y"]*outerRadius));
    virtCtx.stroke();
}
function drawSegmentedRing(center={"x":200,"y":200},innerRadius=50,outerRadius=50, numberOfSegments=8){
    var increment=(2*Math.PI)/numberOfSegments;
    var currentAngle=0;
    while(currentAngle<=(2*Math.PI)){
        drawRingSegment(center,currentAngle,currentAngle+increment,innerRadius,outerRadius);
        currentAngle+=increment;
    } 
}
function drawNestedRings(center={"x":200,"y":200},initialSegmentCount=6,layers=10,ringThickness=20){
    var innerRadius=0;
    var outerRadius=ringThickness;
    var currentLayer=1;
    while(currentLayer<=layers){
        let segmentCount=currentLayer*initialSegmentCount;
        drawSegmentedRing(center,innerRadius,outerRadius,segmentCount);
        currentLayer+=1;
        innerRadius+=ringThickness;
        outerRadius+=ringThickness;
    }
}
function drawCustomPatter(){
    let canvas=document.getElementById("Pattern");
    let ctx=canvas.getContext("2d");
    virtCtx.rect(0, 0, virtCanvas.width, virtCanvas.height);
    virtCtx.fillStyle = "white";
    virtCtx.fill();
    virtCtx.closePath();
    var rowInput=document.getElementById("RowCount");
    var segmentInput=document.getElementById("SegmentCount");
    let rowCount=rowInput.value;
    let segmentCount=segmentInput.value;
    virtCanvas.width=(rowCount*2+2)*50;
    virtCanvas.height=(rowCount*2+2)*50;
    ringWidth=canvas.width;
    drawNestedRings({"x":(virtCanvas.width*0.5),"y":(virtCanvas.height*0.5)},segmentCount,rowCount,50);
    //Update real canvas size
    canvas.width=virtCanvas.width;
    canvas.height=virtCanvas.height;
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.drawImage(virtCanvas,0,0);
}

//Downloading capabilities
function downloadPattern(){
    let canvas=document.getElementById("Pattern");
    var dataURL=canvas.toDataURL("image/jpeg");
    var a=document.createElement('a');
    a.href=dataURL;
    a.download="custom_pattern"+String(globalCount)+".jpeg";
    a.click();
    globalCount+=1;
}
