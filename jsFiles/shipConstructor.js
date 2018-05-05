//GLOBAL 
var rho = 1.025; //ton/m3
var g = 9.81; // m/s2 

var coeff = {
    f_nℓ_h: 1, // (chap.4 - sec.4 - 3.1.1)
    f_R: 0.85, // (chap.4 - sec.4 - 3.3.1)
    f_vib: 1.1, // (chap.4 - sec.4 - 3.3.1)
    f_fa: 0.85, // fatigue coeff (chap.4 - sec.4 )
    f_ps: 0.8, // coeff for strength assessment (chap.4 - sec.3 )

    f_har: 0.5, // correction factor for harbour/sheltered water conditions (chap.5 - sec.2 )
}

function loadsArray(x, y) {
    this.x = x;
    this.y = y;
}


// SHIP CONSTRUCTOR 
function Ship(L, B, D, Cb, DWT, LWT, s, l) {
    this.L = L; // length between perpendculars [m]
    this.B = B; // beam on the water line [m] 
    this.D = D; // from baseline to main deck [m]
    this.Cb = Cb;

    this.DWT = DWT;
    this.LWT = LWT;

    this.T = this.calcDraft(); // scantlings draught [m]

    this.DB_height = 1.5; //[m]
    this.hatchOpening = 5; // [m]

    this.serviceAreaNotation = 'R0';
    this.material = Materials({
        SG: "NV-NS"
    }).first();

    this.C_w = 0.0856 * this.L; // wave coefficient for L < 90 ( chap. 4 - sec.4)
    
    this.loadCondition = 'full load';

    this.hullGirder = {
            s: s, //[m]                
            l: l, //[m]
            loads: [],               
            crossSection: [
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

                }]
    };

}


