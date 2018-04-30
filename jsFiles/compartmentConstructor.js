// COMPARTMENT CONSTRUCTOR
function Compartment(Ship, position, type, content){
    this.Ship = Ship;
    this.position = position;           // it's supposed to be a array with 3 coordenates
    this.type = type;                   // tank || cargo hold || void || accommodation 
                                   
    this.content = content;
}

// COMPARTMENT PROTOTYPE
Compartment.prototype = Object.create(Object.prototype);
Object.assign(Compartment.prototype, {
    constructor: Compartment,
    
});

//-------------------------------------------------------------------------
// TANK CONTRUCTOR - receives compartment info
function Tank(Compartment){
    this.compartment = Compartment;
}

// TANK PROTOTYPE
Tank.prototype = Object.create(Object.prototype);
Object.assign(Tank.prototype, {
    constructor: Tank,
    
});

//-------------------------------------------------------------------------
// CARGO HOLD CONTRUCTOR - receives compartment info
function CargoHold(Compartment){
    this.compartment = Compartment;
}

// CARGO HOLD PROTOTYPE
CargoHold.prototype = Object.create(Object.prototype);
Object.assign(CargoHold.prototype, {
    constructor: CargoHold,
    
});


//-------------------------------------------------------------------------
// VOID - receives compartment info
function Void(Compartment){
    this.compartment = Compartment;
}


Void.prototype = Object.create(Object.prototype);
Object.assign(Void.prototype, {
    constructor: Void,
    
});