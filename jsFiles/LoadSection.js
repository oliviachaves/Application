// ----- CHAPTER 4 - SECTION 3: Ship Motion and Accelerations ----- //

Ship.prototype.f_T = function (T) { //ratio between draught at a loading condition (T) and scantling draught (this.T)
    let f_T = T / this.T;
    if (f_T > 0.5) {
        return f_T;
    } else {
        return 0.5;
    }
};

// ----- CHAPTER 4 - SECTION 4: Hull Girder Loads ---------------- //


// parameters
Ship.prototype.f_sw = function () { //distribution factor along the ship length (2.2.1)
    console.log('chamou f_sw');
    
    let f_sw = [];
    for (let x = 0; x <= this.L; x = x + 2) {

        if (x / this.L <= 0.1) {
            f_sw.push(new loadsArray(x, 1.5 * (x / this.L)));
        } else
        if (x / this.L <= 0.3) {
            f_sw.push(new loadsArray(x, 4.25 * (x / this.L) - 0.275));
        } else
        if (x / this.L <= 0.7) {
            f_sw.push(new loadsArray(x, 1));
        } else
        if (x / this.L <= 0.9) {
            f_sw.push(new loadsArray(x, -4.25 * (x / this.L) + 3.975));
        } else
        if (x / this.L <= 1) {
            f_sw.push(new loadsArray(x, -1.5 * (x / this.L) + 1.5));
        } else {
            alert("there is something wrong with the f_ws factor from the still water bending moment.");
        }
    }
    return f_sw;
};
Ship.prototype.f_qs = function () { // distribution factor along the ship length - shear moment  
    console.log('chamou f_qs');
    
    let f_qs = [];
    for (let x = 0; x <= this.L; x += 2) {
        if (x  <= 0.15*this.L) {
            f_qs.push(new loadsArray(x, 6.667 * (x / this.L)));
        } else
        if (x <= 0.3*this.L) {
            f_qs.push(new loadsArray(x, 1));
        } else
        if (x <= 0.4*this.L) {
            f_qs.push(new loadsArray(x, -2 * (x / this.L) + 1.6));
        } else
        if (x <= 0.6*this.L) {
            f_qs.push(new loadsArray(x, 0.8));
        } else
        if (x <= 0.7*this.L) {
            f_qs.push(new loadsArray(x, 2 * (x / this.L) - 0.4));
        } else
        if (x <= 0.85*this.L) {
            f_qs.push(new loadsArray(x, 1));
        } else
        if (x <= 1*this.L) {
            f_qs.push(new loadsArray(x, -6.667 * (x / this.L) + 6.667));
        } else {
            alert("there is something wrong with the f_qs factor from the still water bending moment.");
        }
    }
    return f_qs;
};
Ship.prototype.f_m = function (analysisType) { // distribution factor along the ship length (3.3.1); LoadCondition can assume 'full load' || 'ballast'
    console.log('chamou f_m');
    
    let f_m = [];
    if (analysisType === "strength") {

        for (let x = 0; x <= this.L; x += 2) {

            if (x / this.L <= 0.4) {
                f_m.push(new loadsArray(x, 2.5 * (x / this.L)));
            } else
            if (x / this.L <= 0.65) {
                f_m.push(new loadsArray(x, 1));
            } else
            if (x / this.L <= 1) {
                f_m.push(new loadsArray(x, -2.857 * (x / this.L) + 2.857));
            } else {
                alert("there is something wrong with the f_m factor.");
            }
        }
        return f_m;
    } else
    if (analysisType === "fatigue" && this.loadCondition === 'full load') {
        for (let x = 0; x <= this.L; x += 2) {
            if (x / this.L <= 0.05) {
                f_m.push(new loadsArray(x, 1 * (x / this.L)));
            } else
            if (x / this.L <= 0.1) {
                f_m.push(new loadsArray(x, 1.8 * (x / this.L) - 0.04));
            } else
            if (x / this.L <= 0.3) {
                f_m.push(new loadsArray(x, 3 * (x / this.L) - 0.16));
            } else
            if (x / this.L <= 0.35) {
                f_m.push(new loadsArray(x, 2.4 * (x / this.L) - 0.04));
            } else
            if (x / this.L <= 0.4) {
                f_m.push(new loadsArray(x, 1.6 * (x / this.L) + 0.38));
            } else
            if (x / this.L <= 0.45) {
                f_m.push(new loadsArray(x, 1 * (x / this.L) + 0.54));
            } else
            if (x / this.L <= 0.5) {
                f_m.push(new loadsArray(x, 0.2 * (x / this.L) + 0.9));
            } else
            if (x / this.L <= 0.55) {
                f_m.push(new loadsArray(x, -1 * (x / this.L) + 1.5));
            } else
            if (x / this.L <= 0.6) {
                f_m.push(new loadsArray(x, -1.6 * (x / this.L) + 1.83));
            } else
            if (x / this.L <= 0.65) {
                f_m.push(new loadsArray(x, -2.4 * (x / this.L) + 2.31));
            } else
            if (x / this.L <= 0.85) {
                f_m.push(new loadsArray(x, -3 * (x / this.L) + 2.7));
            } else
            if (x / this.L <= 0.9) {
                f_m.push(new loadsArray(x, -1.8 * (x / this.L) + 1.68));
            } else
            if (x / this.L <= 1) {
                f_m.push(new loadsArray(x, -1.044 * (x / this.L) + 0.6));
            } else {
                alert("there is something wrong with the f_m factor.");
            }
        }
        return f_m;
    } else
    if (analysisType === "fatigue" && this.loadCondition === 'ballast') {
        for (let x = 0; x <= this.L; x += 2) {
            if (x / this.L <= 0.15) {
                f_m.push(new loadsArray(x, 1 * (x / this.L)));
            } else
            if (x / this.L <= 0.2) {
                f_m.push(new loadsArray(x, 2 * (x / this.L) - 0.15));
            } else
            if (x / this.L <= 0.4) {
                f_m.push(new loadsArray(x, 2.9 * (x / this.L) - 0.33));
            } else
            if (x / this.L <= 0.45) {
                f_m.push(new loadsArray(x, 2 * (x / this.L) + 0.03));
            } else
            if (x / this.L <= 0.5) {
                f_m.push(new loadsArray(x, 1 * (x / this.L) + 0.48));
            } else
            if (x / this.L <= 0.55) {
                f_m.push(new loadsArray(x, 0.4 * (x / this.L) + 0.78));
            } else
            if (x / this.L <= 0.6) {
                f_m.push(new loadsArray(x, -1.4 * (x / this.L) + 1.77));
            } else
            if (x / this.L <= 0.65) {
                f_m.push(new loadsArray(x, -2 * (x / this.L) + 2.13));
            } else
            if (x / this.L <= 0.7) {
                f_m.push(new loadsArray(x, -3 * (x / this.L) + 2.78));
            } else
            if (x / this.L <= 0.85) {
                f_m.push(new loadsArray(x, -3.4 * (x / this.L) + 3.06));
            } else
            if (x / this.L <= 0.9) {
                f_m.push(new loadsArray(x, -2 * (x / this.L) + 1.87));
            } else
            if (x / this.L <= 1) {
                f_m.push(new loadsArray(x, -0.7 * (x / this.L) + 0.7));
            } else {
                alert("there is something wrong with the f_m factor.");
            }
        }
        return f_m;
    } else {
        alert('there is a typo in the argument calling the ship.f_m() method');
    }
};
Ship.prototype.f_p = function (analysisType, T) { // (3.3.1); LoadCondition can assume 'full load' || 'ballast'. T is the draught at the analyzed load condition.
    console.log('chamou f_p');
    
    if (typeof T === 'undefined') { // this is a fix for calculating M_wv aconsidering the desig draft, but other drafts should be allowed later 
        T = Number(this.T);
    }

    if (analysisType === 'strength' && typeof T === 'number') {
        return coeff.f_ps;
    } else
    if (analysisType === 'fatigue' && typeof T === 'number') {
        return coeff.f_fa * coeff.f_vib * (0.27 - (6 + 4 * this.f_T(T)) * this.L / 100000);
    } else {
        alert('there is a typo in the argument calling the ship.f_p() method');
    }
};
Ship.prototype.f_nℓ_s = function (analysisType) { // (3.1.1)
    console.log('chamou f_nℓ_s');
    
    if (analysisType === 'strength') {
        return 0.58 * ((this.Cb + 0.7) / this.Cb);
    } else
    if (analysisType === 'fatigue') {
        return 1;
    } else {
        alert('there is a typo in the argument calling the ship.f_p() method');
    }

};


