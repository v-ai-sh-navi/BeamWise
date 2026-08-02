import {
    tauCTable,
    tauCMaxTable
} from "../constants";
// =======================
// GEOMETRY
// =======================

export function geometry(inputs) {
  const {
    beamWidth,
    span,
    cover,
    fy,
    exposure,
  } = inputs;

  let clearCover = cover;

  // Optional: automatic cover from exposure
  if (!cover) {
    switch (exposure) {
      case "Mild":
        clearCover = 20;
        break;
      case "Moderate":
        clearCover = 25;
        break;
      case "Severe":
        clearCover = 35;
        break;
      case "Very Severe":
        clearCover = 50;
        break;
      default:
        clearCover = 25;
    }
  }

  let xuMaxFactor = 0.48;
  if (fy === 250) xuMaxFactor = 0.53;
  if (fy === 415) xuMaxFactor = 0.48;
  if (fy === 500) xuMaxFactor = 0.46;

  let k = 0.138;
  if (fy === 250) k = 0.149;
  if (fy === 415) k = 0.138;
  if (fy === 500) k = 0.133;

  const tauCMaxFactor = 0.62;

  const limitingLD = 20;

const dRequired =
    span /
    limitingLD;

  const DProvided =
    Math.round(
        (
            beamWidth +
            (span < 6000 ? 100 : 150)
        ) / 50
    ) * 50;
    return{
    clearCover,

    xuMaxFactor,

    tauCMaxFactor,

    k,

    limitingLD,

    dRequired,

    DProvided

    };
 
}

// =======================
// LOADS
// =======================

export function loadCalculations(inputs, geo) {
  const {
    slabThickness,
    floorFinish,
    liveLoad,
    unitWeight,
    beamWidth,
    span,
    slabSpan
  } = inputs;

  const slabSelfWeight = unitWeight * slabThickness / 1000;

  const totalSlabLoad = slabSelfWeight + floorFinish;

  const tributaryWidth = slabSpan / 2;

  const slabLoadOnBeam = totalSlabLoad * tributaryWidth / 1000;

  const liveLoadOnBeam = liveLoad * tributaryWidth / 1000;

  const beamSelfWeight =
    unitWeight * beamWidth * geo.DProvided / 1000000;

  const totalDL = slabLoadOnBeam + beamSelfWeight;

  const totalLL = liveLoadOnBeam;

  const ultimateLoad = 1.5 * (totalDL + totalLL);

  const Mu = ultimateLoad * span * span / (8 * 1000000);

  const Vu = ultimateLoad * span / (2000);

  return {
    slabSelfWeight,
    totalSlabLoad,
    slabLoadOnBeam,
    liveLoadOnBeam,
    beamSelfWeight,
    totalDL,
    totalLL,
    ultimateLoad,
    Mu,
    Vu,
  };
}

// =======================
// DEPTH
// =======================

export function depthCalculations(inputs, geo, loads) {
  const { beamWidth, fck, mainBarDia, stirrupDia} = inputs;
  
  const dRequiredFlexure = Math.sqrt(
    (loads.Mu * 1000000) /
      (geo.k * fck * beamWidth)
  );

  const DRequired =
    dRequiredFlexure +
    geo.clearCover +
    stirrupDia +
    mainBarDia / 2;

  const DProvided =
    Math.ceil(
        DRequired / 25
    ) * 25;
  const dProvided =
    DProvided -
    geo.clearCover -
    stirrupDia -
    mainBarDia / 2;

  return {
    dRequiredFlexure,
    DRequired,
    DProvided,
    dProvided,
  };
}

// =======================
// FLEXURE
// =======================

