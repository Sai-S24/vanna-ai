import React, { useEffect } from "react";
import Plot from "react-plotly.js";

const PlotlyComponent = ({ data }:any) => {
  useEffect(() => {
    // Optional: You can modify the data or perform any other initialization here
  }, [data]);

  return (
    <div className="plotly-container">
      <Plot
        data={JSON.parse(data.fig).data}
        layout={JSON.parse(data.fig).layout}
      />
    </div>
  );
};

export default PlotlyComponent;
