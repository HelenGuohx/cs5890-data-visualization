
class YearChart {

  /**
   * Constructor for the Year Chart
   *
   * @param electoralVoteChart instance of ElectoralVoteChart
   * @param tileChart instance of TileChart
   * @param votePercentageChart instance of Vote Percentage Chart
   * @param electionInfo instance of ElectionInfo
   * @param electionWinners data corresponding to the winning parties over mutiple election years
   */
  constructor (electoralVoteChart, tileChart, votePercentageChart, electionWinners, shiftChart) {

    //Creating YearChart instance
    this.electoralVoteChart = electoralVoteChart;
    this.tileChart = tileChart;
    this.votePercentageChart = votePercentageChart;
    this.shiftChart = shiftChart;
    // the data
    this.electionWinners = electionWinners;
    
    // Initializes the svg elements required for this chart
    this.margin = {top: 10, right: 20, bottom: 30, left: 50};
    let divyearChart = d3.select("#year-chart").classed("fullView", true);

    //fetch the svg bounds
    this.svgBounds = divyearChart.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 100;

    //add the svg to the div
    this.svg = divyearChart.append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);

    this.selected = null;
  }

  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  chooseClass (data) {
    if (data == "R") {
      return "republican";
    }
    else if (data == "D") {
      return "democrat";
    }
    else if (data == "I") {
      return "independent"; //"yearChart independent";
    }
  }

  /**
   * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
   */
  update () {

    let yearChart = this;

    //Domain definition for global color scale
    let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

    //Color range for global color scale
    let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

    //ColorScale be used consistently by all the charts
    this.colorScale = d3.scaleQuantile()
      .domain(domain)
      .range(range);

    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
    //let groupRange = this.svg.select('g').node().getBoundingClientRect();
    //console.log('groupRange', groupRange);

    let brush = d3.brushX().extent([
        //[groupRange.left, groupRange.top], [groupRange.left + groupRange.width, groupRange.top + groupRange.height]
        [0,50],[2000, 120]

        ])
        .on('end', function(){
          console.log("brush", d3.event);
          let selectedRange = d3.event.selection;
          let startPoint = Math.ceil( (selectedRange[0] - 50) / 100);
          let endPoint = Math.floor( (selectedRange[1] - 50) / 100) ;
          let selectedYears = [];
          for(let i = startPoint; i <= endPoint; i++){
             selectedYears.push( 1940 + 4*i);
           };

         console.log("selectedStates", selectedYears);
          yearChart.shiftChart.update(null, selectedYears);
        })
        ;
    this.svg.append('g')
        .attr('class', 'brush')
        .attr('transform', 'translate(20, -50)')
        .attr('height', 50)
        .call(brush);

    this.svg.select('.overlay')
        .attr('x', 0)
        ;


    // ******* TODO: PART I *******
    //create yearscale for circle position   ????


    // Create the chart by adding circle elements representing each election year
    let yearGroup = d3.select("#year-chart svg")
        .append("g")
        .attr('transform', 'translate(20, 20)')

    yearGroup.append('line')
        .attr('x1', 0)
        .attr('y1', 10)
        .attr('x2', 2000)
        .attr('y2', 10)
        .attr('class', 'lineChart')

    let yearData = yearGroup.selectAll('circle')
        .data(this.electionWinners)
        .enter()

    yearData.append("circle")
        .attr('class', d => {
          // console.log(d.PARTY);
          return this.chooseClass(d.PARTY);
        })
        .attr("r", 18)
        .attr("cx", (d,i) => 100*i + 50)
        .attr('cy', 10)
    ;

    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements
    yearData.append("text")
        .text(d => d.YEAR)
        .attr('class', 'yeartext')
        .attr('x', (d,i) => 100*i + 50)
        .attr('y', 50)

    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line


    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: You can get the d3 selection that was clicked on using
    //   d3.select(d3.event.target)
    //HINT: Use .highlighted class to style the highlighted circle
    
    d3.select('#year-chart svg')
      .selectAll('circle')
      .on('mouseover', function() {
        d3.select(this).classed('highlighted', true);
      })
      .on('mouseout', function() {
        d3.select(this).classed('highlighted', false);
      })
      .on('click', function(d) {
          // add selected class
          d3.selectAll('circle').classed('selected', false);
          d3.select(this).classed('selected',true);

          // shift data
          let year = d.YEAR;
          d3.csv(`data/Year_Timeline_${year}.csv`).then( selectedYearData => {
              //console.log(selectedYearData);
              yearChart.electoralVoteChart.update(selectedYearData, yearChart.colorScale);
              yearChart.votePercentageChart.update(selectedYearData );
              yearChart.tileChart.update(selectedYearData, yearChart.colorScale);
             // yearChart.shiftChart.update(selectedYearData, null, true);
          })

      })


    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations




  }

}
