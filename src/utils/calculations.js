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
  const { beamWidth, fck} = inputs;
  const mainBarDia = 20;
  const stirrupDia = 8;

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
    Math.round(
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

    // Row 42
    const A1 = 0.87 * fy * d;

    // Row 43
    const A2 = fy / (fck * beamWidth * d);

    // Row 44
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

    // Row 45
    const AstMin =
        0.0036 *
        beamWidth *
        d;

    // Row 46
    const AstProvided =
        Math.max(
            Ast,
            AstMin
        );

    

    return {

        A1,
        A2,
        Ast,
        AstMin,
        AstProvided,

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

    const AstProvided = flexure.AstProvided;

    // Area of one bar
    const areaPerBar =
        Math.PI *
        mainBarDia *
        mainBarDia /
        4;

    // Number of bars
    const noOfBars =
        Math.ceil(
            AstProvided /
            areaPerBar
        );

    // Area actually provided
    const AstActual =
        noOfBars *
        areaPerBar;

    // Steel percentage
    const steelPercentage =
        flexure.AstProvided * 100 /
        (beamWidth * d);

    // Neutral axis depth
    const xu =
        (
        0.87 *
        fy *
        flexure.AstProvided
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
        AstProvided,
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
        flexure.AstProvided * 100 /
        (beamWidth * d);
    console.log({
    AstProvided: flexure.AstProvided,
    pt,
    fy,
    fck,
    beamWidth,
    d
});

    const beta =
        Math.max(
            (0.8 * fy) /
            (6.89 * pt * 100),
            1
        );

    const tauC =
        (
            0.85 *
            Math.sqrt(0.8 * fck)
            -
            Math.sqrt(1 + 5 * beta)
            -
            1
        ) /
        (
            6 * beta
        );

    const tauCMax =
        geo.tauCMaxFactor *
        Math.sqrt(fck);

    const tauCEffective =
        Math.min(
            tauC,
            tauCMax
        );

    return{

        tauV,
        pt,
        beta,
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

    const stirrupSpacing =
        Math.min(

            (
                0.87 *
                fy *
                Asv
            )

            /

            (

                (shear.tauV - shear.tauCEffective)

                *

                beamWidth

            ),

            0.75 * d,

            300

        );

    const shearCheck =
        stirrupSpacing <= 300
            ? "SAFE"
            : "NOT SAFE";

    return{

        Asv,
        stirrupSpacing,
        shearCheck

    };

}