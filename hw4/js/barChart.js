/** Class implementing the bar chart view. */
class BarChart {

  /**
   * Create a bar chart instance and pass the other views in.
   * @param worldMap
   * @param infoPanel
   * @param allData
   */
  constructor(worldMap, infoPanel, allData) {
    this.worldMap = worldMap;
    this.infoPanel = infoPanel;
    this.allData = allData;
    console.log("allData",allData);
  }

  /**
   * Render and update the bar chart based on the selection of the data type in the drop-down box
   */
  updateBarChart(selectedDimension) {
    // ******* TODO: PART I *******

    // Create the x and y scales; make
    // sure to leave room for the axes
    let years = [];
    let selectedData = [];
    this.allData.map( (d,i) => {
      years.push(d["year"])
      selectedData.push(d[selectedDimension])
    });

    console.log("selectedData:",selectedData);

    let svg = d3.select('#barChart');
    let svgWidth = svg.attr('width');
    let svgHeight = svg.attr('height'); 
    console.log(svgWidth, svgHeight);
    let xaxisHeight = 20;
    let yaxisWidth = 80;
    let yaxisHeight = 300;

    // svg.attr('transform', 'scale(1,-1)');
    console.log("years", years);
    console.log("selectedData", selectedData);

    let xscale = d3.scaleBand()
                   .domain(years)
                   .range([400,0])
                   .padding(0.10);
    let yscale = d3.scaleLinear()
                   .domain([0, d3.max(selectedData)])
                   .range([yaxisHeight,0])
                   ;


    // Create colorScale
    let colorScale = d3.scaleLinear()
                       .domain([d3.min(selectedData), d3.max(selectedData)])
                       .range(["SteelBlue", "MidnightBlue"])
                       ;

    // Create the axes (hint: use #xAxis and #yAxis)
    let xaxis = d3.axisBottom(xscale)
                  .tickFormat((d,i) => years[i])
                  ;
    let yaxis = d3.axisLeft(yscale);

    svg.select('#xAxis')
      .attr('transform', `translate(${yaxisWidth}, ${yaxisHeight+xaxisHeight/2})`)
      .call(xaxis)
      .selectAll('text')
      .style("text-anchor", "end")
      .attr('transform', 'translate(-15,10)rotate(-90)')

      ;

    svg.select('#yAxis')
      .attr('transform', `translate(${yaxisWidth}, 10)`)
      .call(yaxis);

    // Create the bars (hint: use #bars)
    let bars = svg.select("#bars")
        .attr('transform', `translate(${yaxisWidth}, ${yaxisHeight})scale(1,-1)`)
        .selectAll(".bar")
        .data(selectedData)
        .on('click', handleClick)
        .on('mouseout', handleMouseOut)
        ;
    let newBars = bars.enter()
                      .append('rect')
                      .attr('x', (d,i) => xscale(years[i]))
                      .attr('y', 0)
                      .attr('width', xscale.bandwidth())
                      .attr('height', 0)
                      .attr('fill', d => colorScale(d))
                      // .attr("transform", "translate(0, 375) scale(1, -1)")
                      .on("click", handleClick)
                      .on("mouseout", handleMouseOut)
                      .style("opacity", 0)
                      .attr("class", "bar")
                      ;
    bars.exit()
        .style('opacity', 1)
        .transition()
        .duration(2000)
        .style("opacity", 0)
        .remove()
        ;

    bars = newBars.merge(bars);
    bars.transition()
        .duration(2000)
        .attr('x', (d,i) => xscale(years[i]))
        .attr('y', 0)
        .attr('width', xscale.bandwidth())
        .attr('height', d => yaxisHeight-yscale(d))
        .attr('fill', d => colorScale(d))
        .style("opacity", 1)


    // ******* TODO: PART II *******

    // Implement how the bars respond to click events
    // Color the selected bar to indicate is has been selected.
    // Make sure only the selected bar has this new color.


    // Call the necessary update functions for when a user clicks on a bar.
    // Note: think about what you want to update when a different bar is selected.

    function handleClick(d,i) {
      d3.select(this)
        .style('fill', 'red')
        ;
      barChart.infoPanel.updateInfo(barChart.allData[i]);
      barChart.worldMap.updateMap(barChart.allData[i]);
    }

    function handleMouseOut(d,i) {
    //   d3.select(this)
    //     .style('fill', d => colorScale(d))
    //     ;
     }


  }



  /**
   *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
   *
   *  There are 4 attributes that can be selected:
   *  goals, matches, attendance and teams.
   */
  chooseData() {
    // ******* TODO: PART I *******
    //Changed the selected data when a user selects a different
    // menu item from the drop down.


  }
}
