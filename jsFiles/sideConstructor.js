// SIDE CONSTRUCTOR
function Side(Ship){
    this.Ship = Ship;
    this.position = position;           // it's supposed to be a array with 3 coordenates
    
                      
}

// SIDE PROTOTYPE
Side.prototype = Object.create(Object.prototype);
Object.assign(Side.prototype, {
    constructor: Side,
    
});