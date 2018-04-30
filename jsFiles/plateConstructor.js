
function Plate( panel, clss, compType, compartment, thickness, t_requir, corrAdd, c_a, alfa, curvature, curvRatio, bendingStress, permiStress, shearStress, plateGrade){
    this.panel = panel;
    //this.panel.a
    let a = this.panel.a;
    
    this.x_fw = x_fw;               // x position of the most foreward point of the plate [m]
    this.x_af = b + x_af;           // x position of the most foreward point of the plate [m]
    
    this.y_min = y_min;               // y position of the lower point of the plate [m]
    this.y_max = a + y_min;           // y position of the highest point of the plate [m]
    
    //this.class = clss,            // material class - program should recognize - see end note
    this.compType = "tank",         // tank || cargo hold || void || accommodation 
                                   
    this.tankContent = 'ballast',   // cargo oil || lube oil || fuel oil || liquid chemical || ballast || fresh water || RSW || mud || brine || urea || bilge || drain || chain locker || false
    this.cargoHoldContent = 'general',  // dry bulk || container || general || false
            
    this.isCompBoundary = true,     // true || false
    // structural members belong either to compartments' boundaries or ligger inside them   
    this.isCompBottom = false,      // true || false
    this.isStainlessSteel = false,  // true || false
        
    this.t = thickness;             // net required thickness [mm] // round t to the nearest half millimetre (1.3.1 pg. 93)
    this.t_ = t_requir;             // required net thickness
    this.t_vol_add = 0;             // thickness voluntarily added by the builder as extra margin, in addition to tc
    this.t_as_built = t_as_built;   // the actual thickness provided at the newbuilding stage. (pg.92) - pegar do design anterior
    
    

    this.t_gr = t + t_c; // gross required thickness [mm] (1.2.1 pg. 93) 
    this.c_a = c_a;                 // factor considering aspect ratio of plate anel
    this.alfa = a/b;  // aspect ratio of single plate field a/b
    this.beta = 1/this.alfa;        // beta = 1/alfa
    this.c_r = curvature;           // plate curvature
    this.r = curvRatio;             // plate curvature radius
    this.sigma_L = bendingStress;   // hull girder bending stress, see Sec.6 [4.4]
    this.sigma_perm = permiStress;  // permissible stress [N/mm2]
    this.tau_L = shearStress;       // shear stress due to hull girder bending, see Sec.6 [4.4] 
    
    this.grade = plateGrade;  // steel grade (dependent on class and thickness) - table 3 pg. 49

    console.log('chamou');
  console.log(this.alfa); 
}

Plate.prototype = Object.create(Object.prototype);
Object.assign(Plate.prototype, {
    constructor: Plate,
    // esse t_c ta calculando errado, revisar depios com a regra
    t_c: function (){         // total corrosion addition [mm] (1.2.1 pg. 98)
        let tc;
        let t_c1, t_c2;             // corrosion addition 1 and corrosion addition 2
        let t_res = 0.5;            // reserve thickness [mm]
        
        let t_gr_off = this.t_as_built - this.t_vol_add;
        
        if (this.compType === 'tank'){
            /*let a1 = ['cargo oil', 'liquid chemical', 'ballast', 'brine', 'ureia', 'bilge', 'drain', 'chain locker'];
            if (a1.includes(this.tankContent)) {
                
            }*/
            switch (this.tankContent){
                case 'cargo oil' || 'liquid chemical' || 'ballast' || 'brine' || 'ureia' || 'bilge' || 'drain' || 'chain locker':
                    t_c1 = 1;
                    t_c2 = 1;
                    break;
                case 'RSW' || 'mud' || 'fresh water' || 'fuel oil' || 'lube oil':
                    t_c1 = 0.5;
                    t_c2 = 0.5;
                    break;
                default:
                    alert('The content inside this tank is not defined properly.');
            }
        } else
            if(this.compType === 'cargo hold'){
                if(y_min <= 1.5){
                    t_c1 = 1;
                    t_c2 = 1;
                } else {
                    t_c1 = 0;
                    t_c2 = 0;
                }
            } else{
                t_c1 = 0;
                t_c2 = 0;
            }                
    
        if(this.isCompBoundary === true){
            tc = t_res;  // t_c becomes equal to t_res (1.2.3 pg.98)
            } else 
                if (this.isCompBoundary === false && this.isStainlessSteel === false){
                    tc = 2*t_c1 + t_res; //Total corrosion addition (1.2.2 pg.98)
                    } else 
                        if (this.isCompBoundary === "inner" && this.isStainlessSteel === true){
                            tc = t_res;  // t_c becomes equal to t_res (1.2.3 pg.98)
                        }
        
        if(tc > 0.2*t_gr_off){
            tc = t_gr_off;
        }
        
        return tc;
    }
});