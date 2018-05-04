//var a = ship.f_sw();

var counter = 1;
//creates slides
for (counter === 1; counter < 3; counter++) {
    this['slider' + counter] = document.getElementById('sliderLoadDist' + counter);
    this['slider' + counter].style.marginTop = "8%";
    noUiSlider.create(this['slider' + counter], {
        start: [0, 0],
        step: 2,
        tooltips: true,
        connect: true,
        range: {
            'min': [0],
            'max': [ship.L]
        },
        format: wNumb({
            decimals: 0,
            postfix: ' m'
        })
    });

    // holds the data series for slide(counter)
    this["load" + counter] = [];
    for (let i = 0; i < Math.ceil(ship.L / 2) + 1; i++) {
        this["load" + counter][i] = {
            x: 2 * i,
            y: 10
        };
    }
}
slider1.noUiSlider.set([0, 26]);
slider2.noUiSlider.set([ship.L - 28, ship.L]);

// Updates the values on load1[] whenever the range slide is moved
slider1.noUiSlider.on("slide", function () {
    var y1 = document.getElementById("inputLoad1").value;
    //console.log(y1);
    let a = slider1.noUiSlider.get();
    let slideMin = a[0].split(" ", 1);
    let slideMax = a[1].split(" ", 1);
    let numbOfSteps = (slideMax - slideMin) / 2;
    load1.length = 0;
    for (let i = 0; i < numbOfSteps + 1; i++) {
        load1[i] = {
            x: Number(slideMin) + 2 * i,
            y: Number(y1)
        }; //[ton]
    }
    //chart1.options.data[1].dataPoints = load1;

    getTotalLoad();
    chart2.options.data[0].dataPoints = loadsResultant;
    chart3.options.data[0].dataPoints = stillWaterBM;
    chart3.options.data[1].dataPoints = shearForce;

    //chart1.render();
    chart2.render();
    chart3.render();
});

// Updates the values on load2[] whenever the range slide is moved
slider2.noUiSlider.on("slide", function () {
    var y2 = document.getElementById("inputLoad2").value;
    let a = slider2.noUiSlider.get();
    let slideMin = a[0].split(" ", 1);
    let slideMax = a[1].split(" ", 1);
    let numbOfSteps = (slideMax - slideMin) / 2;
    load2.length = 0;
    for (let i = 0; i < numbOfSteps + 1; i++) {
        load2[i] = {
            x: Number(slideMin) + 2 * i,
            y: Number(y2)
        }; // [ton]
    }
    //chart1.options.data[2].dataPoints = load2;

    getTotalLoad();
    chart2.options.data[0].dataPoints = loadsResultant;
    chart3.options.data[0].dataPoints = stillWaterBM;
    chart3.options.data[1].dataPoints = shearForce;

    //chart1.render();
    chart2.render();
    chart3.render();
});

// Updates the values on load3[] whenever the range slide is moved
//slider3.noUiSlider.on("slide", function(){
//    var y3 = document.getElementById("inputLoad3").value;
//    let a = slider3.noUiSlider.get();
//    let slideMin = a[0].split(" ", 1);
//    let slideMax = a[1].split(" ", 1);
//    let numbOfSteps = (slideMax - slideMin)/2;
//    load3.length = 0;
//    for(let i=0; i<numbOfSteps+1; i++){
//        load3[i] = {x:Number(slideMin)+2*i, y:Number(y3)}; // [ton]
//    }
//    //chart1.options.data[3].dataPoints = load3;
//    
//    getTotalLoad();
//    chart2.options.data[0].dataPoints = loadsResultant;
//    chart3.options.data[0].dataPoints = stillWaterBM;
//    chart3.options.data[1].dataPoints = shearForce;
//   
//    //chart1.render();
//    chart2.render();
//    chart3.render();
//});

