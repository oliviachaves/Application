//GLOBAL 
var rho = 1.025;         //ton/m3
var g = 9.81;            // m/s2 

var coeff = {
    f_nℓ_h: 1,         // (chap.4 - sec.4 - 3.1.1)
    f_R: 0.85,          // (chap.4 - sec.4 - 3.3.1)
    f_vib: 1.1,         // (chap.4 - sec.4 - 3.3.1)
    f_fa: 0.85,         // fatigue coeff (chap.4 - sec.4 )
    f_ps: 0.8,          // coeff for strength assessment (chap.4 - sec.3 )   
}


// SHIP CONSTRUCTOR 
function Ship( L, B, D, Cb, DWT, LWT, s, l ){
    this.L = L;             // length between perpendculars [m]
    this.B = B;             // beam on the water line [m] 
    this.D = D;             // from baseline to main deck [m]
    this.Cb = Cb;
    
    this.DWT = DWT;
    this.LWT = LWT;
    
    this.T = this.calcDraft();   // scantlings draught [m]
    
    this.s = s; //[m]
    this.l = l; //[m]
    
    this.DB_height = 1.5; //[m]
    this.hatchOpening = 5, // [m]
    
    this.C_w = 0.0856*L; // wave coefficient for L < 90 ( chap. 4 - sec.4)
    
    this.crossSection = [
        {
            structure: 'side',
            orientation: 'vertical',
        },
        {
            structure: 'bottom',
            orientation: 'horizontal',
        },
        {
            structure: 'Dbottom',
            orientation: 'horizontal',
        },
        {
            structure: 'centerKeel',   
            orientation: 'vertical',
        },
        {
            structure: 'deck',
            orientation: 'horizontal',
   
        },
        {
            structure: 'hatchCoaming',
            orientation: 'vertical',
        
        }];
    
    

}


