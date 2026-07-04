import { useState } from "react";
import InputField from "./components/InputField";
import InputSelect from "./components/InputSelect";
import {
  concreteGrades,
  steelGrades,
  mainBarDiameters,
  stirrupDiameters,
  exposureConditions,
} from "./constants";
import {
    geometry,
    loadCalculations,
    depthCalculations,
    flexureDesign,
    reinforcementDesign,
    shearDesign,
    stirrupDesign
} from "./utils/calculations";
import Header from "./components/Header";
import GeometryCard from "./components/GeometryCard";
import MaterialCard from "./components/MaterialCard";
import LoadingCard from "./components/LoadingCard";
import ReinforcementCard from "./components/ReinforcementCard";
import ShearCard from "./components/ShearCard";
import "./App.css";

function App() {
  const [results, setResults] = useState(null);
  const [beamWidth, setBeamWidth] = useState("");

  const [span, setSpan] = useState("");
  const [slabSpan, setSlabSpan] = useState("");

  const [fck, setFck] = useState("");
  const [fy, setFy] = useState("");

  const [slabThickness, setSlabThickness] = useState("");
  const [cover, setCover] = useState("");

  const [floorFinish, setFloorFinish] = useState("");
  const [liveLoad, setLiveLoad] = useState("");
  const [unitWeight, setUnitWeight] = useState("25");

  const [mainBarDia, setMainBarDia] = useState("");
  const [stirrupDia, setStirrupDia] = useState("");

  const [exposure, setExposure] = useState("Moderate");
  const [flexureResults, setFlexureResults] = useState(null);

  const [reinforcementResults, setReinforcementResults] = useState(null);

  const [shearResults, setShearResults] = useState(null);

  const [stirrupResults, setStirrupResults] = useState(null);

  const calculateBeam = () => {

    const inputs = {

        beamWidth:Number(beamWidth),

        span:Number(span),

        slabSpan: Number(slabSpan),

        slabThickness:Number(slabThickness),

        cover:Number(cover),

        floorFinish:Number(floorFinish),

        liveLoad:Number(liveLoad),

        unitWeight:Number(unitWeight),

        fck:Number(fck.replace("M","")),

        fy:Number(fy.replace("Fe","")),

        exposure

    };

    const geo =
        geometry(inputs);
    console.log("Geometry:", geo);

    const loads =
        loadCalculations(
            inputs,
            geo
        );
    console.log("Loads:", loads);

    const depth =
        depthCalculations(
            inputs,
            geo,
            loads
        );
    console.log("Depth:", depth);
    const flexure = flexureDesign(

    {
        beamWidth: Number(beamWidth),
        fck: Number(fck.replace("M","")),
        fy: Number(fy.replace("Fe",""))
    },

    geo,

    depth,

    loads

    );
    console.log("Flexure:", flexure);

setResults({

    geo,

    loads,

    depth,

    flexure

});

    
};
  return (
    <div className="container">
    <Header/>
      <div className="main-layout"></div>
      <div className="card">
      <div className="main-layout">

    <GeometryCard
      beamWidth={beamWidth}
      setBeamWidth={setBeamWidth}
      span={span}
      setSpan={setSpan}
      slabSpan={slabSpan}
      setSlabSpan={setSlabSpan}
      slabThickness={slabThickness}
      setSlabThickness={setSlabThickness}
      cover={cover}
      setCover={setCover}
    />
    <MaterialCard
      fck={fck}
      setFck={setFck}
      fy={fy}
      setFy={setFy}
      exposure={exposure}
      setExposure={setExposure}
      concreteGrades={concreteGrades}
      steelGrades={steelGrades}
      exposureConditions={exposureConditions}
    />
    <LoadingCard
      floorFinish={floorFinish}
      setFloorFinish={setFloorFinish}
      liveLoad={liveLoad}
      setLiveLoad={setLiveLoad}
      unitWeight={unitWeight}
      setUnitWeight={setUnitWeight}
    />
    </div>
      
      <button onClick={calculateBeam}>
        Calculate Beam
      </button>
      </div>
     <div className="result-panel">

  {results && (

  <>

  <h1 className="results-title">
      Design Results
  </h1>

  <div className="results">

  <div className="beam-box"> 


<h2>Recommended Beam</h2>

<h1>

{beamWidth} × {results.depth.DProvided}

</h1>

<p>(mm)</p>

</div>

<p>
Effective Depth :
<b>
{" "}
{results.depth.dProvided.toFixed(2)}
mm
</b>
</p>

<hr/>

<p>
Ultimate Moment :
<b>
{" "}
{results.loads.Mu.toFixed(2)}
kNm
</b>
</p>

<p>
Ultimate Shear :
<b>
{" "}
{results.loads.Vu.toFixed(2)}
kN
</b>
</p>

</div>
</>

  )}

{results && (

<div className="results">

<h2>Reinforcement Design</h2>

{results && (

<ReinforcementCard

mainBarDia={mainBarDia}

setMainBarDia={setMainBarDia}

beamWidth={beamWidth}

fck={fck}

fy={fy}

results={results}

setReinforcementResults={setReinforcementResults}

mainBarDiameters={mainBarDiameters}

/>

)}
</div>

)}
{reinforcementResults && (

<div className="results">

<h2>Reinforcement Details</h2>

<p>
Area of One Bar :
<b> {reinforcementResults.areaPerBar.toFixed(2)} mm²</b>
</p>

<p>
Bars Required :
<b> {reinforcementResults.noOfBars}</b>
</p>

<p>
Steel Provided :
<b> {reinforcementResults.AstActual.toFixed(2)} mm²</b>
</p>

<p>
Steel Percentage :
<b> {reinforcementResults.steelPercentage.toFixed(2)} %</b>
</p>

<p>
Neutral Axis :
<b> {reinforcementResults.xu.toFixed(2)} mm</b>
</p>

<p>
Xu,max :
<b> {reinforcementResults.xuMax.toFixed(2)} mm</b>
</p>

<p>
Status :
<b><span
className={
reinforcementResults.xuCheck==="SAFE"
? "safe"
: "not-safe"
}
>
{reinforcementResults.xuCheck}
</span></b>
</p>

</div>

)}
{reinforcementResults && (
<ShearCard

stirrupDia={stirrupDia}

setStirrupDia={setStirrupDia}

beamWidth={beamWidth}

fck={fck}

fy={fy}

results={results}

setShearResults={setShearResults}

setStirrupResults={setStirrupResults}

stirrupDiameters={stirrupDiameters}

/>

)}
{stirrupResults && shearResults && (

<div className="results">

<h2>Shear Reinforcement</h2>

<p>
τv :
<b> {shearResults.tauV.toFixed(3)} MPa</b>
</p>

<p>
τc :
<b> {shearResults.tauCEffective.toFixed(3)} MPa</b>
</p>

<p>
Provide :
<b> 2 Legged {stirrupDia} mm Stirrups</b>
</p>

<p>
Spacing :
<b>@ {Math.round(stirrupResults.stirrupSpacing)} mm c/c</b>
</p>

<p>
Status :
<b><span
className={
stirrupResults.shearCheck==="SAFE"
? "safe"
: "not-safe"
}
>
{stirrupResults.shearCheck}
</span></b>             
</p>

</div>

)}
</div>


              


              
            </div>
          );
    }



export default App; 
