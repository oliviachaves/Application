
//SG = strength group

var Materials = TAFFY([ 
    //NORMAAL STEEL
     {SG:'NV-NS', name:'VL-A', E:2.06*Math.pow(10,9), ReH: 235*Math.pow(10,6), Rm: 400*Math.pow(10,6), f_pL: 1.13475, f1: 1, k: 1},
     
     {SG:'NV-NS', name:'VL-B', E:2.06*Math.pow(10,9), ReH: 235*Math.pow(10,6), Rm: 400*Math.pow(10,6), f_pL: 1.13475, f1: 1, k: 1},
     
     {SG:'NV-NS', name:'VL-D', E:2.06*Math.pow(10,9), ReH: 235*Math.pow(10,6), Rm: 400*Math.pow(10,6), f_pL: 1.13475, f1: 1, k: 1},
     
     {SG:'NV-NS', name:'VL-E', E:2.06*Math.pow(10,9), ReH: 235*Math.pow(10,6), Rm: 400*Math.pow(10,6), f_pL: 1.13475, f1: 1, k: 1},
    
    //HIGH STRENGTH STEEL
     {SG:'NV-32', name:'VL-A 32', E:2.06*Math.pow(10,9), ReH: 315*Math.pow(10,6), Rm: 440*Math.pow(10,6), f_pL: 0.93122, f1: 1.28, k: 0.78},
     
     {SG:'NV-32', name:'VL-D 32', E:2.06*Math.pow(10,9), ReH: 315*Math.pow(10,6), Rm: 440*Math.pow(10,6), f_pL: 0.93122, f1: 1.28, k: 0.78},
     
     {SG:'NV-32', name:'VL-E 32', E:2.06*Math.pow(10,9), ReH: 315*Math.pow(10,6), Rm: 440*Math.pow(10,6), f_pL: 0.93122, f1: 1.28, k: 0.78},
     
     {SG:'NV-36', name:'VL-A 36', E:2.06*Math.pow(10,9), ReH: 355*Math.pow(10,6), Rm: 490*Math.pow(10,6), f_pL: 0.92019, f1: 1.39, k: 0.72},
     
     {SG:'NV-36', name:'VL-D 36', E:2.06*Math.pow(10,9), ReH: 355*Math.pow(10,6), Rm: 490*Math.pow(10,6), f_pL: 0.92019, f1: 1.39, k: 0.72},
     
     {SG:'NV-36', name:'VL-E 36', E:2.06*Math.pow(10,9), ReH: 355*Math.pow(10,6), Rm: 490*Math.pow(10,6), f_pL: 0.92019, f1: 1.39, k: 0.72},
     
     {SG:'NV-40', name:'VL-A 40', E:2.06*Math.pow(10,9), ReH: 390*Math.pow(10,6), Rm: 510*Math.pow(10,6), f_pL: 0.87180, f1: 1.47, k: 0.66},
     
     {SG:'NV-40', name:'VL-D 40', E:2.06*Math.pow(10,9), ReH: 390*Math.pow(10,6), Rm: 510*Math.pow(10,6), f_pL: 0.87180, f1: 1.47, k: 0.66},
     
     {SG:'NV-40', name:'VL-E 40', E:2.06*Math.pow(10,9), ReH: 390*Math.pow(10,6), Rm: 510*Math.pow(10,6), f_pL: 0.87180, f1: 1.47, k: 0.66},
    
    ]);

/*MATERIALS

Strenght groups:
— NV-NS denotes normal strength structural steel with yield point not less than 235 N/mm2
— NV-27 denotes high strength structural steel with yield point not less than 265 N/mm2
— NV-32 denotes high strength structural steel with yield point not less than 315 N/mm2
— NV-36 denotes high strength structural steel with yield point not less than 355 N/mm2
— NV-40 denotes high strength structural steel with yield point not less than 390 N/mm2.

Selcted materials, names and properties are defined by Table 1 pg. 47

ReH is the yield stress [Pa].           See '2.14.1 Yield stress ReH'
Rm is the tensile strength [Pa].        See '2.14.2 Tensile strength Rm'
E is the modulus of elasticity [Pa].    See '2.14.3 Modulus of Elasticity E'

f_pL is a coefficient defined as Rm/1.5*ReH, and it's equals to 1 for isotropic materials. 

*/

var Stiffeners =[ 
                                                  // z [cm3]      [mm2]
    {profile:'HP', dimen:'180x9',  name:'HP 180x9',  z:166, area: 2339},
    {profile:'HP', dimen:'200x11', name:'HP 200x11', z:233, area: 2766},
    
    {profile:'HB', dimen:'120x8',  name:'HB 180x8',  z:197, area: 1886},
    {profile:'HB', dimen:'180x9',  name:'HB 180x9',  z:203, area: 2066},
    {profile:'HB', dimen:'220x10', name:'HB 220x10', z:329, area: 2900},
    {profile:'HB', dimen:'220x12', name:'HB 220x12', z:362, area: 3340},
    
    ];

//safety factors (table 1 pg. 123) - needs revisao
var SF = {                  //(pg.58)
    gama_m: 1.15,        //partial safety factor for structural resistance 
    gama_stat: 1.05,     //partial safety factor for static load components
    gama_dynam: 1.25,    //partial safety factor for dynamic load components
    
}