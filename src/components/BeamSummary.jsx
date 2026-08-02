function BeamSummary({
    beamWidth,
    results
}
){return(
    <div className="section-card">
        <h2>Recommended Beam</h2>

        <h1>

        {beamWidth} × {results.depth.DProvided}

        </h1>

        <p>(mm)</p>

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

)
    }
export default BeamSummary;