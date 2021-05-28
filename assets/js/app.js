// // Define SVG attributes
var width = 1000;
var height = 550;
// 
var margin = 15;
var labelArea = 90;
var padding = 20;


// Create SVG object 
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");

// Texts for x and y axes ###################################
// Append g - tag css
svg.append("g").attr("class", "text_xaxis");
var text_xaxis = d3.select(".text_xaxis");

// Transform to adjust for text_xaxis
// Centered
var x_label_bottom =  width/2;
// Adjustments needed to show text x axis and y axis inside SVG area
// taking into account margin and padding
var x_label_left = height - margin - padding;
text_xaxis.attr("transform",`translate(
    ${x_label_bottom}, 
    ${x_label_left})`
    );

// x-axis (bottom) ######################################
// Build text_xaxis details
text_xaxis.append("text")
    // text position
    .attr("y", -25)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("class","aText active x")
    // .style("color", 'red')
    .text("Population below poverty line (%)");

text_xaxis.append("text")
    .attr("y", 0)
    .attr("data-name", "age")
    .attr("data-axis", "x")
    .attr("class","aText inactive x")
    .text("Age (Median)");

text_xaxis.append("text")
    .attr("y", 25)
    .attr("data-name", "income")
    .attr("data-axis", "x")
    .attr("class","aText inactive x")
    .text("Household Income (Median)");

// y-axis (left) ######################################
//  g tag for text_yaxis
svg.append("g").attr("class", "text_yaxis");
var text_yaxis = d3.select(".text_yaxis");
// Transform to adjust for text_yaxis
var text_y_h_posit =  margin + padding;
// vertically centered
var text_y_v_posit = (height + labelArea) / 2 - labelArea;

// write y axis labels and rotate text to make it vertical
text_yaxis.attr("transform",`translate(
    ${text_y_h_posit}, 
     ${text_y_v_posit}
    )rotate(-90)`
    );

// Build text_yaxis details
text_yaxis .append("text")
    .attr("y", -22)
    .attr("data-name", "obesity")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Obese (%)");

text_yaxis .append("text")
    .attr("y", 0)
    .attr("data-name", "smokes")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Smokes (%)");

text_yaxis .append("text")
    .attr("y", 25)
    .attr("data-name", "healthcare")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Lacks Healthcare (%)");
    
// Plot after reading csv file with data ########################################

d3.csv("assets/data/data.csv").then(function(data) {
    generate_graph(data);
});