//bending moments
Ship.prototype.M_wv_h = function (analysisType, T) { // Vertical wave bending moment [kNm] in hogging (3.1.1). T is the draught at the analyzed load condition.
    console.log('chamou M_wv_h');

    let f_m = this.f_m(analysisType);
    let f_p = this.f_p(analysisType, T);
    let f_nℓ_vh = coeff.f_nℓ_h;

    let M = [];
    for (let x = 0; x <= this.L / 2; x += 1) {
        let m = 0.19 * coeff.f_R / 0.85 * f_nℓ_vh * f_m[x].y * f_p * this.C_w * this.L * this.L * this.B * this.Cb;
        M.push(new loadsArray(2 * x, m));
    }
    
    //saves the value of M_wv_h in the ship.hullGirder object
    this.hullGirder.loads.M_wv_h = M;
    
    // updates the mid value of M_wv_h
    this.M_wv_h_mid(analysisType);

    //updates the graph
    chart2.options.data[1].dataPoints = M;
    chart2.render();

    return M;
}; //array

Ship.prototype.M_wv_s = function (analysisType, T) { // Vertical wave bending moment [kNm] in sagging (3.1.1). T is the draught at the analyzed load condition. 
    console.log('chamou M_wv_s');
    
    let f_m = this.f_m(analysisType);
    let f_p = this.f_p(analysisType, T);
    let f_nℓ_vs = this.f_nℓ_s(analysisType);

    let M = [];
    for (let x = 0; x <= this.L / 2; x += 1) {

        let m = -0.19 * coeff.f_R / 0.85 * f_nℓ_vs * f_m[x].y * f_p * this.C_w * this.L * this.L * this.B * this.Cb;
        M.push(new loadsArray(2 * x, m));
    }
    
    //saves the value of M_wv_h in the ship.hullGirder object
    this.hullGirder.loads.M_wv_s = M;
    
    // updates the mid value of M_wv_s
    this.M_wv_s_mid(analysisType);

    //updates the graph
    chart3.options.data[1].dataPoints = M;
    chart3.render();

    return M;
}; //array

