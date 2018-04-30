// BULKHEAD CONSTRUCTOR
function Bulkhead(Ship, position, ){
    this.Ship = Ship;
    this.position = position;           // it's supposed to be a array with 3 coordenates
    
}

// BULKHEAD PROTOTYPE
Bulkhead.prototype = Object.create(Object.prototype);
Object.assign(Bulkhead.prototype, {
    constructor: Bulkhead,
    
});