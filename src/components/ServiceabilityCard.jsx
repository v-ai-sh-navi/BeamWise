import { serviceabilityDesign } from "../utils/calculations";

function ServiceabilityCard({

beamWidth,

span,

fck,

results,

reinforcementResults,

setServiceabilityResults

}){

const handleClick = () => {

const inputs = {

beamWidth:Number(beamWidth),

span:Number(span),

fck:Number(fck.replace("M",""))

};

const serviceability = serviceabilityDesign(

inputs,

results,

reinforcementResults

);

setServiceabilityResults(serviceability);

};

return(

<div className="section-card">

<h2>Serviceability Check</h2>

<button onClick={handleClick}>

Check Serviceability

</button>

</div>

);

}

export default ServiceabilityCard;