// ---------------- CROSS SECTION CALCULATIONS ------------------------ //

Ship.prototype.updateCrossSectionThicknesses = function () {
    console.log('chamou updateCrossSectionThicknesses');
    let t = this.t_eq();

    this.hullGirder.crossSection[0].width = t; //[m] 
    this.hullGirder.crossSection[1].height = t; //[m]
    this.hullGirder.crossSection[2].height = t; //[m]
    this.hullGirder.crossSection[3].width = t; //[m] 
    this.hullGirder.crossSection[4].height = t; //[m]
    this.hullGirder.crossSection[5].width = t; //[m]   
};

Ship.prototype.updateCrossSectionHeights = function () {
    console.log('chamou updateCrossSectionHeights');
    this.hullGirder.crossSection[0].height = this.D; //[m]
    this.hullGirder.crossSection[1].width = this.B; //[m]
    this.hullGirder.crossSection[2].width = this.B; //[m]
    this.hullGirder.crossSection[3].height = this.DB_height - this.hullGirder.crossSection[2].height; //[m]
    this.hullGirder.crossSection[4].width = this.B - this.hatchOpening; //[m]
    this.hullGirder.crossSection[5].height = 0.5; //[m]
};

Ship.prototype.updateCrossSectionH_BL = function () {
    console.log('chamou updateCrossSectionH_BL');
    this.hullGirder.crossSection[0].h_BL = this.D / 2; //[m]
    this.hullGirder.crossSection[1].h_BL = this.hullGirder.crossSection[1].height / 2; //[m]
    this.hullGirder.crossSection[2].h_BL = this.DB_height + this.hullGirder.crossSection[2].height / 2; //[m]
    this.hullGirder.crossSection[3].h_BL = this.DB_height / 2 + this.hullGirder.crossSection[2].height; //[m]
    this.hullGirder.crossSection[4].h_BL = this.D - this.hullGirder.crossSection[4].height; //[m]
    this.hullGirder.crossSection[5].h_BL = this.D; //[m]
};

Ship.prototype.z_n_n50 = function () { // calculates cross section area, inertia and height of neutral axis
    console.log('chamou z_n_n50');
    let tot_area = 0;
    let tot_h_BLxArea = 0;
    let h_NA; // height from the BL to the neutral Axis (NA) [m]

    // calculating area and area*BL_height
    for (let i = 0; i < this.hullGirder.crossSection.length; i++) {
        let n;
        if (this.hullGirder.crossSection[i].structure === 'hatchCoaming' || this.hullGirder.crossSection[i].structure === 'side') {
            n = 2; //times 2 because there are 2 sides and 2 hatchCoamings
        } else {
            n = 1;
        }
        this.hullGirder.crossSection[i].area = n * (this.hullGirder.crossSection[i].width * this.hullGirder.crossSection[i].height); //[m]*[m] = [m2]
        this.hullGirder.crossSection[i].h_BLxArea = this.hullGirder.crossSection[i].area * this.hullGirder.crossSection[i].h_BL; //[m2]*[m] = [m3]

        tot_area += this.hullGirder.crossSection[i].area; // [m2]
        tot_h_BLxArea += this.hullGirder.crossSection[i].h_BLxArea; // [m3]

    }
    // calculating height of neutral axis
    h_NA = tot_h_BLxArea / tot_area; // [m3]/[m2] = [m]
    this.hullGirder.crossSection.z_n_n50 = h_NA; // Z coordinate of horizontal neutral axis of the hull transverse section with net scantlings [m]

    for (let i = 0; i < this.hullGirder.crossSection.length; i++) {
        this.hullGirder.crossSection[i].d = Math.abs(this.hullGirder.crossSection[i].h_BL - h_NA); //[m] - [m] = [m]            
    }
    //console.log('z_n_n50: ' + h_NA);
};

