// TANK CONTRUCTOR - receives compartment info 
function Tank(Compartment){
    this.compartment = Compartment;
}

// TANK PROTOTYPE
Tank.prototype = Object.create(Object.prototype);
Object.assign(Tank.prototype, {
    constructor: Tank,
    
});
