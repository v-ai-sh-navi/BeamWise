import InputField from "./InputField";

function LoadingCard({
    floorFinish,
    setFloorFinish,
    liveLoad,
    setLiveLoad,
    unitWeight,
    setUnitWeight

}) {
  return (
    <div className="section-card">
      <h2> Loading </h2>

      <div className="input-grid">

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

      </div>
    </div>
  );
}

export default LoadingCard;