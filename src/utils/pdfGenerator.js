import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export function generatePDF(
    inputs,
    results,
    reinforcementResults,
    shearResults,
    stirrupResults,
    serviceabilityResults
){
    const doc = new jsPDF();
    doc.setFontSize(20);

doc.text(
    "BeamWise",
    80,
    20
);

doc.setFontSize(14);

doc.text(
    "RCC Beam Design Report",
    60,
    30
);
const today = new Date();

doc.setFontSize(10);

doc.text(
    `Generated on: ${today.toLocaleString()}`,
    14,
    40
);

autoTable(doc, {
    startY: 50,

    head: [["Geometry", "Value"]],

    body: [
        ["Beam Width", `${inputs.beamWidth} mm`],
        ["Span", `${inputs.span} mm`],
        ["Slab Span", `${inputs.slabSpan} mm`],
        ["Slab Thickness", `${inputs.slabThickness} mm`],
        ["Clear Cover", `${inputs.cover} mm`]
    ]
});

autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,

    head: [["Material Properties", "Value"]],

    body: [
        ["Concrete Grade", `M${inputs.fck}`],
        ["Steel Grade", `Fe${inputs.fy}`],
        ["Exposure Condition", inputs.exposure]
    ]
});
autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,

    head: [["Loading", "Value"]],

    body: [
        ["Slab Self Weight", `${results.loads.slabSelfWeight.toFixed(2)} kN/m²`],
        ["Total Slab Load", `${results.loads.totalSlabLoad.toFixed(2)} kN/m²`],
        ["Slab Load on Beam", `${results.loads.slabLoadOnBeam.toFixed(2)} kN/m`],
        ["Live Load on Beam", `${results.loads.liveLoadOnBeam.toFixed(2)} kN/m`],
        ["Beam Self Weight", `${results.loads.beamSelfWeight.toFixed(2)} kN/m`],
        ["Total Dead Load", `${results.loads.totalDL.toFixed(2)} kN/m`],
        ["Total Live Load", `${results.loads.totalLL.toFixed(2)} kN/m`],
        ["Ultimate Load", `${results.loads.ultimateLoad.toFixed(2)} kN/m`],
        ["Ultimate Moment (Mu)", `${results.loads.Mu.toFixed(2)} kNm`],
        ["Ultimate Shear (Vu)", `${results.loads.Vu.toFixed(2)} kN`]
    ]
});
autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,

    head: [["Effective Depth", "Value"]],

    body: [
        ["Overall Depth", `${results.depth.DProvided} mm`],
        ["Effective Depth", `${results.depth.dProvided.toFixed(2)} mm`],
        ["Required Effective Depth", `${results.depth.dRequiredFlexure.toFixed(2)} mm`]
    ]
});
autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,

    head: [["Flexural Design", "Value"]],

    body: [
        ["Ultimate Moment (Mu)", `${results.flexure.Mu.toFixed(2)} kNm`],
        ["Required Steel (Ast)", `${results.flexure.Ast.toFixed(2)} mm²`],
        ["Minimum Steel", `${results.flexure.AstMin.toFixed(2)} mm²`],
        ["Design Steel", `${results.flexure.AstRequired.toFixed(2)} mm²`]
    ]
});
autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,

    head: [["Reinforcement Details", "Value"]],

    body: [
        ["Main Bar Diameter", `${inputs.mainBarDia} mm`],
        ["Area of One Bar", `${reinforcementResults.areaPerBar.toFixed(2)} mm²`],
        ["Number of Bars", reinforcementResults.noOfBars],
        ["Steel Required", `${reinforcementResults.AstRequired.toFixed(2)} mm²`],
        ["Steel Actually Provided", `${reinforcementResults.AstActual.toFixed(2)} mm²`],
        ["Steel Percentage", `${reinforcementResults.steelPercentage.toFixed(2)} %`],
        ["Neutral Axis (xu)", `${reinforcementResults.xu.toFixed(2)} mm`],
        ["Limiting Neutral Axis (xu,max)", `${reinforcementResults.xuMax.toFixed(2)} mm`],
        ["Section Status", reinforcementResults.xuCheck]
    ],

    didParseCell: function (data) {

        if (
            data.section === "body" &&
            data.column.index === 1 &&
            data.row.index === 8
        ) {
            if (data.cell.raw === "SAFE") {
                data.cell.styles.textColor = [0, 150, 0];
                data.cell.styles.fontStyle = "bold";
            }

            if (data.cell.raw === "NOT SAFE") {
                data.cell.styles.textColor = [220, 0, 0];
                data.cell.styles.fontStyle = "bold";
            }
        }
    }
});
autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,

    head: [["Shear Design", "Value"]],

    body: [
        ["Nominal Shear Stress (tau_v)", `${shearResults.tauV.toFixed(3)} N/mm²`],
        ["Steel Percentage (pt)", `${shearResults.pt.toFixed(3)} %`],
        ["Concrete Shear Strength (Tau_c)", `${shearResults.tauC.toFixed(3)} N/mm²`],
        ["Maximum Shear Strength (Tau_c max)", `${shearResults.tauCMax.toFixed(3)} N/mm²`],
        ["Effective Shear Strength", `${shearResults.tauCEffective.toFixed(3)} N/mm²`],
        
    ],

    didParseCell: function (data) {

        if (
            data.section === "body" &&
            data.column.index === 1 &&
            data.row.index === 6
        ) {

            if (data.cell.raw === "SAFE") {
                data.cell.styles.textColor = [0, 150, 0];
                data.cell.styles.fontStyle = "bold";
            }

            if (data.cell.raw === "NOT SAFE") {
                data.cell.styles.textColor = [220, 0, 0];
                data.cell.styles.fontStyle = "bold";
            }

        }

    }

});
autoTable(doc, {
  startY: doc.lastAutoTable.finalY + 10,

  head: [["Stirrup Design", "Value"]],

  body: [
    ["Stirrup Diameter", `${inputs.stirrupDia} mm`],
    ["No. of Legs", "2"],
    ["Area of Stirrups (Asv)", `${stirrupResults.Asv.toFixed(2)} mm²`],
    ["Required Spacing", `${stirrupResults.stirrupSpacing.toFixed(0)} mm c/c`],
    ["Shear Status", stirrupResults.shearCheck],
  ],

  theme: "striped",

  headStyles: {
    fillColor: [52, 127, 185],
    textColor: 255,
    fontStyle: "bold",
  },

  alternateRowStyles: {
    fillColor: [245, 245, 245],
  },

  styles: {
    fontSize: 11,
    cellPadding: 3,
  },

  didParseCell(data) {
    if (
      data.column.index === 1 &&
      data.row.raw[0] === "Shear Status"
    ) {
      data.cell.styles.textColor =
        stirrupResults.shearCheck === "SAFE"
          ? [0, 128, 0]
          : [255, 0, 0];

      data.cell.styles.fontStyle = "bold";
    }
  },
});
autoTable(doc, {
  startY: doc.lastAutoTable.finalY + 10,

  head: [["Serviceability", "Value"]],

  body: [
    ["Gross Moment of Inertia (Ig)", `${serviceabilityResults.Ig.toFixed(2)} mm^4`],
    ["Cracked Moment of Inertia (Icr)", `${serviceabilityResults.Icr.toFixed(2)} mm^4`],
    ["Effective Moment of Inertia (Ieff)", `${serviceabilityResults.Ieff.toFixed(2)} mm^4`],
    ["Modulus of Elasticity (Ec)", `${serviceabilityResults.Ec.toFixed(0)} N/mm²`],
    ["Short-Term Deflection", `${serviceabilityResults.deltaShort.toFixed(2)} mm`],
    ["Long-Term Deflection", `${serviceabilityResults.deltaLongTerm.toFixed(2)} mm`],
    ["Total Deflection", `${serviceabilityResults.deltaTotal.toFixed(2)} mm`],
    ["Allowable Deflection", `${serviceabilityResults.deltaAllow.toFixed(2)} mm`],
    ["Deflection Status", serviceabilityResults.deflectionStatus],
  ],

  theme: "striped",

  headStyles: {
    fillColor: [52,127,185],
    textColor:255,
    fontStyle:"bold"
  },

  alternateRowStyles:{
    fillColor:[245,245,245]
  },

  styles:{
    fontSize:11,
    cellPadding:3
  },

  didParseCell(data){
    if(
      data.column.index===1 &&
      data.row.raw[0]==="Deflection Status"
    ){
      data.cell.styles.textColor =
      serviceabilityResults.deflectionStatus==="SAFE"
      ? [0,128,0]
      : [255,0,0];

      data.cell.styles.fontStyle="bold";
    }
  }
});

