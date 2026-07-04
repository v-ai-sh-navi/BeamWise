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
      <h1>BeamDES</h1>
      <h3>RCC Beam Design Tool (IS 456:2000)</h3>
      <div className="card">

      <h2>Design Inputs</h2>

      <InputField
          label="Beam Width (mm)"
          value={beamWidth}
          onChange={(e)=>setBeamWidth(e.target.value)}
      />
      
    
      <InputField
          label="Clear Span (mm)"
          value={span}
          onChange={(e)=>setSpan(e.target.value)}
      />
      <InputField
          label="Slab Span (mm)"
          value={slabSpan}
          onChange={(e) => setSlabSpan(e.target.value)}
      />
       <InputField
        label="Slab Thickness(mm)"
        value={slabThickness}
        onChange={(e) => setSlabThickness(e.target.value)}
      />

      <InputField
        label="Clear Cover (mm)"
        value={cover}
        onChange={(e) => setCover(e.target.value)}
      />

      <h2>Material Properties</h2>

      <InputSelect
        label="Concrete Grade (fck)"
        value={fck}
        onChange={(e)=>setFck(e.target.value)}
        options={concreteGrades}
      />

      <InputSelect
          label="Steel Grade (fy)"
          value={fy}
          onChange={(e)=>setFy(e.target.value)}
          options={steelGrades}
      />
      <InputSelect
          label="Exposure Condition"
          value={exposure}
          onChange={(e)=>setExposure(e.target.value)}
          options={exposureConditions}
      />

      <h2>Loading</h2>

      <InputField
        label="Floor Finish (kN/m²)"
        value={floorFinish}
        onChange={(e) => setFloorFinish(e.target.value)}
      />

      <InputField
        label="Live Load (kN/m²)"
        value={liveLoad}
        onChange={(e) => setLiveLoad(e.target.value)}
      />

      <InputField
        label="Unit Weight of Concrete (kN/m³)"
        value={unitWeight}
        onChange={(e) => setUnitWeight(e.target.value)}
      />
      
      <br />
      </div>


      <button onClick={calculateBeam}>
        Calculate Beam
      </button>
      {results && (

<div className="results">

<div className="beam-box">


<h2>Recommended Beam</h2>

<h1>

{beamWidth} × {results.depth.DProvided}

</h1>

<p>mm</p>

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

)}
{results && (

<div className="results">

<h2>Reinforcement Design</h2>

<InputSelect

label="Main Bar Diameter (mm)"

value={mainBarDia}

onChange={(e)=>{

const dia = Number(e.target.value);

setMainBarDia(dia);

const reinforcement = reinforcementDesign(

{

beamWidth:Number(beamWidth),

fck:Number(fck.replace("M","")),

fy:Number(fy.replace("Fe","")),

mainBarDia:dia

},

results.geo,

results.depth,

results.flexure

);

setReinforcementResults(reinforcement);

}}

options={mainBarDiameters}

/>

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

<div className="results">

<h2>Shear Design</h2>

<InputSelect

label="Stirrup Diameter (mm)"

value={stirrupDia}

onChange={(e)=>{

const dia = Number(e.target.value);

setStirrupDia(dia);

const shear = shearDesign(

{

beamWidth:Number(beamWidth),

fck:Number(fck.replace("M","")),

fy:Number(fy.replace("Fe",""))

},

results.geo,

results.depth,

results.loads,

results.flexure

);

setShearResults(shear);

const stirrup = stirrupDesign(

{

beamWidth:Number(beamWidth),

fy:Number(fy.replace("Fe","")),

stirrupDia:dia

},

results.depth,

shear

);

setStirrupResults(stirrup);

}}

options={stirrupDiameters}

/>

</div>

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
          );
    }



export default App; 