// SHIP PROTOTYPE
Ship.prototype = Object.create(Object.prototype);
Object.assign(Ship.prototype, {
    constructor: Ship,

    displacement() {
        return Math.ceil(this.LOA * this.B * this.T * this.Cb * rho); // [ton]
    },

    calcDraft() {
        let T = ((this.LWT + this.DWT) / (this.L * this.B * this.Cb * rho * g)).toPrecision(3);
        this.T = T;
        document.getElementById('T').value = T;
        return T;
    },

    // ----- CHAPTER 5 - SECTION 2: Vertical Hull Girder BM and Shear Strength ----- //

    σ_perm() {

        let σ_perm = [];

        for (let x = 0; x <= this.L; x += 2) {
            if (x <= 0.1 * this.L) {
                σ_perm.push(new loadsArray(x, 130 / this.material.k));
            } else {
                if (x < 0.3 * this.L) {
                    σ_perm.push(new loadsArray(x, 275 * x / (this.material.k * this.L) + 102.5 / this.material.k));
                } else {
                    if (x <= 0.7 * this.L) {
                        σ_perm.push(new loadsArray(x, 185 / this.material.k));
                    } else {
                        if (x < 0.9 * this.L) {
                            σ_perm.push(new loadsArray(x, -275 * x / (this.material.k * this.L) + 377.5 / this.material.k));
                        } else {
                            if (x <= 1 * this.L) {
                                σ_perm.push(new loadsArray(x, 130 / this.material.k));
                            }
                        }
                    }
                }
            }
        }
        return σ_perm;
    }, // permissible hull girder bending stress  [N/mm2] (1.4)

    // ----- CHAPTER 5 - SECTION 3: Hull Girder Yield Check ----- //

    σ_sw_h(analysisType) { // Longitudinal stress induced by still water vertical hull girder bending (4.1.1)

        ship.crossSectionCalc();

        if (analysisType === 'strength' || analysisType === 'fatigue') {

            let σ_sw_h = [];
            // getting the highest absolute value of the still water bending moment calculated out of the loads inputs
            let SWBM_y = [];
            for (let i = 0; i < stillWaterBM.length; i++) {
                SWBM_y.push(Math.abs(stillWaterBM[i].y));
            }
            let SWBM_max = Math.max(...SWBM_y);

            // getting the highest absolute value of the MINIMUM still water bending moment defined in the rules ( chap.4 - sec.4 - 2.2.1) 
            let SWBM_min = this.M_sw_h_min(analysisType);
            let SWBM_min_y = [];
            for (let i = 0; i < SWBM_min.length; i++) {
                SWBM_min_y.push(Math.abs(SWBM_min[i].y));
            }
            let SWBM_min_highest = Math.max(...SWBM_min_y);

            console.log(SWBM_min_highest);
            console.log(SWBM_max);

            // verifying if the inputs are valid
            if (typeof SWBM_max === 'number' && typeof SWBM_min_highest === 'number') {
                // getting the highest among the highests
                if (SWBM_min_highest > SWBM_max) {
                    SWBM_max = SWBM_min_highest;
                }

                console.log(this.crossSection.I_y_n50);
                console.log(this.crossSection.z_n_n50);

                for (let z = 0; z <= this.D; z += 0.5) {
                    let σ = (SWBM_max / this.crossSection.I_y_n50 * (z - this.crossSection.z_n_n50) / 1000);
                    σ_sw_h.push({
                        z,
                        σ
                    });
                }

                console.log(σ_sw_h);

            } else {
                alert('something is wrong with ship.σ_sw_h()')
            }





        } else {
            alert('there is something wrong with the argument calling the ship.σ_sw_h() method');
        }

    },
    σ_sw_s(analysisType) { // Longitudinal stress induced by still water vertical hull girder bending (4.1.1)



        return;
    },
    σ_hg(analysisType) {


        return;
    },

    ////////////////////////////////////////////////////////////
    //                    Arne Jan                            //
    ///////////////////////////////////////////////////////////

    σ_allow() { //yield stress divided by safety factor     
        return this.material.ReH / 1.5; //[N/m2]
    },

    // ----- CHAPTER 6 - SECTION 4: Minimum thickness -----------//

    ////////////////////////////////////////////////////////////
    //                    Arne Jan                            //
    ///////////////////////////////////////////////////////////

    t() { //plate thickness

        this.hullGirder.t_plate = this.hullGirder.s / 2 * Math.sqrt(this.p_bottom() / this.σ_allow()); // [m]*[N/m2/]/[N/m2] = [m]  
        document.getElementById('t_plate').innerHTML = (this.hullGirder.t_plate * 1000).toPrecision(3) //updating t_plate value in the screen
        return this.hullGirder.t_plate
    },

    // ----- CHAPTER 6 - SECTION 5: Stiffeners -----------//

    ////////////////////////////////////////////////////////////
    //                    Arne Jan                            //
    ///////////////////////////////////////////////////////////

    M_stiff() { // maximium moment acting on stiffeners cross section
        if (typeof this.hullGirder.s === 'number' && typeof this.hullGirder.l === 'number') {
            return this.p_bottom() * this.hullGirder.s * this.hullGirder.l * this.hullGirder.l / 12; // [N/m2]*[m]*[m]*[m] = [Nm]
        } else {
            alert('there is something wrong with the spacing between stiffeners of the hull girder model');
        }
    },

    Z_stiff() {
        return this.M_stiff() / this.σ_allow(); // [Nm]/[N/m2] = [m3]
    },

    find_stiff() {
        console.log('chamou find_Stiff');

        let minZ = this.Z_stiff() * 1000000; //[m3] -> [cm3]
        let hold = Stiffeners[Stiffeners.length - 1];

        for (i = 0; i < Stiffeners.length; i++) {
            if (typeof Stiffeners[i].z === "number") {
                if (Stiffeners[i].z > minZ && Stiffeners[i].z < hold.z) {
                    hold = Stiffeners[i];
                }
            } else {
                alert('there is something whong with the selection of stiffeners');
            }
        }
        this.hullGirder.stiffProf = hold;
        this.hullGirder.z_min_stiff = hold.z;
        document.getElementById('stiffSelector').value = hold.name;

        return hold;
    },

    t_eq() {
        console.log('chamou t_eq');

        let stiff = this.hullGirder.stiffProf;
        let t_eq = this.hullGirder.t_plate + (stiff.area / 1000000) / (this.hullGirder.s); // [m] + [m2]/[m] = [m]
        //                        [mm2] -> [m2]

        //replaceing old values of t_eq
        for (i = 0; i < this.hullGirder.crossSection.length; i++) {
            if (this.hullGirder.crossSection[i].orientation === 'vertical') {
                this.hullGirder.crossSection[i].width = t_eq; // [m]
            } else
            if (this.hullGirder.crossSection[i].orientation === 'horizontal') {
                this.hullGirder.crossSection[i].height = t_eq; // [m]
            } else {
                alert('there is something wrong with the plate orientation definition inside the crossSection object');
            }
        }

        document.getElementById('t_eq').innerHTML = (t_eq * 1000).toPrecision(3); //updating Zb value
        return t_eq; // [m]
    },

});

var ship = new Ship(112, 22, 11, 0.67, 66280, 60000, 0.600, 2.4);
//                  [m]  [m] [m]  []   [N]    [N]    [m]   [m]
