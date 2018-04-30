// BOTTOM CONSTRUCTOR
function Bottom( Ship, position, ){
    this.Ship = Ship;
    this.position = position;           // it's supposed to be a array with 3 coordenates
    
}

// BOTTOM PROTOTYPE
Bottom.prototype = Object.create( Object.prototype );
Object.assign( Bottom.prototype, {
    constructor: Bottom,
    
});