// Updates the values on load4[] whenever the range slide is moved
//slider4.noUiSlider.on("slide", function(){
//    var y4 = document.getElementById("inputLoad4").value;
//    let a = slider4.noUiSlider.get();
//    let slideMin = a[0].split(" ", 1);
//    let slideMax = a[1].split(" ", 1);
//    let numbOfSteps = (slideMax - slideMin)/2;
//    load4.length = 0;
//    for(let i=0; i<numbOfSteps+1; i++){
//        load4[i] = {x:Number(slideMin)+2*i, y:Number(y4)}; // [ton]
//    }
//
//    //chart1.options.data[4].dataPoints = load4;
//    
//    getTotalLoad();
//    chart2.options.data[0].dataPoints = loadsResultant;
//    chart3.options.data[0].dataPoints = stillWaterBM;
//    chart3.options.data[1].dataPoints = shearForce;
//
//    //chart1.render();
//    chart2.render();
//    chart3.render();
//});

// Updates the values on load(count) whenever the load input is changed
function getInputValue(count) {
    this["y" + count] = document.getElementById("inputLoad" + count).value;
    let a = this["slider" + count].noUiSlider.get();
    let slideMin = a[0].split(" ", 1);
    let slideMax = a[1].split(" ", 1);
    let numbOfSteps = (slideMax - slideMin) / 2;
    this["load" + count].length = 0;
    for (let i = 0; i < numbOfSteps + 1; i++) {
        this["load" + count][i] = {
            x: Number(slideMin) + 2 * i,
            y: Number(this["y" + count])
        };
    }
    console.log("this regards to slider " + count);
    console.log(this["load" + count]);

    getTotalLoad();

    chart2.options.data[0].dataPoints = loadsResultant;
    chart3.options.data[0].dataPoints = stillWaterBM;
    chart3.options.data[1].dataPoints = shearForce;

    chart2.render();
    chart3.render();
}

// Creates arrays that store loads data with coordenates for the graph 
function loadsArray(x, y) {
    this.x = x;
    this.y = y;
}


var load1 = new Array(); // holds the data series for slide1
var load2 = new Array(); // holds the data series for slide2

var LWTdata = []; // holds the LWT distribution along LOA
var dispData = []; // holds the displacement distribution along LOA
var stillWaterBM = new Array();
var shearForce = new Array();
var loadsResultant = new Array(); // totalLoads minus displacement
// fill up the x position of load1 array (data serie for slider1) - random data



for (let i = 0; i < ship.L + 1; i += 2) {
    load1.push(new loadsArray(i, 0));
    load2.push(new loadsArray(i, 0));
    //LWTdata.push(new loadsArray( i , Math.ceil(ship.LWT/ship.LOA) ));
    dispData.push(new loadsArray(i, Math.ceil(-(ship.LWT + ship.DWT) / ship.L))); // uniform displacement along L
}
for (let i = 0; i < 14; i += 1) {
    load1[i].y = 1200;
}
for (let j = ship.L / 2; j > ship.L / 2 - 12; j -= 1) {
    load2[j].y = 1200;
}

// this array holds the sum of all loads
var totalLoad = new Array();

function getTotalLoad() {

    LWT = ship.LWT / ship.L;
    totalLoad = []; // cleans up previous values
    for (let i = 0; i <= Math.ceil(ship.L / 2); i++) { // fill up the x position of totalLoad array
        totalLoad.push(new loadsArray(2 * i, LWT));
    }
    let k = 0; // just a counter
    for (let i = load1[0].x / 2; i < load1[0].x / 2 + load1.length; i++) {
        let Tot = totalLoad[i].y;
        let L1 = load1[k].y;
        totalLoad[i].y = Tot + L1;
        k++;
    }
    k = 0; // zerando o counter before getting in the loops
    for (let i = load2[0].x / 2; i < load2[0].x / 2 + load2.length; i++) {
        let Tot = totalLoad[i].y;
        let L2 = load2[k].y;
        totalLoad[i].y = Tot + L2;
        k++;
    }

    calcResultant();
    stillWaterShearForce();
    stillWaterBendingMoment();
}
getTotalLoad();