export function flexureDesign(inputs, geo, depth, loads) {

    const { beamWidth, fck, fy, mainBarDia } = inputs;

    const d = depth.dProvided;

    const Mu = loads.Mu;

    const A1 = 0.87 * fy * d;

    const A2 = fy / (fck * beamWidth * d);

    const Ast =
        (
            A1 -
            Math.sqrt(
                (A1 * A1) -
                (4 * A1 * A2 * Mu * 1000000)
            )
        ) /
        (
            2 * A1 * A2
        );

    const AstMin =
        0.0036 *
        beamWidth *
        d;

    const AstRequired =
        Math.max(
            Ast,
            AstMin
        );

    

    return {
        Mu,
        A1,
        A2,
        Ast,
        AstMin,
        AstRequired,

    };

}
// =======================
// REINFORCEMENT DESIGN
// =======================

export function reinforcementDesign(
    inputs,
    geo,
    depth,
    flexure
){

    const {
        beamWidth,
        fck,
        fy,
        mainBarDia
    } = inputs;

    const d = depth.dProvided;

    const AstRequired = flexure.AstRequired;

    // Area of one bar
    const areaPerBar =
        Math.PI *
        mainBarDia *
        mainBarDia /
        4;

    // Number of bars
    const noOfBars =
        Math.ceil(
            AstRequired /
            areaPerBar
        );

    // Area actually provided

    const AstActual =
        noOfBars *
        areaPerBar;

    // Steel percentage
    const steelPercentage =
        flexure.AstRequired * 100 /
        (beamWidth * d);

    // Neutral axis depth
    const xu =
        (
        0.87 *
        fy *
        flexure.AstRequired
        )
        /
        (
        0.36 *
        fck *
        beamWidth
        );
    const xuMax =
        geo.xuMaxFactor * d;

    const xuCheck =
        xu <= xuMax
            ? "SAFE"
            : "NOT SAFE";


    return {

        areaPerBar,
        AstRequired,
        noOfBars,
        AstActual,
        steelPercentage,
        xu,
        xuMax,
        xuCheck

    };

}


// =======================
// SHEAR
// =======================
function getTauC(pt, fck) {

    // Limit pt to the range of IS 456 Table 19
    pt = Math.max(0.15, Math.min(3.0, pt));

    // Available concrete grades
    const grades = [20, 25, 30, 35, 40];

    // Use nearest available grade
    let grade = grades[0];
    let minDiff = Math.abs(fck - grades[0]);

    for (let i = 1; i < grades.length; i++) {
        const diff = Math.abs(fck - grades[i]);

        if (diff < minDiff) {
            minDiff = diff;
            grade = grades[i];
        }
    }

    // Linear interpolation between reinforcement percentages
    for (let i = 0; i < tauCTable.length - 1; i++) {

        const lower = tauCTable[i];
        const upper = tauCTable[i + 1];

        if (pt >= lower.pt && pt <= upper.pt) {

            const tauLower = lower.values[grade];
            const tauUpper = upper.values[grade];

            return (
                tauLower +
                ((pt - lower.pt) *
                    (tauUpper - tauLower)) /
                    (upper.pt - lower.pt)
            );
        }
    }

    // If pt = 3%
    return tauCTable[tauCTable.length - 1].values[grade];
}

export function shearDesign(
    inputs,
    geo,
    depth,
    loads,
    flexure
){

    const {
        beamWidth,
        fck,
        fy
    } = inputs;

    const d = depth.dProvided;

    const tauV =
        loads.Vu * 1000 /
        (beamWidth * d);

    const pt =
        flexure.AstRequired * 100 /
        (beamWidth * d);

    const tauC = getTauC(pt, fck);

    const tauCMax = tauCMaxTable[fck];
  
    const tauCEffective =
        Math.min(
            tauC,
            tauCMax
        );

    return{

        tauV,
        pt,
        tauC,
        tauCMax,
        tauCEffective

    };

}
// =======================
// STIRRUP DESIGN
// =======================