//##############################################################
// Function to make the graph ################################
//##############################################################
function generate_graph (csvData) {
    // Variables for min and max to handle scales for axes
       var xMin;
       var xMax;
       var yMin;
       var yMax;
    
       // initial default selections
       var selected_x = "poverty";
       var selected_y = "healthcare";
    
       // Tool Tip info box (state, X stats,  Y stats)
       var toolTip = d3.tip()
          .attr("class", "d3-tip")
          // tooltip box position
          .offset([100, -62])
          .html(function(d) {
                //Build tooltip box
                // Capitalize state name in toolbox
                const statetext = d.state;
                const upper = statetext.toUpperCase();
                // State text in bold 
                var stateLine = `<div><strong>${upper}</strong></div>`;
                var yLine = `<div>${selected_y}: ${d[selected_y]}%</div>`;
                if (selected_x === "poverty") {
                    xLine = `<div>${selected_x}: ${d[selected_x]}%</div>`}          
                else {
                    xLine = `<div>${selected_x}: ${parseFloat(d[selected_x]).toLocaleString("en")}</div>`;}             
                return stateLine + xLine + yLine  
            });
    
        // Add toolTip to svg
        svg.call(toolTip);
    
        // When chosen a different axis by clicking
        function  update_labels(axis, clickText) {
            // Switch active to inactive with booleans
            d3.selectAll(".aText")
                .filter("." + axis)
                .filter(".active")
                .classed("active", false)
                .classed("inactive", true);
        
            // switch text selected by clicking to active
            clickText.classed("inactive", false).classed("active", true);
            }
        //#######################################################
        //  max & min values for scaling both axis
        function scale_x_minmax() {
          xMin = d3.min(csvData, function(d) {
            // adjusting to make more inteligible the graph by multiplying
            return parseFloat(d[selected_x]) * 0.95;
          });
          xMax = d3.max(csvData, function(d) {
            return parseFloat(d[selected_x]) * 1.05;
          });     
        }
    
        function scale_y_minmax() {
          yMin = d3.min(csvData, function(d) {
            return parseFloat(d[selected_y]) * 0.80;
          });
          yMax = d3.max(csvData, function(d) {
            return parseFloat(d[selected_y]) * 1.15;
          }); 
        }
    
        // call function to return min and max values for axix
        scale_x_minmax();
        scale_y_minmax();
    
        // once values obtained, build scales for both x & y axis
        var xScale = d3 
            .scaleLinear()
            .domain([xMin, xMax])
            .range([margin + labelArea, width - margin])
    
        var yScale = d3
            .scaleLinear()
            .domain([yMin, yMax])
            .range([height - margin - labelArea, margin])
    
        // Create scaled X and Y axis
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);
    
        // append axis to svg as group
        svg.append("g")
            .call(xAxis)
            .attr("class", "xAxis")
            .attr("transform", `translate(
                0, 
                ${height - margin - labelArea})`
            );
    
        svg.append("g")
            .call(yAxis)
            .attr("class", "yAxis")
            .attr("transform", `translate(
                ${margin + labelArea}, 
                0 )`
            );
    
        // Append the circles for each row
        var allCircles = svg.selectAll("g allCircles").data(csvData).enter();
    
        allCircles.append("circle")
            .attr("cx", function(d) {
                return xScale(d[selected_x]);
            })
            .attr("cy", function(d) {
                return yScale(d[selected_y]);
            })
            // radius size for circles
            .attr("r", 12)
            .attr("class", function(d) {
                return "stateCircle " + d.abbr;
            })
    
            // Apply state text on circles
            allCircles
                .append("text")
                .attr("font-size", 11)
                // Bold state initials for better contrast
                .attr("font-weight", 600)
                .attr("class", "stateText")
    
                .attr("dx", function(d) {
                   return xScale(d[selected_x]);
                })
                .attr("dy", function(d) {
                  // Push text to center by dividing
                  return yScale(d[selected_y]) + 10 /3;
                })
                .text(function(d) {
                    return d.abbr;
                  })
    
            // build tooltip ####################################################
                .on("mouseover", function(d) {
                     // Show tooltip with mouse over circle
                    toolTip.show(d);
                    // Highlight circle border in white
                    d3.select("." + d.abbr).style("stroke", "white");
                })
    
                .on("mouseout", function(d) {
                     // hide tooltip
                    toolTip.hide(d);
                    // Remove border
                    d3.select("." + d.abbr).style("stroke", "white");
                });
    
    
              // Change graph according to click selected 
              d3.selectAll(".aText").on("click", function() {
                  var selected = d3.select(this)
    
                  // if selected was inactive
                  if (selected.classed("inactive")) {
                    // Obtain name and axis and save in variables
                    var axis = selected.attr("data-axis")
                    var name = selected.attr("data-name")
    
                    if (axis === "x") {
                      selected_x = name;
    
                      // Update min and max scale for specific domain
                      scale_x_minmax();
                      xScale.domain([xMin, xMax]);
    
                      svg.select(".xAxis")
                            .transition().duration(1000)
                            .call(xAxis);
                      
                      // reposition circles
                      d3.selectAll("circle").each(function() {
                        d3.select(this)
                            .transition().duration(1000)
                            .attr("cx", function(d) {
                                return xScale(d[selected_x])                
                            });
                      });   
                      // reposition text inside circles
                      d3.selectAll(".stateText").each(function() {
                        d3.select(this)
                            .transition().duration(1000)
                            .attr("dx", function(d) {
                                return xScale(d[selected_x])                          
                            });
                      });          
                      // Update labels
                      update_labels(axis, selected);
                    }
    
                     // Update Y axis selection 
                    else {
                      selected_y = name;
    
                      // Update min and max of range (y)
                      scale_y_minmax();
                      yScale.domain([yMin, yMax]);
    
                      svg.select(".yAxis")
                            .transition().duration(1000)
                            .call(yAxis);
    
                      /// reposition circles
                      d3.selectAll("circle").each(function() {
                        d3.select(this)
                            .transition().duration(1000)
                            .attr("cy", function(d) {
                                return yScale(d[selected_y])                
                            });                       
                      });   
                        // reposition text inside circles
                      d3.selectAll(".stateText").each(function() {
                          d3.select(this)
                            .transition().duration(1000)
                            .attr("dy", function(d) {
                               // Center text
                            return yScale(d[selected_y]) + 10/3;                                
                            });
                      });
    
                      // use function to active / inactive text rows by clicked label
                      update_labels(axis, selected);
                    }
                  }
              });
    }
    
    
    
    
    
    