function calcResultant() {

    loadsResultant = [] // errases the previous data
    for (let i = 0; i < Math.ceil(ship.L) + 1; i += 2) {
        let R = totalLoad[i / 2].y + dispData[i / 2].y; //[ton]
        loadsResultant.push({
            x: i,
            y: R
        });
    }
}

function stillWaterShearForce() {

    shearForce = []; // errases the previous data
    shearForce[0] = {
        x: 0,
        y: 0
    };
    for (let i = 1; i < Math.ceil(ship.L / 2) + 1; i++) {
        let SF = Math.ceil(shearForce[i - 1].y + 10 * loadsResultant[i - 1].y * (2)); // integrating the load through the lenght. 2 is the length interval. 10 is the ton to kN tranformation
        shearForce.push({
            x: i * 2,
            y: SF
        });

    }
}

function stillWaterBendingMoment() {

    stillWaterBM = []; // errases the previous data
    stillWaterBM[0] = {
        x: 0,
        y: 0
    };
    for (let i = 1; i < Math.ceil(ship.L / 2) + 1; i++) {
        let BM = stillWaterBM[i - 1].y + shearForce[i].y / (6) // integrating the shear force through the lenght. Don't know why it's devided by 2
        stillWaterBM.push({
            x: i * 2,
            y: BM
        }); //[kNm]
    }
}

function clearThis(count) {
    switch (count) {
        case 1:
            slider1.noUiSlider.set([0, 0]);
            document.getElementById("inputLoad1").value = 0;
            for (let i = load1[0].x / 2; i < load1[0].x / 2 + load1.length; i++) {
                let k = 0; // just a counter
                let Tot = totalLoad[i].y;
                let L1 = load1[k].y;
                totalLoad[i].y = Tot - L1;
                //chart1.options.data[count].dataPoints = load1;
                k++;
            }
            load1 = [{
                x: 0,
                y: 0
            }];
            break;
        case 2:
            slider2.noUiSlider.set([0, 0]);
            document.getElementById("inputLoad2").value = 0;
            for (let i = load2[0].x / 2; i < load2[0].x / 2 + load2.length; i++) {
                let k = 0; // just a counter
                let Tot = totalLoad[i].y;
                let L2 = load2[k].y;
                totalLoad[i].y = Tot - L2;
                //chart1.options.data[count].dataPoints = load2;
                k++;
            }
            load2 = [{
                x: 0,
                y: 0
            }];
            break;
        case 3:
            slider3.noUiSlider.set([0, 0]);
            document.getElementById("inputLoad3").value = 0;
            for (let i = load3[0].x / 2; i < load3[0].x / 2 + load3.length; i++) {
                let k = 0; // just a counter
                let Tot = totalLoad[i].y;
                let L3 = load3[k].y;
                totalLoad[i].y = Tot - L3;
                //chart1.options.data[count].dataPoints = load3;
                k++;
            }
            load3 = [{
                x: 0,
                y: 0
            }];
            break;
        case 4:
            slider4.noUiSlider.set([0, 0]);
            document.getElementById("inputLoad4").value = 0;
            for (let i = load4[0].x / 2; i < load4[0].x / 2 + load4.length; i++) {
                let k = 0; // just a counter
                let Tot = totalLoad[i].y;
                let L4 = load4[k].y;
                totalLoad[i].y = Tot - L4;
                //chart1.options.data[count].dataPoints = load4;
                k++;
            }
            load4 = [{
                x: 0,
                y: 0
            }];
            break;
    }

    getTotalLoad();

    chart2.options.data[0].dataPoints = loadsResultant;
    chart3.options.data[0].dataPoints = stillWaterBM;
    chart3.options.data[1].dataPoints = shearForce;

    console.log("this regards slider" + count);
    console.log(this["load" + count]);

    console.log(totalLoad);

    //chart1.render();
    chart2.render();
    chart3.render();
}