export function stirrupDesign(
    inputs,
    depth,
    shear
){

    const {

        beamWidth,
        fy,
        stirrupDia

    } = inputs;

    const d =
        depth.dProvided;

    const Asv =
        2 *
        Math.PI *
        stirrupDia *
        stirrupDia /
        4;

    let stirrupSpacing;

if (shear.tauV <= shear.tauC) {

    // Minimum shear reinforcement
    stirrupSpacing = Math.min(
        0.75 * d,
        300
    );

} else {

    // Design shear reinforcement
    stirrupSpacing = Math.min(

        (0.87 * fy * Asv) /

        (
            (shear.tauV - shear.tauC) *
            beamWidth
        ),

        0.75 * d,

        300

    );

}
    const shearCheck =
    shear.tauV <= shear.tauCMax
        ? "SAFE"
        : "NOT SAFE";

    return{

        Asv,
        stirrupSpacing,
        shearCheck

    };

}
// =======================
// SERVICEABILITY CHECK
// =======================
export function serviceabilityDesign(inputs, results, reinforcementResults) {

    const b = Number(inputs.beamWidth);

    const D = results.depth.DProvided;

    const d = results.depth.dProvided;

    const L = Number(inputs.span) ;      // mm
    
    const fck = Number(inputs.fck);

    const Ast = reinforcementResults.AstActual;

    const Mu = results.flexure.Mu;             // kNm

    const MuService = (Mu / 1.5) * 1e6; 
           // Nmm
          
    
    /* -----------------------------
       Elastic Properties
    ----------------------------- */

    const Ec = 5000 * Math.sqrt(fck);

    const Es = 200000;

    const m = Es / Ec;

    /* -----------------------------
       Gross Section
    ----------------------------- */

    const Ig = (b * Math.pow(D, 3)) / 12;

    const fcr = 0.7 * Math.sqrt(fck);

    const Z = Ig / (D / 2);
   

    const Mcr = fcr * Z;

    /* -----------------------------
       Cracked Section
    ----------------------------- */

    const x =
        (m * Ast) /
        (b * (1 + (m * Ast) / (b * d)));
        
   
    const Icr =
        (b * Math.pow(x, 3)) / 3 +
        m * Ast * Math.pow(d - x, 2);
      

    /* -----------------------------
       Crack Check
    ----------------------------- */
   

    const crackStatus =
        MuService <= Mcr
            ? "UNCRACKED"
            : "CRACKED";

    /* -----------------------------
       Effective Inertia
    ----------------------------- */

    const Ieff =
        Icr +
        (Ig - Icr) *
        Math.pow(Mcr / (MuService * 1e6), 2);

    /* -----------------------------
       Short-Term Deflection
    ----------------------------- */

    const w = results.loads.ultimateLoad ;

    let deltaShort;

    if (crackStatus === "UNCRACKED") {

        deltaShort =
            (5 * (w/1.5) * Math.pow(L, 4)) /
            (384 * Ec * Ig);

    }

    else {

        deltaShort =
            (5 * (w/1.5) * Math.pow(L, 4)) /
            (384 * Ec * Ieff);

    }

    /* -----------------------------
       Long-Term Deflection
    ----------------------------- */

    const creepCoefficient = 1.6;

    const deltaCreep =
        deltaShort * creepCoefficient;

    const shrinkageStrain = 0.0003;

    const deltaShrinkage =
        (0.125 * shrinkageStrain * Math.pow(L, 2)) /
        (8 * D);

    const deltaLongTerm =
        deltaCreep + deltaShrinkage;

    const deltaTotal =
        deltaShort + deltaLongTerm;

    const deltaAllow =
        L / 250;

    const deflectionStatus =
        deltaTotal <= deltaAllow
            ? "SAFE"
            : "NOT SAFE";

    return {

    MuService,

    Ec,
    Es,
    m,

    Ig,

    fcr,

    Z,

    Mcr,

    x,

    Icr,

    crackStatus,

    Ieff,

    deltaShort,

    creepCoefficient,

    deltaCreep,

    shrinkageStrain,

    deltaShrinkage,

    deltaLongTerm,

    deltaTotal,

    deltaAllow,

    deflectionStatus
   

};
}