

Ship.prototype.fillInParam = function () {

    document.getElementById('L').value = this.L;
    document.getElementById('B').value = this.B;
    document.getElementById('D').value = this.D;
    document.getElementById('T').value = ((this.LWT+this.DWT)/(this.L*this.B*this.Cb*g)).toPrecision(3);
       
    document.getElementById('LWT').value = this.LWT;
    document.getElementById('DWT').value = this.DWT;
    document.getElementById('l').value = this.l;
    document.getElementById('s').value = this.s;
    document.getElementById('DB_height').value = this.DB_height;
}
ship.fillInParam();


Ship.prototype.updateParam = function (id){
    console.log(id);
    console.log(this[id]);
    this[id] = Number(document.getElementById(id).value);
    console.log(this[id]);
    this.updateCrossSection();
    
    switch (id){  
        case 'L':
            console.log('entrou LOA');
            load1.slice(0, this.L/2);
            load2.slice(0, this.L/2);
            
            slider1.noUiSlider.destroy();
            for( let counter=1; counter < 3; counter++){
            this['slider'+counter] = document.getElementById('sliderLoadDist'+counter);
                this['slider'+counter].style.marginTop = "8%";
                noUiSlider.create(this['slider'+counter], {
                    start: [ 0, 0 ],
                    step: 2,
                    tooltips: true,
                    connect: true,
                    range: {
                        'min': [0],
                        'max': [ship.L]
                    },
                    format: wNumb({decimals: 0, postfix: ' m'})  
                });

            // holds the data series for slide(counter)
            this["load"+counter] = [];
            for(let i=0; i<Math.ceil(ship.L/2)+1;i++){
                this["load"+counter][i] = {x:2*i, y:10};
            }
        }
            
            break;
        
    }
    console.log('saiu do switch')

}

