import InputSelect from "./InputSelect";
import { reinforcementDesign } from "../utils/calculations";

function ReinforcementCard({
  mainBarDia,
  setMainBarDia,

  beamWidth,
  fck,
  fy,

  results,

  setReinforcementResults,

  mainBarDiameters,
}) {

  return (
    <div className="section-card">

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
  );
}

export default ReinforcementCard;