function createSlider() {

    var loadSlidersPlace = document.getElementById("loadSlidersPlace");
    var sliderBlock1 = document.getElementById('slider1');
    var sliderBlock2 = document.getElementById('slider2');

    var newSliderBlock = document.createElement('div');
    newSliderBlock.className = 'row';
    loadSlidersPlace.insertBefore(newSliderBlock, addLoadInputButton);

    var div1 = document.createElement('div');
    div1.className = 'col s12';
    newSliderBlock.appendChild(div1)

    var cardContainer = document.createElement('div');
    cardContainer.className = 'card-panel';
    cardContainer.style.paddingTop = "2px";
    cardContainer.textContent = "Weight " + counter;
    cardContainer.style.fontStyle = "italic";
    cardContainer.style.paddingBottom = "1px";
    cardContainer.style.margin = '0';
    div1.appendChild(cardContainer);


    var div2 = document.createElement('div');
    div2.className = 'row';
    div2.style.paddingTop = "20px";
    div2.style.fontStyle = "normal";
    cardContainer.appendChild(div2);

    var div3 = document.createElement('div');
    div3.className = 'col s8';
    div2.appendChild(div3);

    var div4 = document.createElement('div');
    div4.id = 'sliderLoadDist' + counter;
    div3.appendChild(div4);


    //creates slider(counter)
    this['slider' + counter] = document.getElementById('sliderLoadDist' + counter);
    this['slider' + counter].style.marginTop = "8%";
    noUiSlider.create(this['slider' + counter], {
        start: [0, 100],
        step: 2,
        tooltips: true,
        connect: true,
        range: {
            'min': [0],
            'max': [ship.LOA]
        },
        format: wNumb({
            decimals: 0,
            postfix: ' m'
        })

    });

    // holds the data series for slide(counter)
    this["load" + counter] = [];
    for (let i = 0; i < Math.ceil(LOA / 2) + 1; i++) {
        this["load" + counter][i] = {
            x: 2 * i,
            y: 10
        };
    }

    // Updates the values on load4[] whenever the range slide is moved
    //    slidersArray[counter].noUiSlider.on("slide", function(){
    //        var y4 = document.getElementById("inputLoad"+counter).value;
    //        let a = slidersArray[counter].noUiSlider.get();
    //        let slideMin = a[0].split(" ", 1);
    //        let slideMax = a[1].split(" ", 1);
    //        let numbOfSteps = (slideMax - slideMin)/2;
    //        slidersArray[counter].length = 0;
    //        for(let i=0; i<numbOfSteps+1; i++){
    //            this["load"+counter] = {x:Number(slideMin)+2*i, y:Number(y4)}; // [ton]
    //        }
    //        getTotalLoad();
    //        chart1.render();
    //        chart2.render();
    //        chart3.render();
    //    });

    console.log("this is load" + counter);
    console.log(this["load" + counter]);

    counter++;

    var numbContainer = document.createElement('div');
    numbContainer.className = 'input-field col s2 offset-s1',
        //numbContainer.style.marginTop = '-1%';
        div2.appendChild(numbContainer);

    var numbInput = document.createElement('input');
    numbInput.type = "number";
    numbInput.id = "inputLoad" + counter;
    numbInput.placeholder = "load";
    numbInput.style.width = "60";
    numbInput.onchange = "getInputValue(counter)";

    numbContainer.appendChild(numbInput);

    //    var numbInputLabel = document.createElement('label');
    //    numbInputLabel.for = "load1" + counter;
    //    numbContainer.appendChild(numbInputLabel);
    //    
    //    var labelText = document.createTextNode("ton/m");
    //    numbInputLabel.appendChild(labelText);

    var iconContainer = document.createElement('div');
    iconContainer.className = "col s1";
    iconContainer.style.marginTop = '6%';
    div2.appendChild(iconContainer);

    var deleteIconPlace = document.createElement('a');
    deleteIconPlace.className = "waves-effect waves-gray tooltipped";
    //deleteIconPlace.data-position = "right";
    //deleteIconPlace.data-delay = "50";
    //deleteIconPlace.data-tooltip = "clear";


    iconContainer.appendChild(deleteIconPlace);
    deleteIconPlace.addEventListener("click", function onclick(event) {
        loadSlidersPlace.removeChild(newSliderBlock);
    });

    var deleteIcon = document.createElement('i');
    deleteIcon.className = "material-icons";
    deleteIconPlace.appendChild(deleteIcon);
    var iconText = document.createTextNode("clear");
    deleteIcon.appendChild(iconText);

    console.log("div4  " + div4.id + ";");
}

