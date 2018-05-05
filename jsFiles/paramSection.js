// -------- UPDATING PARAMETERS -----------//

Ship.prototype.fillInParam = function () {

    document.getElementById('L').value = this.L;
    document.getElementById('B').value = this.B;
    document.getElementById('D').value = this.D;
    document.getElementById('T').value = this.calcDraft();

    document.getElementById('LWT').value = this.LWT;
    document.getElementById('DWT').value = this.DWT;
    document.getElementById('l').value = this.hullGirder.l * 1000;
    document.getElementById('s').value = this.hullGirder.s * 1000;
    document.getElementById('DB_height').value = this.DB_height;
    document.getElementById('hatchOpening').value = this.hatchOpening;

    this.M_wv_h('strength');
    this.M_wv_s('strength');
    this.M_sw_h_min('strength');
    this.M_sw_s_min('strength');

}

Ship.prototype.formatStiffOptions = function (id) {
    console.log('chamou formatStiffOptions');

    for (i = 0; i < Stiffeners.length; i++) {

        if (Stiffeners[i].z < this.hullGirder.z_min_stiff) {
            console.log(Stiffeners[i].name + 'has z < z_min');
            document.getElementById(Stiffeners[i].name).style.color = '#cccccc';
        } else {
            console.log(Stiffeners[i].name + 'has z >= z_min');
            document.getElementById(Stiffeners[i].name).style.color = 'black';
        }
    }
    // insert comment on chosen stiffener 
    if (this.hullGirder.stiffProf.z < this.hullGirder.z_min_stiff) {
        document.getElementById('stiffFeedback').innerHTML = 'This stiffener has a section modulus (z) under the minimum required for withstanding hydrostatic pressure at the bottom of the vessel.';
        document.getElementById('stiffFeedback').style.color = '#b30000';
    } else {
        document.getElementById('stiffFeedback').innerHTML = ' ';
    }
}



Ship.prototype.updateParam = function (id) {
    console.log(id + ' parameter will be updated');
    console.log(this[id]);

    let numberParamM = ['L', 'B', 'D', 'T', 's', 'l', 'DB_height', 'hatchOpening', 'LWT', 'DWT']; // numbers in meters
    let serviceAreaNotations = ['R0', 'R1', 'R2', 'R3', 'R4', 'RE'];
    let material = ['NV-NS', 'NV-32', 'NV-36', 'NV-40'];
    let stiffProfile = ['HP 180x9', 'HP 200x11', "HB 180x8", "HB 180x9", "HB 220x10", "HB 220x12"];
    let loadCondition = ['full load', 'ballast'];

    if (loadCondition.includes(id)) {
        this.loadCondition = id;
        this.M_wv_h('strength');
        this.M_wv_s('strength');
        this.Z_gr('strength'); // this argument is not being used
    }
    if (stiffProfile.includes(id)) {

        for (i = 0; i < Stiffeners.length; i++) {
            if (Stiffeners[i].name === id) {
                this.hullGirder.stiffProf = Stiffeners[i];
            }
        }
        this.formatStiffOptions(id);

        this.updateCrossSectionThicknesses();
        this.updateCrossSectionHeights();
        this.updateCrossSectionH_BL();
        this.z_n_n50();
        this.I_y_n50();
        this.calc_Z_B_gr();
        this.calc_Z_D_gr();
    } else {
        if (serviceAreaNotations.includes(id)) {
            this.serviceAreaNotation = id;
            this.calc_Z_R_gr();
        }
        if (material.includes(id)) {
            this.material = Materials({
                SG: id
            }).first();
            this.Z_gr('strength');
        }
        if (numberParamM.includes(id)) {

            if (id === 'l' || id === 's') {
                // updates the value of s stored in the ship.hullGirder object
                this.hullGirder[id] = Number(document.getElementById(id).value) / 1000;
                console.log('the stored value of ' + id + ' was uptated inside the ship.hullGirder object');
            } else {

                //Updates the values stored in the Ship object
                this[id] = Number(document.getElementById(id).value);
                console.log('the stored value of ' + id + ' was uptated inside the ship object');
            }

            // performing specific actions according to each parameter
            if (id === 'DWT' || id === 'LWT') {
                this.calcDraft();
                document.getElementById('T').value = this.calcDraft() //updating T value on screen
                this.M_wv_h('strength');
                this.M_wv_s('strength');

                this.M_max_sum('strength');
            }

            if (id === 'L' || id === 'B' || id === 'T' || id === 'DB_height' || id === 'hatchOpening') {

                this.t(); // calls this.p_bottom internally
                this.find_stiff();
                this.updateCrossSectionThicknesses();

                if (id === 'T') {
                    this.displacement();
                    this.M_wv_h('strength');
                    this.M_max_sum('strength');
                    this.Z_gr('strength');


                }
                if (id === 'L' || id === 'B') { //linha 1
                    this.calcDraft();
                    if (id === 'L') {
                        this.calc_Z_R_gr();
                        this.I_yR_gr();
                    }
                    if (id === 'B') {
                        this.I_yR_gr();
                    }
                    this.M_wv_h('strength');
                    this.M_wv_s('strength');
                    this.M_sw_h_min('strength');
                    this.M_sw_s_min('strength');
                    this.Z_gr('strength');
                }

                two.update();
            }
            if (id === 's' || id === 'l') {
                if (id === 's') {
                    // updates the value of l stored in the ship.hullGirder object to 4*s
                    this.hullGirder.l = this.hullGirder.s * 4;
                    //updating t_plate value in the screen
                    document.getElementById('l').value = (this.hullGirder.l * 1000).toPrecision(4);
                }
                if (id === 'l') {
                    // updates the value of l stored in the ship.hullGirder object to 4*s
                    this.hullGirder.s = this.hullGirder.l / 4;
                    //updating t_plate value in the screen
                    document.getElementById('s').value = (this.hullGirder.s * 1000).toPrecision(3);
                }
                this.t(); // calls this.p_bottom internally
                //updating t_plate value in the screen
                document.getElementById('t_plate').innerHTML = (this.hullGirder.t_plate * 1000).toPrecision(3);
                this.find_stiff();
                this.updateCrossSectionThicknesses();

                this.formatStiffOptions(id);

                two.update();
            }

            this.updateCrossSectionHeights();
            this.updateCrossSectionH_BL();
            this.z_n_n50();
            this.I_y_n50();
            this.calc_Z_B_gr();
            this.calc_Z_D_gr();
        }
    }

    console.log(this[id]);
    //this.findMinPlateThickForHullGirderStrength();
}


// -------- HANDLING PARAMETERS --------//

var param;
// install js linter
var readParam = function (event) {
    var file = event.target.files[0];
    //	var name = file.name;
    var reader = new FileReader();

    reader.onload = function (event) {
        param = event.target.result.split("\n");
    };
    reader.readAsText(file);
};
