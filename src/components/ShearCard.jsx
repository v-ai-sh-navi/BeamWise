import InputSelect from "./InputSelect";
import { shearDesign, stirrupDesign } from "../utils/calculations";

function ShearCard({
  stirrupDia,
  setStirrupDia,

  beamWidth,
  fck,
  fy,

  results,

  setShearResults,
  setStirrupResults,

  stirrupDiameters,
}) {
  return (
    <div className="section-card">

      <h2>Shear Design</h2>

      <InputSelect
        label="Stirrup Diameter (mm)"
        value={stirrupDia}

        onChange={(e) => {

          const dia = Number(e.target.value);

          setStirrupDia(dia);

          const shear = shearDesign(

            {
              beamWidth: Number(beamWidth),
              fck: Number(fck.replace("M","")),
              fy: Number(fy.replace("Fe",""))
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
  );
}

export default ShearCard;