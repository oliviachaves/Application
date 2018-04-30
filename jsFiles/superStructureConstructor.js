// SUPER STRUCTURE CONSTRUCTOR
function SuperStructure( Ship, position ){
    this.Ship = Ship;
    this.position = position;           // it's supposed to be a array with 3 coordenates

}

// SUPER STRUCTURE PROTOTYPE
SuperStructure.prototype = Object.create(Object.prototype);
Object.assign(SuperStructure.prototype, {
    constructor: SuperStructure,
    
});