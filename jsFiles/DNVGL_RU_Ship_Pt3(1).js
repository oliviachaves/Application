
//RULES FOR CLASSIFICATION
//Ships
//Edition December 2015

//Part 3 Chapter 3

//Part 3: Hull
    //Chapter 3: Structural Design Principles



//function pannelConstructor (){
//    
//    let material = 'VL-A';      //material name: get from 3D model or user input
//    let prop = Materials({name:material}).first();      //get material properties from database: done
//    //{strenght_group, name, E, ReH, Rm, f_pL, f1}
// 
//    let stiff_direct = 'long'; // stiffiners direction on the plate: 'long' or 'transv'
//    let clss = 2;       // material class: get from 3D model
//    // designation (table 3 pg. 66): get from 3D model
//    let designation = 'flat plate keel'; // or shel plating or chain locker
//    
//    
//    let nextTo = 'water balast tank';   // nextTo: get from 3D model
//    let location = "side";              // plate location (side || bottom || deck): get from 3D model   
//    let strength_relevant = true;   // strength_relevant: get from 3D model or user input
//    let a = 1;                      // breadth of smaller side of plate panel [m]: define maximum | get from 3D model               
//    let b = 2;                      // breadth of larger side of plate panel [m]: define maximum | get from 3D model
//    
//    // factor considering aspect ratio of plate panel: done
//    let c_a = math.eval((math.sqrt(3+alfa^2)-alfa)/math.sqrt(3));
//    let r = undefined; // radius of curved plates: get from 3D model
//        if (r < 2*a) {alert("Plate radius can not be less than 2x plate's smaller side")}
//
//    let c_r;  // plate curvature: done
//        if (r === 0){
//            c_r = 1;    //c_r is equals to 1 for flat plates
//        } else if(r){
//            c_r = 1 - (a/2*r); // for curved plates
//        }
//    
//     let sigma_perm;     // permissible stress (2.4.2)
//        if (stiff_direct === 'transv'){
//            sigma_perm = math.eval(1.125*prop.ReH*( math.sqrt(1-3*(tau_L/prop.ReH)^2) - 0.89*sigma_L/prop.ReH ));  
//            } else if (stiff_direct === 'long'){
//                    sigma_perm = math.eval(1.125*prop.ReH*( math.sqrt(1-3*(tau_L/prop.ReH)^2 -0.786*(sigma_L/prop.ReH)^2) - 0.062*sigma_L/prop.ReH ));
//            } else alert('Stiffners direction has not been properly defined. Valid inputs are: "long" and "transv".');
//
//    // equivalent plate thickness: calculate
//    let t_eq = undefined; 
//    
//    // required net thickness: done
//    let t_;  
//        // 2.4.2 - pg. 66
//        t_ = math.eval(15.81*a*math.sqrt((1*SF.sf_m)/(prop.f_pL*sigma_perm))*c_a*c_r);
//        console.log(t_); 
//    
//    // corrosion addition: done (2.3.2)
//    let t_k; 
//        switch (nextTo){
//            case "general":
//                t_k = 0.0005; // 0.5 mm
//                break;
//            case "oil tank":
//                t_k = 0.0007; // 0.7 mm
//                break;
//            case "water balast tank" || "sewage tanks" || "sea chests":
//                t_k = 0.001;  // 1 mm
//                break;
//            case "chain locker":
//                t_k = 0.002; // 2 mm
//                break;
//            default: 
//                alert("If this is a steel plate which application is not:  \n1. General; \n2. Lubrication oil, gas oil or equivalent tanks; \n3. Water ballast, sewage tanks, sea chests; or \n4. Chain locker, \nthe corrosion addition factor shall be agreed with the society. (See DNVGL-RU-NAVAL-Pt3-Ch1-Sec4: 2.3.2 Steel)");
//                break;
//            }
//        
//   
//    // minimum thickness (2.4.2): done
//    let t_minimum;
//        switch (designation){
//            case "flat plate keel":
//                t_minimum = 14*math.sqrt(VP.L/prop.ReH);
//                if ( t_minimum > t_){
//                    t_ = t_minimum;
//                    }
//                break;
//            case "shel plating":
//                if (z < VP.T+c0/2){
//                    t_minimum = 10*math.sqrt(VP.L/prop.prop.ReH);
//                    if ( t_minimum > t_){
//                        t_ = t_minimum;
//                        }
//                    } else {
//                        t_minimum = 7*math.sqrt(VP.L/prop.ReH);
//                        if ( t_minimum > t_){
//                            t_ = t_minimum;
//                        }
//                    }
//                break;
//            case "chain locker":
//                t_minimum = 0.005; // 5 mm
//                    if ( t_minimum > t_){
//                        t_ = t_minimum;
//                        }
//                break;
//            default:
//                if (strength_relevant){
//                    t_minimum = 0.003; // 3 mm
//                } else t_minimum = 0;
//                
//                if ( t_minimum > t_){
//                    t_ = t_minimum;
//                }
//                    
//            break;
//        }
//        
//    console.log(t_minimum);
//        
//     
//    
//    // plate grade: done
//    let grade;
//        switch (t){            
//            case (t <= 0.015):
//                grade = 'A/AH';
//                break;
//            case (t > 0.015 && t <= 0.020):
//                if(clss === 1 || clss === 2){
//                    grade = 'A/AH';
//                } else if (clss === 3){
//                    grade = 'B/BH';
//                } else alert("Plate class must be defined first! Allowed values are 1, 2 or 3. See DNVGL-RU-NAVAL Part 3 | Chapter 1 | pg. 49");
//                break;
//            case (t > 0.020 && t <= 0.025):
//                if(clss === 1){
//                    grade = 'A/AH';
//                } else if(clss === 2){
//                    grade = 'B/AH';
//                } else if (clss === 3){
//                    grade = 'D/DH';
//                } else alert("Plate class must be defined first! Allowed values are 1, 2 or 3. See DNVGL-RU-NAVAL Part 3 | Chapter 1 | pg. 49");
//                break;
//            case (t > 0.025 && t <= 0.030):
//                if(clss === 1){
//                    grade = 'A/AH';
//                } else if(clss === 2 || clss === 3){
//                    grade = 'D/DH';
//                } else alert("Plate class must be defined first! Allowed values are 1, 2 or 3. See DNVGL-RU-NAVAL Part 3 | Chapter 1 | pg. 49");
//                break;
//            case (t > 0.030 && t <= 0.040):
//                if(clss === 1){
//                    grade = 'B/AH';
//                } else if(clss === 2){
//                    grade = 'D/DH';
//                } else if (clss === 3){
//                    grade = 'E/EH';
//                } else alert("Plate class must be defined first! Allowed values are 1, 2 or 3. See DNVGL-RU-NAVAL Part 3 | Chapter 1 | pg. 49");
//                break; 
//            case (t > 0.040 && t <= 0.060):
//                if(clss === 1){
//                    grade = 'D/DH';
//                } else if(clss === 2 || clss === 3){
//                    grade = 'E/EH';
//                } else alert("Plate class must be defined first! Allowed values are 1, 2 or 3. See DNVGL-RU-NAVAL Part 3 | Chapter 1 | pg. 49");
//                break;
//            case (t > 0.060 && t <= 0.100):
//                if(clss === 1){
//                    grade = 'D/DH';
//                } else if(clss === 2 || clss === 3){
//                    grade = 'E/EH';
//                } else alert("Plate class must be defined first! Allowed values are 1, 2 or 3. See DNVGL-RU-NAVAL Part 3 | Chapter 1 | pg. 49");
//                break;
//            default:
//                alert("No class is defined in the rules for this thickness. \nSee DNVGL-RU-NAVAL Part 3 | Chapter 1 | pg. 49");
//                break;
//        }
//    
//    
//}
//    pannelConstructor();