Ship.prototype.I_y_n50 = function () {
    console.log('chamou I_y_n50');
    let Iyy_t = 0;
    // calculating section's moment of Inertia 
    for (let i = 0; i < this.hullGirder.crossSection.length; i++) {
        let inert = this.hullGirder.crossSection[i].width * Math.pow(this.hullGirder.crossSection[i].height, 3) / 12 + this.hullGirder.crossSection[i].width * this.hullGirder.crossSection[i].height * Math.pow(this.hullGirder.crossSection[i].d, 2); //[m]*[m]^3 + [m]*[m]*[m]^2 = [m4]
        this.hullGirder.crossSection[i].Iyy = inert; // [m4]
        Iyy_t += inert;
    }
    this.hullGirder.crossSection.I_y_n50 = Iyy_t; // net moment of inertia of the hull transverse section about its horizontal neutral axis [m4]  
    document.getElementById('I_y_n50').innerHTML = this.hullGirder.crossSection.I_y_n50.toPrecision(3); //updating Iy value
    //console.log('I_y_n50: ' + Iyy_t);
};

Ship.prototype.calc_Z_B_gr = function () {
    console.log('chamou calc_Z_B_gr');
    this.hullGirder.crossSection.Z_B_gr = this.hullGirder.crossSection.I_y_n50 / this.hullGirder.crossSection.z_n_n50;
    document.getElementById('Z_B_gr').innerHTML = this.hullGirder.crossSection.Z_B_gr.toPrecision(3); //updating Zb value
    return this.hullGirder.crossSection.Z_B_gr;
}; // chap.5 sec.2 (1.2) 

Ship.prototype.calc_Z_D_gr = function () {
    console.log('chamou calc_Z_D_gr');
    
    this.hullGirder.crossSection.Z_D_gr = this.hullGirder.crossSection.I_y_n50 / (this.D - this.hullGirder.crossSection.z_n_n50);
    document.getElementById('Z_D_gr').innerHTML = this.hullGirder.crossSection.Z_D_gr.toPrecision(3); //updating Zd value
    return this.hullGirder.crossSection.Z_D_gr
}; // chap.5 sec.2 (1.2) 

Ship.prototype.calc_C_w0 = function () {
    console.log('chamou calc_C_w0');

    if (typeof this.L === "number") {
        if (this.L > 90) {
            this.C_w0 = this.C_w;
        } else {
            this.C_w0 = 5.7 + 0.0222 * this.L;
        }
    } else {
        alert('ship lenght is not defined as a number');
    }
}; // chap.5 sec.2 (1.3) 

Ship.prototype.updateCrossSection = function () {
    console.log('chamou updateCrossSection');
    this.updateCrossSectionHeights();
    this.updateCrossSectionH_BL();
    this.z_n_n50();
    this.I_y_n50();
    this.calc_Z_B_gr();
    this.calc_Z_D_gr();
    this.calc_Z_R_gr();

    this.calc_C_w0();
}

Ship.prototype.calc_f_r = function () {
    console.log('chamou calc_f_r');
    
    switch (this.serviceAreaNotation) {
        case 'R0':
            this.f_r = 1;
            break;
        case 'R1':
            this.f_r = 0.9;
            break;
        case 'R2':
            this.f_r = 0.8;
            break;
        case 'R3':
            this.f_r = 0.7;
            break;
        case 'R4':
            this.f_r = 0.6;
            break;
        case 'RE':
            this.f_r = 0.5;
            break;
        default:
            alert('the Service area notation is not well defined');
    }
}; // chap.4 sec.3 

Ship.prototype.calc_Z_R_gr = function () { //Minimum section modulus at midship part  

    console.log('chamou calc_Z_R_gr');
    this.calc_C_w0();
    this.calc_f_r();

    let z_r;
    let k = this.material.k; //acho que é esse k que a regra se refere

    z_r = k * ((1 + this.f_r) / 2) * this.C_w0 * this.L * this.L * this.B * (this.Cb + 0.7) / 1000000; //[m3]
    this.hullGirder.Z_R_gr = z_r;
    document.getElementById('Z_R_gr').innerHTML = this.hullGirder.Z_R_gr.toPrecision(3) //updating Zr value
    document.getElementById('Z_R_gr1').innerHTML = this.hullGirder.Z_R_gr.toPrecision(3) //updating Zr value on the second line
    
    if (typeof this.hullGirder.crossSection.Z_B_gr === 'number' && typeof this.hullGirder.crossSection.Z_D_gr === 'number') {

        if (this.hullGirder.crossSection.Z_D_gr < z_r) {
            // add more material at the deck
        }
        if (this.hullGirder.crossSection.Z_B_gr < z_r) {
            //add more material at the bottom
        }
    } else {
        alert('Z_B and/or Z_D are not being calculated properly');
    }
}; // chap.5 sec.2 (1.3) - editting

