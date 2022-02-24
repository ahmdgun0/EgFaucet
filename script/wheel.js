// wheel File
// Create Wheel =>
let wheel = `
<div class="modal fade show" id="exampleModalScrollable" tabindex="-1" aria-labelledby="exampleModalScrollableTitle" aria-modal="true" role="dialog" style="display: block;">
<div class="modal-dialog modal-dialog-scrollable">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalScrollableTitle">Win Wheel</h5>
      <button id="cls" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <div class="cont">
            <button class="btnWheel" onclick="startSpin()">Spin</button>
            <canvas id='canvas' width='900' height='400'></canvas>
            <i class="fas fa-level-down"></i>
        </div>
    </div>
    <div class="modal-footer">
      <button id="btnwheel" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
  </div>
</div>
</div>
`;


let dateNow = Math.floor(new Date().getTime() / 1000);
let local   = localStorage.getItem("wheel"); // Null

let theWheel;
// console.log(local);
if(local === null){
    createWheel();
}else if(dateNow - local >= 86400){
    createWheel();
}
function createWheel(){
    setTimeout(() => {
        document.body.innerHTML += wheel;
        theWheel = new Winwheel({
        'numSegments' : 5,
        'segments'    :
        [
            {'fillStyle' : '#3488fc', 'text' : '20SH'},
            {'fillStyle' : '#7454f5', 'text' : '10SH'},
            {'fillStyle' : '#f2504b', 'text' : 'Lost !'},
            {'fillStyle' : '#7454f5', 'text' : '10SH'},
            {'fillStyle' : '#f2504b', 'text' : 'Lost !'}
        ],
        'animation' :
        {
            'type'     : 'spinToStop',
            'duration' : 5,
            'spins'    : 15,
            'callbackFinished' : alertPrize
        }
    });
    // Font Color =>
    theWheel.segments[1].textFillStyle = '#FFFFFF';
    theWheel.segments[2].textFillStyle = '#FFFFFF';
    theWheel.segments[3].textFillStyle = '#FFFFFF';
    theWheel.segments[4].textFillStyle = '#FFFFFF';
    theWheel.segments[5].textFillStyle = '#FFFFFF';
    theWheel.draw();
    //
    document.querySelector("#btnwheel").addEventListener("click", () =>{
        document.querySelector("#exampleModalScrollable").remove();
    });
    document.querySelector("#cls").addEventListener("click", () =>{
        document.querySelector("#exampleModalScrollable").remove();
    });
}, 2000);
}

// 1 Turn =>
let wheelSpinning = false;

function startSpin() {
    if(!wheelSpinning){
        theWheel.startAnimation();
        wheelSpinning = true;
        localStorage.setItem("wheel", dateNow);
    }
}

// Get Price =>
function alertPrize(indicatedSegment) {
    if(indicatedSegment.text !== "Lost !"){
        Swal.fire("Congratulation", "You have won " + indicatedSegment.text, "success");
        addPoints(parseInt(indicatedSegment.text))
    }else{
        Swal.fire("Ops !", "You are Lost Your Turn", "error")
    }
    document.querySelector("#exampleModalScrollable").remove();
}
// Add Points
function addPoints(num){
    localStorage.setItem("price", num);
}
