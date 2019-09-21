/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  // ****** TODO: PART II ******
  var rectList = document.getElementById("aBarChart").getElementsByTagName('rect');
  var heightList = []
  for(var rect of rectList) {
    var height = rect.getAttribute('height')
    heightList.push(height)
  };
  heightList.sort(function(a,b) {
    return a - b;
  });
  for(var i in rectList){
    rectList[i].setAttribute('height', heightList[i])
  };


  console.log(heightList);

}

/**
 * Render the visualizations
 * @param errorR
 * @param data
 */
function update(data) {
  // Set up the scales
  let aScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.a)])
    .range([0, 150]);
  let bScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.b)])
    .range([0, 150]);
  let iScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, 110]);


  // ****** TODO: PART III (you will also edit in PART V) ******

  // TODO: Select and update the 'a' bar chart bars
  // d3.select('#aBarChart rect')
  //   .exit()
  //   .remove()

  aBarChart = d3.select('#aBarChart > g')
                .selectAll('rect')
                .data(data)
                ;

  aBarChart.enter()
           .append('rect')   
           .attr('x', (d,i) => i*10 + 10)   
           .attr('y', 0)
           .attr('width', 10)
           .attr('opacity', 0)           
           .merge(aBarChart)
           .transition()
           .duration(1500)
           .delay(100)
           .attr('opacity', 1)
           .attr('height', d => d.a * 10)
            ;
  aBarChart.exit()
           .transition()
           .duration(1500)
           .delay(100)
           .attr("opacity", 0)
           .remove()
           ;

  // TODO: Select and update the 'b' bar chart bars
  bBarChart = d3.select('#bBarChart > g')
                .selectAll('rect')
                .data(data)
                ;

  bBarChart.enter()
           .append('rect')   
           .attr('x', (d,i) => i*10 + 10)   
           .attr('y', 0)
           .attr('width', 10)
           .attr('opacity', 0)           
           .merge(bBarChart)
           .transition()
           .duration(1500)
           .delay(100)
           .attr('opacity', 1)
           .attr('height', d => d.b * 10)
            ;
  bBarChart.exit()
           .transition()
           .duration(1500)
           .delay(100)
           .attr("opacity", 0)
           .remove()
           ;

  // TODO: Select and update the 'a' line chart path using this line generator

  let aLineGenerator = d3.line()
    .x((d, i) => iScale(i))
    .y((d) => aScale(d.a));
  d3.select("#aLineChart")
    .select("path")
    .transition()
    .duration(1500)
    .delay(100)
    .attr('d', aLineGenerator(data))
    ;

  // TODO: Select and update the 'b' line chart path (create your own generator)
  let bLineGenerator = d3.line()
    .x((d, i) => iScale(i))
    .y((d) => bScale(d.b));
  d3.select("#bLineChart")
    .select("path")
    .transition()
    .duration(1500)
    .delay(100)
    .attr('d', bLineGenerator(data))
    ;

  // TODO: Select and update the 'a' area chart path using this area generator
  let aAreaGenerator = d3.area()
    .x((d, i) => iScale(i))
    .y0(0)
    .y1(d => aScale(d.a));
  d3.select('#aAreaChart')
    .select("path")
    .transition()
    .duration(1500)
    .delay(100)
    .attr("d", aAreaGenerator(data))

  // TODO: Select and update the 'b' area chart path (create your own generator)
  let bAreaGenerator = d3.area()
    .x((d, i) => iScale(i))
    .y0(0)
    .y1(d => aScale(d.b));
  d3.select('#bAreaChart')
    .select("path")
    .transition()
    .duration(1500)
    .delay(100)
    .attr("d", bAreaGenerator(data))

  // TODO: Select and update the scatterplot points
  scatterPlot = d3.select("#scatterPlot")
                  .selectAll("circle")
                  .data(data)
  scatterPlot.enter()
              .append('circle')
              .attr('r', 5)
              .attr('opacity', 0)
              .merge(scatterPlot)
              .transition()
              .duration(1500)
              .delay(100)
              .attr('opacity', 1)
              .attr("cx", d => d.a * 10)
              .attr("cy", d => d.b * 10)

  scatterPlot.exit()
             .transition()
             .duration(1500)
             .delay(100)
             .attr('opacity', 0)
             .remove()

  // ****** TODO: PART IV ******
  d3.selectAll(".barChart > rect")
    .on("mouseover", function(d,i){
      d3.select(this).style("fill", "orange");
    })
    .on("mouseout", function(d,i){
      d3.select(this).style("fill","steelblue")
    })

    ;
  // d3.select("#scatterPlot")
  d3.selectAll("#scatterPlot circle")
    .on("click", function(d,i){
      console.log(`x: ${d.a}, y: ${d.b}`);

    })
    .on("mouseover", function(d,i){
      d3.select(this)
        .append('title')
        .text(`x: ${d.a}, y: ${d.b}`)
        .attr("x", d.a)
        .attr("y", d.b)
    })
    .on("mouseout", function(d,i){
      d3.select(this)
        .select("title")
        .remove()
    })
    ;

}

window.onload = (e) => {
  changeData();
}


/**
 * Load the file indicated by the select menu
 */
function changeData() {
  let dataFile = document.getElementById('dataset').value;
  if (document.getElementById('random').checked) {
    randomSubset();
  }
  else {
    let filename = './data/' + dataFile + '.csv';
    dataset = d3.csv(filename, function(d) {
      // Convert each data item to a number.
      return { a:+d.a, b:+d.b };
    })
    // After reading the entire dataset, call update().
      .then(update);
  }
}

/**
 *   Load the file indicated by the select menu, and then slice out a random chunk before passing the data to update()
 */
function randomSubset() {
  let dataFile = document.getElementById('dataset').value;
  if (document.getElementById('random').checked) {
    let filename = './data/' + dataFile + '.csv';
    dataset = d3.csv(filename, function(d) {
      // Convert each data item to a number.
      return { a:+d.a, b:+d.b };
    })
    .then(function(data) {
      let subset = [];
      for (let d of data) {
        if (Math.random() > 0.5) {
          subset.push(d);
        }
      }
      update(subset);
    });
  }
  else {
    changeData();
  }
}
