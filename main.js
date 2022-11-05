const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9 , 4);

var mutate_val = document.getElementById('mutate_val').innerHTML;
console.log(mutate_val);

const N=100;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(

            localStorage.getItem("bestBrain"));
            
            if(i!=0){
                mutate_val = document.getElementById('mutate_val').innerHTML;
                NeuralNetwork.mutate(cars[i].brain, mutate_val);
            }
        }
        document.getElementById('displayId').innerHTML += JSON.parse(
            localStorage.getItem('bestId')
            );
    }
var  paused = true;
var trafficV = true;
var nnV = true;

$(document).keypress(function(e){
    if(e.which == 80){
        $('#pause').click();
    }
});
$(document).keypress(function(e){
    if(e.which == 79){
        $('#continue').click();
    }
});
$(document).keypress(function(e){
    if(e.which == 83){
        $('#save').click();
    }
});
$(document).keypress(function(e){
    if(e.which == 68){
        $('#discard').click();
    }
});
$('#nnVisibility').on('click' , function(){
    if(nnV == true){
        nnV = false;
    }
    else{
        nnV = true;
    }
});
$('#trafficVisibility').on('click' , function(){
    if(trafficV == true){
        trafficV = false;
    }
    else{
        trafficV = true;
    }
});


$('#pause').on('click' , function(){
    paused = true;
});

$('#continue').on('click' , function(){
    paused = false;
    requestAnimationFrame(animate);
})

const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2,getRandomColor()),
];

animate();  

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
    console.log(bestCar.id);
    localStorage.setItem("bestId" , 
        JSON.stringify(bestCar.id));
}

function discard(){
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("bestId");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI",3,"blue",i));
    }
    return cars;
}

function animate(time){
    if(paused){return ;}

    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

        // console.log("->" , typeof(bestCar.y));
    for(let i=0;i<traffic.length;i++){
        // if( (traffic[i].y < bestCar.y - 50) && (traffic[i].y > bestCar.y + 50)){
            // console.log("->" , typeof(traffic[i].y));
            traffic[i].update(road.borders,[]);
        
        // }
    }

    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    // console.log(bestCar.x , bestCar.y);

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        if( (traffic[i].y < bestCar.y + 400) && (traffic[i].y > bestCar.y - 400)){
        traffic[i].draw(carCtx);
        }
    }
    if(trafficV == true){
        carCtx.globalAlpha=0.2;
        for(let i=0;i<cars.length;i++){
            cars[i].draw(carCtx);
        }
        carCtx.globalAlpha=1;
    }
    bestCar.draw(carCtx,true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    if(nnV == true){
        Visualizer.drawNetwork(networkCtx,bestCar.brain);
    }
    requestAnimationFrame(animate);
}