// SHIP PROTOTYPE
Ship.prototype = Object.create(Object.prototype);
Object.assign(Ship.prototype, {
    constructor: Ship,
    
    displacement() {
        return Math.ceil(this.LOA*this.B*this.T*this.Cb*rho); // [ton]
    },
    
    calcDraft(){
      return ((this.LWT+this.DWT)*1000/(this.L*this.B*this.Cb*g*rho)).toPrecision(3)  
    },
    
    
// ---------------- CROSS SECTION CALCULATIONS ------------------------ //

   updateCrossSectionThicknesses(){
        
        let t = this.t_eq();
        
        this.crossSection[0].width = t;         //[m] 
        this.crossSection[1].height = t;        //[m]
        this.crossSection[2].height = t;        //[m]
        this.crossSection[3].width = t;         //[m] 
        this.crossSection[4].height = t;        //[m]
        this.crossSection[5].width = t;         //[m]        
    },
    
    updateCrossSectionHeights(){
        this.crossSection[0].height = this.D;   //[m]
        this.crossSection[1].width = this.B;    //[m]
        this.crossSection[2].width = this.B;    //[m]
        this.crossSection[3].height = this.DB_height - this.crossSection[2].height; //[m]
        this.crossSection[4].width = this.B - this.hatchOpening; //[m]
        this.crossSection[5].height = 0.5;      //[m]
    },
    
    updateCrossSectionH_BL(){
        
        this.crossSection[0].h_BL = this.D/2;                                           //[m]
        this.crossSection[1].h_BL = this.crossSection[1].height/2;                      //[m]
        this.crossSection[2].h_BL = this.DB_height + this.crossSection[2].height/2;     //[m]
        this.crossSection[3].h_BL = this.DB_height/2 + this.crossSection[2].height;     //[m]
        this.crossSection[4].h_BL = this.D - this.crossSection[4].height;               //[m]
        this.crossSection[5].h_BL = this.D;                                             //[m]
    },
    
    z_n_n50() {    // calculates cross section area, inertia and height of neutral axis
        
        let tot_area = 0;
        let tot_h_BLxArea = 0;
        let h_NA;  // height from the BL to the neutral Axis (NA) [m]
        
        // calculating area and area*BL_height
        for (let i=0 ; i< this.crossSection.length ; i++){
            let n;
            if (this.crossSection[i].structure === 'hatchCoaming' || this.crossSection[i].structure === 'side' ){
                n = 2; //times 2 because there are 2 sides and 2 hatchCoamings
            } else {
                n = 1;
            }
            this.crossSection[i].area = n*(this.crossSection[i].width*this.crossSection[i].height);     //[m]*[m] = [m2]
            this.crossSection[i].h_BLxArea = this.crossSection[i].area*this.crossSection[i].h_BL;       //[m2]*[m] = [m3]
            
            tot_area += this.crossSection[i].area;              // [m2]
            tot_h_BLxArea += this.crossSection[i].h_BLxArea;    // [m3]

            }
        // calculating height of neutral axis
        h_NA = tot_h_BLxArea/tot_area;      // [m3]/[m2] = [m]
        this.crossSection.z_n_n50 = h_NA;   // Z coordinate of horizontal neutral axis of the hull transverse section with net scantlings [m]
        
        for (let i=0 ; i< this.crossSection.length ; i++){
            this.crossSection[i].d = Math.abs(this.crossSection[i].h_BL - h_NA);   //[m] - [m] = [m]            
        }
    },
    
    I_y_n50(){
        let Iyy_t = 0;
        // calculating section's moment of Inertia 
        for (let i=0 ; i< this.crossSection.length ; i++){
            let inert = this.crossSection[i].width*Math.pow(this.crossSection[i].height, 3)/12 + this.crossSection[i].width*this.crossSection[i].height*Math.pow(this.crossSection[i].d, 2); //[m]*[m]^3 + [m]*[m]*[m]^2 = [m4]
            this.crossSection[i].Iyy = inert; // [m4]
            Iyy_t += inert;
        }
        this.crossSection.I_y_n50 = Iyy_t; // net moment of inertia of the hull transverse section about its horizontal neutral axis [m4]  
    },
    
    buildCrossSection(){
        this.updateCrossSectionThicknesses();
        this.updateCrossSectionHeights();
        this.updateCrossSectionH_BL();
        this.z_n_n50();
        this.I_y_n50();
        console.log(this.crossSection);
    },
    
    Z_B(){
        return this.crossSection.I_y_n50/this.crossSection.z_n_n50;
    },
    Z_D(){
        console.log('inercia: ' + this.crossSection.I_y_n50);
        console.log('section modulus: ' + this.crossSection.z_n_n50);
        return this.crossSection.I_y_n50/(this.D - this.crossSection.z_n_n50);
    },
    
    f2(){
        this.crossSectionCalc();
        let z_B = this.Z_B();
        let z_D = this.Z_D();
        
        if ( typeof z_B === 'number' && typeof z_D === 'number'){
            if ( z_B > z_D ){
                return 5.7*(this.M_wo_max() + this.M_so_max())/(z_D*1000000); //Z_D has to be in cm3
            } else {
                return 5.7*(this.M_wo_max() + this.M_so_max())/(z_B*1000000); //Z_B has to be in cm3
            }
        } else {
                alert('there is something wrong with the Z_B or Z_D calculations')
            }    
    },
    
    //while f2 is still bigger than 1, the equivalent plate thickness must be increased at specific points so that the section moduls (bottom and/or deck) is sufficiently great to generate a f2 smaller than 1
    findMinPlateThickForHullGirderStrength(){
        
        while (this.f2() > 1){
            console.log('f2: ' + this.f2());
            console.log('Z_D: ' + this.Z_D());
            console.log('Z_D: ' + this.Z_B());
            console.log('hatch coaming: ' + this.crossSection[0].width);
            console.log('deck t: ' + this.crossSection[4].height);
            console.log('side t: ' + this.crossSection[0].width);
            
            if(this.Z_D() < this.Z_B()){
                if (this.crossSection[5].width < 0.003){ // check what the better way to limit hatch coaming thickness is
                        this.crossSection[5].width = this.crossSection[5].width*1.1 // 10% increment
                        this.crossSectionCalc();
                        
                }
                if (this.crossSection[4].height/this.crossSection[0].width < 1.4){
                    this.crossSection[4].height = this.crossSection[4].height*1.1; // 10% increment
                    this.crossSectionCalc();
                    
               
                } else {
                    this.crossSection[0].width = this.crossSection[0].width*1.1; // 10% increment
                    this.crossSectionCalc();
                    
                }
           } else {
               
           }
       }
        
    },
    
    
// ----- CHAPTER 4 - SECTION 3: Ship Motion and Accelerations ----- //
    f_T(T) {    //ratio between draught at a loading condition (T) and scantling draught (this.T)
        let f_T = T/this.T;
        if( f_T > 0.5 ){
            return f_T;
        } else {
            return 0.5;
        }
    },
    
// ----- CHAPTER 4 - SECTION 4: Still Water Hull Girder Loads ----- //
    f_sw() {  //distribution factor along the ship length (2.2.1)
       
        let f_sw = [];
       
            for (let x=0; x <= this.L; x=x+2){
            
                if(x/this.L <= 0.1){
                    f_sw.push(new loadsArray( x, 1.5*(x/this.L)));
                } else
                    if (x/this.L <= 0.3){
                        f_sw.push(new loadsArray( x, 4.25*(x/this.L) - 0.275));
                    } else 
                        if(x/this.L <= 0.7){
                            f_sw.push(new loadsArray( x, 1));
                        } else
                            if(x/this.L <= 0.9){
                                f_sw.push(new loadsArray( x, -4.25*(x/this.L) + 3.975));
                            } else
                                if(x/this.L <= 1){
                                    f_sw.push(new loadsArray( x, -1.5*(x/this.L) + 1.5));
                                } else{
                                    alert("there is something wrong with the f_ws factor from the still water bending moment.");
                                }
            }
            return f_sw;
    },
    f_qs() { // distribution factor along the ship length - shear moment  
        for (let x=0; x <= this.L; x=+2){
            if(x/this.L <= 0.15){
                f_qs.push(new loadsArray( x, 6.667*(x/this.L)));
            }else
                if (x/this.L <= 0.3){
                    f_qs.push(new loadsArray( x, 1));
                } else 
                    if(x/this.L <= 0.4){
                        f_qs.push(new loadsArray( x, -2*(x/this.L) + 1.6));
                    } else
                        if(x/this.L <= 0.6){
                            f_qs.push(new loadsArray( x, 0.8));
                        } else
                            if(x/this.L <= 0.7){
                                f_qs.push(new loadsArray( x, 2*(x/this.L) - 0.4));
                            } else
                                if(x/this.L <= 0.85){
                                    f_qs.push(new loadsArray( x, 1));
                                } else
                                    if(x/this.L <= 1){
                                        f_qs.push(new loadsArray( x, -6.667*(x/this.L) + 6.667));
                                    } else{
                                        alert("there is something wrong with the f_qs factor from the still water bending moment.");
                                    }
        }
        return f_qs;
    },
    f_m(analysisType, loadCondition) {  // distribution factor along the ship length (3.3.1); LoadCondition can assume 'full load' || 'ballast'
     
        let f_m = [];
        if( analysisType === "strength"){
            
            for (let x=0; x <= this.L; x+=2){

                if(x/this.L <= 0.4){
                    f_m.push(new loadsArray( x, 2.5*(x/this.L)));
                } else
                    if (x/this.L <= 0.65){
                        f_m.push(new loadsArray( x, 1 ));
                    } else 
                        if(x/this.L <= 1){
                            f_m.push(new loadsArray( x, -2.5*(x/this.L) + 2.857 ));
                        } else{
                            alert("there is something wrong with the f_m factor.");
                        }
            }
            return f_m;
        } else 
        if( analysisType === "fatigue" && loadCondition == 'full load'){
                for (let x=0; x <= this.L; x+=2){
                    if(x/this.L <= 0.05){
                        f_m.push(new loadsArray( x, 1*(x/this.L)));
                    } else
                    if (x/this.L <= 0.1){
                        f_m.push(new loadsArray( x, 1.8*(x/this.L) - 0.04 ));
                    } else 
                    if(x/this.L <= 0.3){
                        f_m.push(new loadsArray( x, 3*(x/this.L) - 0.16 ));
                    } else
                    if(x/this.L <= 0.35){
                        f_m.push(new loadsArray( x, 2.4*(x/this.L) - 0.04 ));
                    } else
                    if(x/this.L <= 0.4){
                        f_m.push(new loadsArray( x, 1.6*(x/this.L) + 0.38 ));
                    } else
                    if(x/this.L <= 0.45){
                        f_m.push(new loadsArray( x, 1*(x/this.L) + 0.54 ));
                    } else
                    if(x/this.L <= 0.5){
                        f_m.push(new loadsArray( x, 0.2*(x/this.L) + 0.9 ));
                    } else
                    if(x/this.L <= 0.55){
                        f_m.push(new loadsArray( x, -1*(x/this.L) + 1.5 ));
                    } else
                    if(x/this.L <= 0.6){
                        f_m.push(new loadsArray( x, -1.6*(x/this.L) + 1.83 ));
                    } else
                    if(x/this.L <= 0.65){
                        f_m.push(new loadsArray( x, -2.4*(x/this.L) + 2.31 ));
                    } else
                    if(x/this.L <= 0.85){
                        f_m.push(new loadsArray( x, -3*(x/this.L) + 2.7 ));
                    } else
                    if(x/this.L <= 0.9){
                        f_m.push(new loadsArray( x, -1.8*(x/this.L) + 1.68 ));
                    } else
                    if(x/this.L <= 1){
                        f_m.push(new loadsArray( x, -1.044*(x/this.L) + 0.6 ));          
                    } else {
                    alert("there is something wrong with the f_m factor.");
                    } 
                }         
                return f_m;            
        } else
        if( analysisType === "fatigue" && loadCondition == 'ballast'){
                for (let x=0; x <= this.L; x+=2){
                    if(x/this.L <= 0.15){
                        f_m.push(new loadsArray( x, 1*(x/this.L)));
                    } else
                    if (x/this.L <= 0.2){
                        f_m.push(new loadsArray( x, 2*(x/this.L) - 0.15 ));
                    } else 
                    if(x/this.L <= 0.4){
                        f_m.push(new loadsArray( x, 2.9*(x/this.L) - 0.33 ));
                    } else
                    if(x/this.L <= 0.45){
                        f_m.push(new loadsArray( x, 2*(x/this.L) + 0.03 ));
                    } else
                    if(x/this.L <= 0.5){
                        f_m.push(new loadsArray( x, 1*(x/this.L) + 0.48 ));
                    } else
                    if(x/this.L <= 0.55){
                        f_m.push(new loadsArray( x, 0.4*(x/this.L) + 0.78 ));
                    } else
                    if(x/this.L <= 0.6){
                        f_m.push(new loadsArray( x, -1.4*(x/this.L) + 1.77 ));
                    } else
                    if(x/this.L <= 0.65){
                        f_m.push(new loadsArray( x, -2*(x/this.L) + 2.13 ));
                    } else
                    if(x/this.L <= 0.7){
                        f_m.push(new loadsArray( x, -3*(x/this.L) + 2.78 ));
                    } else
                    if(x/this.L <= 0.85){
                        f_m.push(new loadsArray( x, -3.4*(x/this.L) + 3.06 ));
                    } else
                    if(x/this.L <= 0.9){
                        f_m.push(new loadsArray( x, -2*(x/this.L) + 1.87 ));
                    } else
                    if(x/this.L <= 1){
                        f_m.push(new loadsArray( x, -0.7*(x/this.L) + 0.7 ));          
                    } else {
                    alert("there is something wrong with the f_m factor.");
                    }     
                }         
                return f_m;  
        } else {
            alert('there is a typo in the argument calling the ship.f_m() method');
        }
    },
    f_p(analysisType, T) { // (3.3.1); LoadCondition can assume 'full load' || 'ballast'. T is the draught at the analyzed load condition.
    
        if( analysisType === 'strength' && typeof T === 'number' ){  
            return coeff.f_ps;
        } else
        if( analysisType === 'fatigue' && typeof T === 'number' ){
            return coeff.f_fa*coeff.f_vib*(0.27 - (6 + 4*this.f_T(T))*this.L/100000);
        } else {
            alert('there is a typo in the argument calling the ship.f_p() method');
        }
        
    },
    f_nℓ_s( analysisType ){  // (3.1.1)
        
        if( analysisType === 'strength' ){  
            return 0.58*((this.Cb + 0.7)/this.Cb);
        } else
        if( analysisType === 'fatigue' ){
            return 1;
        } else {
            alert('there is a typo in the argument calling the ship.f_p() method');
        }
        
    }, 
    M_wv_h( analysisType, loadCondition, T ){  // Vertical wave bending moment [kNm] in hogging (3.1.1). T is the draught at the analyzed load condition.
        
        let f_m = this.f_m( analysisType, loadCondition );
        let f_p = this.f_p( analysisType, T );
        let f_nℓ_vh = coeff.f_nℓ_h;
        
        let M =[];
        for( let x=0 ; x<=this.L/2 ; x+=1){
            
            let m = 0.19*coeff.f_R/0.85*f_nℓ_vh*f_m[x].y*f_p*this.C_w*this.L*this.L*this.B*this.Cb;
            M.push(new loadsArray( 2*x , m ));
        }
        
        return M; 
    },
    M_wv_s( analysisType, loadCondition, T ){ // Vertical wave bending moment [kNm] in sagging (3.1.1). T is the draught at the analyzed load condition. 
        
        let f_m = this.f_m( analysisType, loadCondition );
        let f_p = this.f_p( analysisType, T );
        let f_nℓ_vs = this.f_nℓ_s( analysisType );
        
        let M =[];
        for( let x=0 ; x<=this.L/2 ; x+=1){
            
            let m =  -0.19*coeff.f_R/0.85*f_nℓ_vs*f_m[x].y*f_p*this.C_w*this.L*this.L*this.B*this.Cb;
            M.push(new loadsArray( 2*x , m ));
        }
        
        return M;
    },
    M_wv_h_mid( analysisType ){
        
        if ( analysisType === 'strength' ){
            
            return 0.19*coeff.f_R/0.85*coeff.f_nℓ_h*1*1*this.C_w*this.L*this.L*this.B*this.Cb;
        
        } else {
            alert('there is something wrong with the argument calling the ship.M_wv_h_mid() method');
        }
    },
    M_wv_s_mid( analysisType ){
        
        if ( analysisType === 'strength' ){
            
            let f_nℓ_vs = this.f_nℓ_s( analysisType );
            return -0.19*coeff.f_R/0.85*f_nℓ_vs*1*1*this.C_w*this.L*this.L*this.B*this.Cb;
        
        } else {
            alert('there is something wrong with the argument calling the ship.M_wv_s_mid() method');
        }
    },
    M_sw_h_min( analysisType ) { // minimum still water bending moment in hogging condition (2.2.1)
        
        let M_mid = this.M_wv_h_mid( analysisType );
        let f_sw = this.f_sw();
        let M = [];
        
        for (let i=0 ; i<=this.L/2 ; i++ ){

            let m = f_sw[i].y*(171*this.C_w*this.L*this.L*this.B*(this.Cb+0.7)/1000 - M_mid); // [kNm]
            M.push( new loadsArray ( i*2 , m ));
        } 
        return M;
    }, 
    M_sw_s_min( analysisType ) { // minimum still water bending moment in sagging condition (2.2.1)
       
        let M_mid = this.M_wv_s_mid( analysisType );
        let f_sw = this.f_sw();
        let M = [];
        
        for (let i=0 ; i<this.L/2 ; i++ ){
            let m = -0.85*f_sw[i]*(171*this.C_w*this.L*this.L*this.B*(this.Cb+0.7)/1000 - M_mid); // [kNm]
            M.push( new loadsArray ( i*2 , m ));
        }
        
        return M;
    },
    M_sw_min( analysisType ) { // absolute maximum of Msw-h-min and Msw-s-min with fsw = 1.0
        
        let M_s_mid = this.M_wv_s_mid( analysisType );
        let M_h_mid = this.M_wv_h_mid( analysisType );
        
        let M_h = (171*this.C_w*this.L*this.L*this.B*(this.Cb+0.7)/1000 - M_h_mid);         // hogging [kNm]
        let M_s = 0.85*(171*this.C_w*this.L*this.L*this.B*(this.Cb+0.7)/1000 - M_s_mid);   // sagging [kNm]
        
        if(M_h <= M_s){
            return M_s;
        } else {
            return M_h;
        }
    },
    Q_sw_pos_min( analysisType ) {// minimum positive still water shear force
        
        let M_sw_min = this.M_sw_min( analysisType );
        let Q =[];
        
        for( let i=0 ; i<=this.L/2 ; i+=1){
            
            let q =  (5*f_qs[i]*M_sw_min)/this.L;
            Q.push(new loadsArray( 2*i , q ));
        }
        
        return Q;
    },
    Q_sw_neg_min( analysisType ){// minimum negative still water shear force
        
        let M_sw_min = this.M_sw_min( analysisType );
        let Q =[];
        
        for( let i=0 ; i<=this.L/2 ; i+=1){
            
            let q =  (-5*f_qs*M_sw_min)/this.L;
            Q.push(new loadsArray( 2*i , q ));
        }
        
        return Q;
    },
    
   ////////////////////////////////////////////////////////////
   //                    Arne Jan                           //
   ///////////////////////////////////////////////////////////
    
    M_so_h() { // minimum still water bending moment in hogging condition to Arne Jan
        return this.C_w*this.L*this.L*this.B*(0.1225 -  0.015*this.Cb);
    }, 
    M_so_s() { // minimum still water bending moment in sagging condition to Arne Jan
        
        return -0.065*this.C_w*this.L*this.L*this.B*(this.Cb+0.7); // [kNm]        
    },
    M_so_max() { // absolute maximum of Msw-h-min and Msw-s-min with fsw = 1.0
        
        let m = [];
        for ( i=0 ; i<stillWaterBM.length ; i++){
            m.push(stillWaterBM[i].y);
        }

        let M_sw = Math.max(...m);
        let M_h = this.M_so_h();   // hogging [kNm]
        let M_s = this.M_so_s();   // sagging [kNm]

        return Math.max( M_h, Math.abs(M_s), M_sw)
    },
    M_wo_h(){
        return 0.19*this.C_w*this.L*this.L*this.B*this.Cb;
    },
    M_wo_s(){
        return -0.11*this.C_w*this.L*this.L*this.B*(this.Cb+0.7);
    },
    M_wo_max() { // absolute maximum of Msw-h-min and Msw-s-min with fsw = 1.0
        
        let M_h = this.M_wo_h();   // hogging [kNm]
        let M_s = this.M_wo_s();   // sagging [kNm]

        return Math.max( M_h, Math.abs(M_s));
    },
    
// ----- CHAPTER 4 - SECTION 5: External Loads ---------------//
    p_bottom(){
        return this.T*g*rho; // [m]*[m/s2]*[tons/m2] = [N/m] ????
    },
        
// ----- CHAPTER 5 - SECTION 3: Hull Girder Yield Check ----- //
    
    σ_sw_h( analysisType ) {    // Longitudinal stress induced by still water vertical hull girder bending (4.1.1)
        
        ship.crossSectionCalc();
        
        if ( analysisType === 'strength' || analysisType === 'fatigue'){
            
            let σ_sw_h =[];
            // getting the highest absolute value of the still water bending moment calculated out of the loads inputs
            let SWBM_y = [];
            for (let i=0 ; i < stillWaterBM.length ; i++ ){
                SWBM_y.push( Math.abs(stillWaterBM[i].y) );
            }
            let SWBM_max = Math.max(...SWBM_y);
            
            // getting the highest absolute value of the MINIMUM still water bending moment defined in the rules ( chap.4 - sec.4 - 2.2.1) 
            let SWBM_min = this.M_sw_h_min( analysisType );
            let SWBM_min_y = [];
            for (let i=0 ; i < SWBM_min.length ; i++ ){
                SWBM_min_y.push( Math.abs(SWBM_min[i].y) );
            }
            let SWBM_min_highest = Math.max(...SWBM_min_y);
            
            console.log(SWBM_min_highest);  
            console.log(SWBM_max);  
              
            // verifying if the inputs are valid
            if ( typeof SWBM_max === 'number' && typeof SWBM_min_highest === 'number' ){
                // getting the highest among the highests
                if ( SWBM_min_highest > SWBM_max){
                    SWBM_max = SWBM_min_highest;
                }
                
                console.log(this.crossSection.I_y_n50);
                console.log(this.crossSection.z_n_n50);
                
                for ( let z=0 ; z<= this.D ; z+= 0.5){
                    let σ = (SWBM_max/this.crossSection.I_y_n50*(z - this.crossSection.z_n_n50)/1000);
                    σ_sw_h.push({ z , σ });
                }
                
                console.log(σ_sw_h);
     
            } else {
                alert('something is wrong with ship.σ_sw_h()')
            }
                
            
            
   

        } else {
            alert('there is something wrong with the argument calling the ship.σ_sw_h() method');
        }
        
    },
    σ_sw_s( analysisType ) {    // Longitudinal stress induced by still water vertical hull girder bending (4.1.1)
                
        
        
        return ;
    },    
    σ_hg( analysisType ) {    
        
        
        return ;
    },
    
   ////////////////////////////////////////////////////////////
   //                    Arne Jan                            //
   ///////////////////////////////////////////////////////////
    
    σ_allow(){   //yield stress divided by safety factor     
      return 235/1.5*1000000; //[N/m2]
    },
    
// ----- CHAPTER 6 - SECTION 4: Minimum thickness -----------//
    
    ////////////////////////////////////////////////////////////
   //                    Arne Jan                            //
   ///////////////////////////////////////////////////////////
    
    t(){ //plate thickness
        return this.s/2*Math.sqrt(this.p_bottom()/this.σ_allow()); // [m]*[N/m2/]/[N/m2] = [m]                    
    },
    
// ----- CHAPTER 6 - SECTION 5: Stiffeners -----------//
    
    ////////////////////////////////////////////////////////////
   //                    Arne Jan                            //
   ///////////////////////////////////////////////////////////
    
    M_stiff(){  // maximium moment acting on stiffeners cross section
        return this.p_bottom()*this.s*this.l*this.l/12; // [N/m2]*[m]*[m]*[m] = [Nm]
    },
    Z_stiff(){
        return this.M_stiff()/this.σ_allow(); // [Nm]/[N/m2] = [m3]
    },
    
    find_stiff(){
        
        let minZ = this.Z_stiff()*1000000; //[m3] -> [cm3]
        let hold = Stiffeners[Stiffeners.length-1];
        for ( i=0 ; i<Stiffeners.length ; i++){
            if( Stiffeners[i].z > minZ && Stiffeners[i].z < hold.z){
                hold = Stiffeners[i];  
            }
        }
        return hold;
    },
    t_eq(){
        let stiff = this.find_stiff();
        let t_eq = this.t() + (stiff.area/1000000)/(this.s); // [m] + [m2]/[m] = [m]
        //                        [mm2] -> [m2]
        
        //replaceing old values of t_eq
        for ( i=0 ; i < this.crossSection.length ; i++){
            if ( this.crossSection[i].orientation === 'vertical'){
                this.crossSection[i].width = t_eq;       // [m]
            } else
                if ( this.crossSection[i].orientation === 'horizontal' ){
                    this.crossSection[i].height = t_eq;  // [m]
                } else {
                    alert('there is something wrong with the plate orientation definition inside the crossSection object');
                }
            }
        return t_eq; // [m]
    },
    
});

var ship = new Ship (112, 22, 11, 0.9, 66280, 60000, 0.650, 2.4 ); 
                //   [m]  [m] [m]  []   [N]    [N]    [m]   [m]
   