//Generates wight distribution graphic
//chart1 = new CanvasJS.Chart("chartWeightDist", {
//	animationEnabled: true,
//	title:{
//		text: "Weight Distribution",
//        fontFamily: "roboto"
//	},
//	axisY :{
//		//valueFormatString: "#0,.",
//		suffix: " ton"
//	},
//	axisX: {
//		title: "Vessel Length",
//        fontFamily: "roboto"
//	},
//	toolTip: {
//		shared: true
//	},
//	data: [{        
//		type: "stackedArea",
//        markerType: "none",
//        showInLegend: true,
//		name: "LWT",
//		toolTipContent: "<span style=\"color:8064a1\"><strong>{name}: </strong></span> {y}",
//		showInLegend: true,
//		dataPoints: LWTdata
//	},
//    {        
//		type: "stackedArea",
//        markerType: "none",
//		showInLegend: true,
//		toolTipContent: "<span style=\"color:#4F81BC\"><strong>{name}: </strong></span> {y}",
//		name: "Load 1",
//		dataPoints: load1
//	},
//    { 
//		type: "stackedArea",
//        markerType: "none",
//        showInLegend: true,
//		toolTipContent: "<span style=\"color:#C0504E\"><strong>{name}: </strong></span> {y}",
//        name: "Load 2",
//		dataPoints: load2
//	},
//    { 
//		type: "stackedArea",
//        markerType: "none",
//        showInLegend: true,
//		name: "Load 3",
//		toolTipContent: "<span style=\"color:#9bbb58\"><strong>{name}: </strong></span> {y}",
//		showInLegend: true,
//		dataPoints: load3
//	},
//    { 
//		type: "stackedArea",
//        markerType: "none",
//        showInLegend: true,
//		name: "Load 4",
//		toolTipContent: "<span style=\"color:#23bfaa\"><strong>{name}: </strong></span> {y} <br><b>Total:<b> #total",
//		showInLegend: true,
//		dataPoints: load4
//	}]
//});
//chart1.render();

//Generates loads distribution graphic
chart2 = new CanvasJS.Chart("chartLoadDist", {
    animationEnabled: true,
    title: {
        text: "Load Distribution",
        fontFamily: "roboto"
    },
    axisY: {
        //valueFormatString: "#0,.",
        suffix: " kN"
    },
    axisX: {
        title: "Vessel Length",
        fontFamily: "roboto"
    },
    toolTip: {
        shared: true
    },
    data: [{
        type: "stackedArea",
        markerType: "none",
        showInLegend: true,
        name: "Load distibution",
        toolTipContent: "<span style=\"color:8064a1\"><strong>{name}: </strong></span> {y} kN",
        showInLegend: true,
        dataPoints: loadsResultant
	}]
});
chart2.render();

// generates still water bending moment graph
chart3 = new CanvasJS.Chart("chartBendMom", {
    animationEnabled: true,
    title: {
        text: "Stillwater Bending Moment",
        fontFamily: "roboto"
    },
    axisY: {
        valueFormatString: "#0,.",
        suffix: " kNm"
    },
    axisX: {
        title: "Vessel Length",
        fontFamily: "roboto"
    },
    toolTip: {
        shared: true
    },
    data: [{
            type: "area",
            markerType: "none",
            showInLegend: true,
            toolTipContent: "<span style=\"color:#4F81BC\"><strong>{name}: </strong></span> {y} kNm",
            name: "SW Bending moment",
            dataPoints: stillWaterBM
	},
        {
            type: "line",
            markerType: "none",
            showInLegend: true,
            toolTipContent: "<span style=\"color:#4F81BC\"><strong>{name}: </strong></span> {y} kN",
            name: "SW Shear force",
            dataPoints: shearForce
	}
          ]
});
chart3.render();
