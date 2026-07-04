import InputField from "./InputField";

function GeometryCard({
  beamWidth,
  setBeamWidth,
  span,
  setSpan,
  slabSpan,
  setSlabSpan,
  slabThickness,
  setSlabThickness,
  cover,
  setCover,
}) {
  return (
    <div className="section-card">
      <h2> Geometry</h2>

      <div className="input-grid">

        <InputField
          label="Beam Width (mm)"
          value={beamWidth}
          onChange={(e) => setBeamWidth(e.target.value)}
        />

        <InputField
          label="Clear Span (mm)"
          value={span}
          onChange={(e) => setSpan(e.target.value)}
        />

        <InputField
          label="Slab Span (mm)"
          value={slabSpan}
          onChange={(e) => setSlabSpan(e.target.value)}
        />

        <InputField
          label="Slab Thickness (mm)"
          value={slabThickness}
          onChange={(e) => setSlabThickness(e.target.value)}
        />

        <InputField
          label="Clear Cover (mm)"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
        />

      </div>
    </div>
  );
}

export default GeometryCard;