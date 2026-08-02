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
import BeamSummary from "./components/BeamSummary";
import ServiceabilityCard from "./components/ServiceabilityCard";
import { generatePDF } from "./utils/pdfGenerator";
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
  const [serviceabilityResults, setServiceabilityResults] = useState(null);
  const [inputs, setInputs] = useState(null);
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
        mainBarDia: Number(mainBarDia),
        stirrupDia: Number(stirrupDia),

        exposure

    };
  
    setInputs(inputs);

    const geo =
        geometry(inputs);
    

    const loads =
        loadCalculations(
            inputs,
            geo
        );
    

    const depth =
        depthCalculations(
            inputs,
            geo,
            loads
        );

   

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

  
    <BeamSummary
    beamWidth={beamWidth}
    results={results}
    />
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

stirrupDia={stirrupDia}

setStirrupDia={setStirrupDia}

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


              


              
            


{stirrupResults && shearResults && (

<ServiceabilityCard

beamWidth={beamWidth}

span={span}

fck={fck}

results={results}

reinforcementResults={reinforcementResults}

setServiceabilityResults={setServiceabilityResults}

/>

)}
{serviceabilityResults && (

<div className="results">

<h2>Serviceability Check</h2>

<h3>Cracking Check</h3>

<p>
Service Moment :
<b>{(serviceabilityResults.MuService/1000000).toFixed(2)} kN·m</b>
</p>

<p>
Cracking Moment :
<b>{(serviceabilityResults.Mcr/1000000).toFixed(2)} kN·m</b>
</p>

<p>
Cracking Status :
<b>

<span
className={
serviceabilityResults.crackStatus==="UNCRACKED"
?
"safe"
:
"not-safe"
}
>

{serviceabilityResults.crackStatus}

</span>

</b>
</p>

<hr/>

<h3>Deflection Check</h3>

<p>
Short Term Deflection :
<b>{serviceabilityResults.deltaShort.toFixed(2)} mm</b>
</p>

<p>
Long Term Deflection :
<b>{serviceabilityResults.deltaLongTerm.toFixed(2)} mm</b>
</p>

<p>
Total Deflection :
<b>{serviceabilityResults.deltaTotal.toFixed(2)} mm</b>
</p>

<p>
Allowable Deflection :
<b>{serviceabilityResults.deltaAllow.toFixed(2)} mm</b>
</p>

<p>
Utilization :
<b>

{(

serviceabilityResults.deltaTotal

/

serviceabilityResults.deltaAllow

*100

).toFixed(1)}

%

</b>

</p>

<p>
Status :
<b>

<span
className={
serviceabilityResults.deflectionStatus==="SAFE"
?
"safe"
:
"not-safe"
}
>

{serviceabilityResults.deflectionStatus}

</span>

</b>
</p>

</div>


)}
{serviceabilityResults && (
   <button
    onClick={() => {
    const pdfInputs = {
        beamWidth: Number(beamWidth),
        span: Number(span),
        slabSpan: Number(slabSpan),
        slabThickness: Number(slabThickness),
        cover: Number(cover),
        floorFinish: Number(floorFinish),
        liveLoad: Number(liveLoad),
        unitWeight: Number(unitWeight),
        fck: Number(fck.replace("M", "")),
        fy: Number(fy.replace("Fe", "")),
        mainBarDia: Number(mainBarDia),
        stirrupDia: Number(stirrupDia),
        exposure,
    };

    generatePDF(
        pdfInputs,
        results,
        reinforcementResults,
        shearResults,
        stirrupResults,
        serviceabilityResults
    );
}}
>
    Download PDF
</button>
)}
    </div>
          );



}

export default App; 
