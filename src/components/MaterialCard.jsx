import InputSelect from "./InputSelect";

function MaterialCard({
  fck,
  setFck,
  fy,
  setFy,
  exposure,
  setExposure,
  concreteGrades,
  steelGrades,
  exposureConditions,
}) {
  return (
    <div className="section-card">
      <h2> Material Properties</h2>

      <div className="input-grid">
        <InputSelect
          label="Concrete Grade (fck)"
          value={fck}
          onChange={(e) => setFck(e.target.value)}
          options={concreteGrades}
        />

        <InputSelect
          label="Steel Grade (fy)"
          value={fy}
          onChange={(e) => setFy(e.target.value)}
          options={steelGrades}
        />

        <InputSelect
          label="Exposure Condition"
          value={exposure}
          onChange={(e) => setExposure(e.target.value)}
          options={exposureConditions}
        />
      </div>
    </div>
  );
}

export default MaterialCard;