Ship.prototype.M_wv_h_mid = function (analysisType) {
    console.log('chamou M_wv_h_mid');

    if (analysisType === 'strength') {
        let M_wv_h = this.hullGirder.loads.M_wv_h;
        let i = Math.round(M_wv_h.length / 2);
        
        // save the value of M_wv_h_mid in the ship.hullgirder object 
        this.hullGirder.loads.M_wv_h_mid = M_wv_h[i].y;
        
        //updates the value of M_sw_h_mid in the screen
        document.getElementById('rule_M_wv_h_mid').innerHTML = M_wv_h[i].y.toFixed(1);
        
        // updates the value of the maximum acting moment (hogging + sagging)
        this.M_max_sum();

        // update value of M_sw_min
        this.M_sw_min(analysisType);

        return M_wv_h[i].y;
    } else {
        alert('there is something wrong with the argument calling the ship.M_wv_h_mid() method');
    }
}; //number

Ship.prototype.M_wv_s_mid = function (analysisType) {
    console.log('chamou M_wv_s_mid');

    if (analysisType === 'strength') {

        let M_wv_s = this.hullGirder.loads.M_wv_s;
        let i = Math.round(M_wv_s.length / 2);
        
        // save the value of M_wv_s_mid in the ship.hullgirder object 
        this.hullGirder.loads.M_wv_s_mid = M_wv_s[i].y;
        
        //updates the value of M_sw_s_mid in the screen
        document.getElementById('rule_M_wv_s_mid').innerHTML = M_wv_s[i].y.toFixed(1);
        
        // updates the value of the maximum acting moment (hogging + sagging)
        this.M_max_sum();

        // update value of M_sw_min
        this.M_sw_min(analysisType);

        return M_wv_s[i].y;

    } else {
        alert('there is something wrong with the argument calling the ship.M_wv_s_mid() method');
    }
}; //number

