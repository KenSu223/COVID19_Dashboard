import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import useResizeObserver from "./useResizeObserver";

function USMap({data,property}){
   
        const svgRef = useRef();
        const wrapperRef = useRef();
        // const dimensions = useResizeObserver(wrapperRef);
        const [selectedCountry, setSelectedCountry] = useState(null);
        // const dimensions=useResizeObserver(wrapperRef);
        // will be called initially and on every data change
        useEffect(() => {
          const svg = select(svgRef.current);
      
        //   const minProp = min(data.features, feature => feature.properties[property]);
        //   const maxProp = max(data.features, feature => feature.properties[property]);
        //   const colorScale = scaleLinear()
        //     .domain([minProp, maxProp])
        //     .range(["#ccc", "red"]);
      
          // use resized dimensions
          // but fall back to getBoundingClientRect, if no dimensions yet.
          const { width, height } =
             wrapperRef.current.getBoundingClientRect();
      
          // projects geo-coordinates on a 2D plane
          const projection = geoMercator()
            .fitSize([width, height], selectedCountry || data)
            .precision(100);
      
          // takes geojson data,
          // transforms that into the d attribute of a path element
          const pathGenerator = geoPath().projection(projection);
        console.log(data.features);
          // render each country
        //   svg
        //     .selectAll(".country")
        //     .data(data.features)
        //     .join("path")
        //     // .on("click", feature => {
        //     //   setSelectedCountry(selectedCountry === feature ? null : feature);
        //     // })
        //     .attr("class", "country")
        //     .transition()
        //     .attr("d", feature => pathGenerator(feature));
      
          // render text
          svg
          .selectAll("path")
          .data(data.features)
          .enter()
          .append('path')
          .classed("country",true)
          .attr("d", feature => pathGenerator(feature))
          .attr('fill','#088')
          .attr('stroke','#000');
         
        }, [data]);
      
        return (
          <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef}></svg>
          </div>
        );
      
    }
      export default USMap;