autoTable(doc,{

startY:doc.lastAutoTable.finalY+10,

head:[["Design Summary","Status"]],

body:[

["Reinforcement",reinforcementResults.xuCheck],

["Shear Design",stirrupResults.shearCheck],

["Serviceability",serviceabilityResults.deflectionStatus],

[
"Overall Beam Design",

(

reinforcementResults.xuCheck==="SAFE" &&
stirrupResults.shearCheck==="SAFE" &&
serviceabilityResults.deflectionCheck==="SAFE"
)

?

"SAFE"

:

"NOT SAFE"

]

],

theme:"striped",

headStyles:{
fillColor:[52,127,185],
textColor:255,
fontStyle:"bold"
},

alternateRowStyles:{
fillColor:[245,245,245]
},

styles:{
fontSize:11,
cellPadding:3
},

didParseCell(data){

if(data.column.index!==1) return;

const value=data.cell.raw;

if(value==="SAFE"){

data.cell.styles.textColor=[0,128,0];

data.cell.styles.fontStyle="bold";

}

else if(value==="NOT SAFE"){

data.cell.styles.textColor=[255,0,0];

data.cell.styles.fontStyle="bold";

}
else if(value==="OK"){

data.cell.styles.textColor=[0,128,0];

data.cell.styles.fontStyle="bold";

}
else if(value==="NOT OK"){

data.cell.styles.textColor=[255,0,0];

data.cell.styles.fontStyle="bold";

}

}

});
const pageCount = doc.internal.getNumberOfPages();

for(let i=1;i<=pageCount;i++){

doc.setPage(i);

doc.setFontSize(9);

doc.setTextColor(120);

doc.text(

`Generated using BeamWise | Page ${i} of ${pageCount}`,

105,

290,

{align:"center"}

);

}

doc.save("BeamWise_Report.pdf");
}