Ship.prototype.Z_gr = function (analysisType) {
    console.log('chamou Z_gr');

    let M_max_sum = this.M_max_sum(analysisType);
    let σ_perm = this.σ_perm();
    let Zgr = [];

    for (let i = 0; i < σ_perm.length; i++) {
        Zgr.push(new loadsArray(i * 2, M_max_sum / σ_perm[i].y / 1000));
    }

    return Zgr; // [m3]

}; // chap.5 sec.2 (1.4) - editting

Ship.prototype.I_yR_gr = function () {
    console.log('chamou I_yR_gr');

    let I_yR = 3 * this.f_r * this.C_w * this.L * this.L * this.L * this.B * (this.Cb + 0.7) / 100000000;
    this.hullGirder.I_yR_gr = I_yR;
    document.getElementById('I_yR_gr').innerHTML = this.hullGirder.I_yR_gr.toPrecision(3); //updating Iy value on the screen 

    return I_yR;
}; // chap.5 sec.2 (1.5) - editting

Ship.prototype.f2 = function (analysisType) {

    console.log('chamou f2');

    let z_B = this.hullGirder.crossSection.Z_B_gr;
    let z_D = this.hullGirder.crossSection.Z_D_gr;
    let z_R = this.hullGirder.Z_R_gr;

    let highestMom = Math.abs(this.M_max_sum(analysisType));
    let f2;
    
    if (typeof z_B === 'number' && typeof z_D === 'number' && typeof highestMom === 'number') {

        if (z_B > z_D) {
            f2 = 5.7 * (highestMom) / (z_D * 1000000); //Z_D has to be in 
        } else {
            f2 = 5.7 * (highestMom) / (z_B * 1000000); //Z_B has to be in cm3
        }
        document.getElementById('f2').innerHTML = f2.toPrecision(3);
        return f2;
    } else {
        alert('there is something wrong with the Z_B or Z_D calculations')
    }
};

Ship.prototype.buildCrossSection = function () {
    console.log('chamou buildCrossSection');
    this.t();
    this.find_stiff();
    this.updateCrossSectionThicknesses();
    this.updateCrossSectionHeights();
    this.updateCrossSectionH_BL();
    this.z_n_n50();
    this.I_y_n50();
    this.calc_Z_B_gr();
    this.calc_Z_D_gr();

    this.calc_Z_R_gr();
    this.I_yR_gr();

   

    console.log(this.hullGirder.crossSection);
}


//while f2 is still bigger than 1, the equivalent plate thickness must be increased at specific points so that the section moduls (bottom and/or deck) is sufficiently great to generate a f2 smaller than 1
Ship.prototype.findMinPlateThickForHullGirderStrength = function () {

    while (this.f2() > 1) {

        if (this.hullGirder.crossSection.Z_D_gr < this.hullGirder.crossSection.Z_B_gr) {
            if (this.hullGirder.crossSection[5].width < 0.003) { // check what the better way to limit hatch coaming thickness is
                this.hullGirder.crossSection[5].width = this.hullGirder.crossSection[5].width * 1.1 // 10% increment
                this.buildCrossSection();

            }
            if (this.hullGirder.crossSection[4].height / this.hullGirder.crossSection[0].width < 1.4) {
                this.hullGirder.crossSection[4].height = this.hullGirder.crossSection[4].height * 1.1; // 10% increment
                this.buildCrossSection();

            } else {
                this.hullGirder.crossSection[0].width = this.hullGirder.crossSection[0].width * 1.1; // 10% increment
                this.buildCrossSections();

            }
        } else {

        }
    }

};
