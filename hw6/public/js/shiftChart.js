/** Class implementing the shiftChart. */
class ShiftChart {

  /**
   * Initializes the svg elements required for this chart;
   */
  constructor(){
    this.divShiftChart = d3.select("#shiftChart").classed("sideBar", true);


    this.margin = {top: 30, right: 20, bottom: 30, left: 20};

    //fetch the svg bounds
    this.svgBounds = this.divShiftChart.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 800;



    //selected 
    this.selectedYears = null;
    this.selectedStates = null;
    this.shiftData = [];

  };

  /**
   * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
   *
   * @param selectedStates data corresponding to the states selected on brush
   */
  update(selectedStates, selectedYears, clearStates){
    // ******* TODO: PART V *******
    //Display the names of selected states in a list
    this.divShiftChart.selectAll('ul').remove();
    this.selectedYears = selectedYears?selectedYears:this.selectedYears;
    this.selectedStates = selectedStates? selectedStates: this.selectedStates; 

    console.log(this.selectedYears, this.selectedStates);

    if(this.selectedStates){
      let ul = this.divShiftChart.append('ul');

      ul.selectAll('li')
        .data(this.selectedStates)
        .enter()
        .append('li')
        .html(String )
        ;
    };

    if(this.selectedYears){
      let ul2 = this.divShiftChart.append('ul');
      ul2.selectAll('li')
          .data(this.selectedYears)
          .enter()
          .append('li')
          .html(String )
          ;
  }


    //******** TODO: PART VI*******
    //Use the shift data corresponding to the selected years and sketch a visualization
    //that encodes the shift information

    //******** TODO: EXTRA CREDIT I*******
    //Handle brush selection on the year chart and sketch a visualization
    //that encodes the shift informatiomation for all the states on selected years

   


    //******** TODO: EXTRA CREDIT II*******
    //Create a visualization to visualize the shift data
    //Update the visualization on brush events over the Year chart and Electoral Vote Chart

     //get the data
  //   let yearData = []
  //   this.selectedYears.map( d => {
  //      d3.csv(`data/Year_Timeline_${d}.csv`).then(data => {
  //       console.log(data);
  //       yearData.push(data);

  //     });
  //    });

  //   yearData.map( (v,i) => {
  //     console.log("v,i", v,i);
  //     // let stateMap = []
  //     //  v.map( d => {
  //     //     let abbr = d["Abbreviation"];
  //     //     stateMap.push({abbr:d});
  //     //  })
  //     //  let year = this.selectedYears[i]
  //     //  this.shiftData.push({year:stateMap})
  //   });

  //   console.log('shiftData', this.shiftData);
  //   console.log('yearData', yearData);
    

  //   //add the svg to the div
  //   this.svg = this.divShiftChart.append("svg")
  //     .attr("width",this.svgWidth)
  //     .attr("height",this.svgHeight)

  //   //add horizontal axis to the vis 
  //   let horiGroup = this.svg.append('g').attr('transform', 'translate(50, 50)');

  //   horiGroup.append('line')
  //       .attr('x1', 0)
  //       .attr('y1', 0)
  //       .attr('x2', this.svgWidth - this.margin.right)
  //       .attr('y2', 0)
  //       .attr('class', 'shiftaxis')
  //       ;
  //   horiGroup.append('text')
  //       .text('Democrat')
  //       .attr('dx', '0em')
  //       .attr('dy', '-0.5em')
  //       ;
  //   horiGroup.append('text')
  //       .text('Republican')
  //       .attr('dx', '25em')
  //       .attr('dy', '-0.5em')
  //       ;
  //   // add the vertical axis and the stacked bars
  //   let mainGroup = this.svg.append('g').attr('transform', 'translate(10, 50)');

  //   mainGroup.append('line')
  //       .attr('x1', this.svgWidth/2)
  //       .attr('y1', 0)
  //       .attr('x2', this.svgWidth/2)
  //       .attr('y2', this.svgHeight)
  //       .attr('class', 'shiftaxis')
  //       ;


  //   let table = mainGroup.append('table');

  //   for( let i in this.selectedYears){
  //       let tr = table.append('tr');

  //       tr.append('td')
  //         .text(i)
  //         .classed('shiftyear')
  //         ;
  //       tr.append('td')
  //       ;


  //   }
    

  };


}