Ship.prototype.M_sw_h_min = function (analysisType) { // minimum still water bending moment in hogging condition (2.2.1)
    console.log('chamou M_sw_h_min');

    let M_mid = this.hullGirder.loads.M_wv_h_mid;
    let f_sw = this.f_sw();
    let M = [];

    for (let i = 0; i <= this.L / 2; i++) {
        let m = f_sw[i].y * (171 * this.C_w * this.L * this.L * this.B * (this.Cb + 0.7) / 1000 - M_mid); // [kNm]
        M.push(new loadsArray(i * 2, m));
    }
    //saves the value of M_sw_h_min into the ship.hullGirder object
    this.hullGirder.loads.M_sw_h_min = M;

    // updates the mid value of M_sw_h
    this.M_sw_h_mid(analysisType);

    //updates the graph
    chart2.options.data[0].dataPoints = M;
    chart2.render();

    return M; //array
}; //array

Ship.prototype.M_sw_s_min = function (analysisType) { // minimum still water bending moment in sagging condition (2.2.1)
    console.log('chamou M_sw_s_min');

    let M_mid = this.hullGirder.loads.M_wv_s_mid;
    let f_sw = this.f_sw();
    let M = [];

    for (let i = 0; i <= this.L / 2; i++) {
        let m = -0.85 * f_sw[i].y * (171 * this.C_w * this.L * this.L * this.B * (this.Cb + 0.7) / 1000 + M_mid); // [kNm]
        M.push(new loadsArray(i * 2, m));
    }
    //saves the value of M_sw_s_min in the ship.hullGirder object
    this.hullGirder.loads.M_sw_s_min = M;

    // updates the mid value of M_sw_s
    this.M_sw_s_mid(analysisType);

    chart3.options.data[0].dataPoints = M;
    chart3.render();

    return M; //array
}; //array

Ship.prototype.M_sw_h_mid = function (analysisType) {
    console.log('chamou M_sw_h_mid');

    let M_sw_h = this.hullGirder.loads.M_sw_h_min;
    let i = Math.round(M_sw_h.length / 2);
    
    //updates the value of M_sw_h_mid in the screen
    document.getElementById('rule_M_sw_h_mid').innerHTML = M_sw_h[i].y.toFixed(1);
    
    //saves the value of M_sw_h_mid in the ship.hullGirder object
    this.hullGirder.loads.M_sw_h_mid = M_sw_h[i].y;
    
    // updates the value of the maximum acting moment (hogging + sagging)
    this.M_max_sum();

    return M_sw_h[i].y;
}; //number

Ship.prototype.M_sw_s_mid = function (analysisType) {
    console.log('chamou M_sw_s_mid');

    let M_sw_s = this.hullGirder.loads.M_sw_s_min;
    let i = Math.round(M_sw_s.length / 2);

    //updates the value of M_sw_s_mid in the screen
    document.getElementById('rule_M_sw_s_mid').innerHTML = M_sw_s[i].y.toFixed(1);

    //saves the value of M_sw_s_mid in the ship.hullGirder object
    this.hullGirder.loads.M_sw_s_mid = M_sw_s[i].y;
    
    // updates the value of the maximum acting moment (hogging + sagging)
    this.M_max_sum();

    return M_sw_s[i].y;
}; //number

Ship.prototype.M_sw_min = function (analysisType) { // absolute maximum between Msw-h-min and Msw-s-min with fsw = 1.0
    console.log('chamou M_sw_min');

    let M_h = (171 * this.C_w * this.L * this.L * this.B * (this.Cb + 0.7) / 1000 - this.hullGirder.loads.M_wv_h_mid); // hogging [kNm]

    let M_s = 0.85 * (171 * this.C_w * this.L * this.L * this.B * (this.Cb + 0.7) / 1000 + this.hullGirder.loads.M_wv_s_mid); // sagging [kNm]

    if (M_h <= M_s) {
        this.Q_sw_neg_min(M_s);
        return M_s;
    } else {
        this.Q_sw_pos_min(M_h);
        return M_h;
    }
}; //number

Ship.prototype.M_max_sum = function (analysisType) { // returns the highest sum of SWBM and WaveBM between hogging and sagging conditions
    console.log('chamou M_max_sum');

    let M_h = this.hullGirder.loads.M_sw_h_mid + this.hullGirder.loads.M_wv_h_mid;
    let M_s = this.hullGirder.loads.M_sw_s_mid + this.hullGirder.loads.M_wv_s_mid;

    if (Math.abs(M_s) > M_h) {
        document.getElementById('M_max_sum').innerHTML = M_s.toFixed(1);
        return M_s;
    } else {
        document.getElementById('M_max_sum').innerHTML = M_h.toFixed(1);
        return M_h;
    }
} // number


