// PANEL CONSTRUCTOR
function Panel(Ship, position){
    this.Ship = Ship;
    this.position = position;           // it's supposed to be a array with 3 coordenates
   
}

// PANEL PROTOTYPE
Panel.prototype = Object.create(Object.prototype);
Object.assign(Panel.prototype, {
    constructor: Panel,
    
});