//shear force
Ship.prototype.Q_sw_pos_min = function (M_sw_min) { // minimum positive still water shear force
    console.log('chamou Q_sw_pos_min');

    let f_qs = this.f_qs();
    let Q = [];

    for (let i = 0; i <= this.L / 2; i += 1) {

        let q = (5 * f_qs[i] * M_sw_min) / this.L;
        Q.push(new loadsArray(2 * i, q));
    }

    chart2.options.data[2].dataPoints = Q;
    chart2.render();
    return Q;
};

Ship.prototype.Q_sw_neg_min = function (M_sw_min) { // minimum negative still water shear force
    console.log('cahamou Q_sw_pos_min');
    
    let f_qs = this.f_qs();
    let Q = [];

    for (let i = 0; i <= this.L / 2; i += 1) {

        let q = (-5 * f_qs * M_sw_min) / this.L;
        Q.push(new loadsArray(2 * i, q));
    }

    //document.getElementById('rule_M_sw_s_mid').innerHTML = M_sw_s[i].y.toFixed(1);

    chart3.options.data[2].dataPoints = Q;
    chart3.render();

    return Q;
};


// ----- CHAPTER 4 - SECTION 5: External Loads ---------------//

Ship.prototype.p_bottom = function () {
    return this.T * g * (rho * 1000); // [m]*[m/s2]*[kg/m3] = [N/m2] 
};


// ------ Generates still water bending moment graph ------//
chart2 = new CanvasJS.Chart("chartHogging", {
    animationEnabled: true,
    title: {
        text: "Hogging Condition",
        fontFamily: "roboto"
    },
    axisY: {
        valueFormatString: "#0,.",
        suffix: " kNm"
    },
    axisX: {
        title: "Vessel Length",
        fontFamily: "roboto"
    },
    toolTip: {
        shared: true
    },
    data: [{
            type: "area",
            markerType: "none",
            showInLegend: true,
            toolTipContent: "<span style=\"color:#4F81BC\"><strong>{name}: </strong></span> {y} kNm",
            name: "SW Bending moment",
            //dataPoints: ship.rule_SWBM_h
	   },
        {
            type: "area",
            markerType: "none",
            showInLegend: true,
            toolTipContent: "<span style=\"color:#4F81BC\"><strong>{name}: </strong></span> {y} kN",
            name: "Wave Bending moment",
            //dataPoints: ship.rule_SWBM_s
	   },
        {
            type: "line",
            markerType: "none",
            showInLegend: true,
            toolTipContent: "<span style=\"color:#4F81BC\"><strong>{name}: </strong></span> {y} kN",
            name: "Shear Force",
            //dataPoints: ship.rule_SWBM_s
	   }
          ]
});
chart2.render();

chart3 = new CanvasJS.Chart("chartSagging", {
    animationEnabled: true,
    title: {
        text: "Sagging Condition",
        fontFamily: "roboto"
    },
    axisY: {
        valueFormatString: "#0,.",
        suffix: " kNm"
    },
    axisX: {
        title: "Vessel Length",
        fontFamily: "roboto"
    },
    toolTip: {
        shared: true
    },
    data: [{
            type: "area",
            markerType: "none",
            showInLegend: true,
            toolTipContent: "<span style=\"color:#4F81BC\"><strong>{name}: </strong></span> {y} kNm",
            name: "SW Bending moment",
            //dataPoints: ship.rule_SWBM_h
	   },
        {
            type: "area",
            markerType: "none",
            showInLegend: true,
            toolTipContent: "<span style=\"color:#4F81BC\"><strong>{name}: </strong></span> {y} kN",
            name: "Wave Bending moment",
            //dataPoints: ship.rule_SWBM_s
	   },
        {
            type: "line",
            markerType: "none",
            showInLegend: true,
            toolTipContent: "<span style=\"color:#4F81BC\"><strong>{name}: </strong></span> {y} kN",
            name: "Shear Force",
            //dataPoints: ship.rule_SWBM_s
	   }
          ]
});
chart3.render();
