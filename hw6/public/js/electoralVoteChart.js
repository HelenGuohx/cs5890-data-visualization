
class ElectoralVoteChart {
  /**
   * Constructor for the ElectoralVoteChart
   *
   * @param shiftChart an instance of the ShiftChart class
   */
  constructor (shiftChart){
    this.shiftChart = shiftChart;
    
    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
    let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 150;

    //creates svg element within the div
    this.svg = divelectoralVotes.append("svg")
      .attr("width",this.svgWidth)
      .attr("height",this.svgHeight)
    ;

  };

  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  chooseClass (party) {
    if (party == "R"){
      return "republican";
    }
    else if (party == "D"){
      return "democrat";
    }
    else if (party == "I"){
      return "independent";
    }
  }

  chooseColor (party) {
    if (party == "R"){
      return "#de2d26";
    }
    else if (party == "D"){
      return "#3182bd";
    }
    else if (party == "I"){
      return "#45AD6A";
    }
  }


  /**
   * Creates the stacked bar chart, text content and tool tips for electoral vote chart
   *
   * @param electionResult election data for the year selected
   * @param colorScale global quantile scale based on the winning margin between republicans and democrats
   */

  update (electionResult, colorScale){

    // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    console.log("electionResult", electionResult);

    // this.svg.selectAll('rect').remove();
    // this.svg.selectAll('text').remove();
    this.svg.selectAll('g').remove();

    let RGroup = []
    let DGroup = []
    let IGroup = []
    electionResult.map( d => {
        return d.RD_Difference > 0? RGroup.push(d): d.RD_Difference < 0? DGroup.push(d): IGroup.push(d)
    })
    RGroup.sort((a,d) => a.RD_Difference - d.RD_Difference);
    DGroup.sort((a,d) => a.RD_Difference - d.RD_Difference);

    let widthScale = d3.scaleLinear() 
        .domain([0, d3.max(electionResult, d => d.Total_EV)])
        .range([0, 20])
        ;


    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.
    // let totalGroup = IGroup.concat(DGroup).concat(RGroup);
    let totalGroupMap = {};
    let totalStates = [];
    // totalGroup.map( d => {
    //   totalStates.push(d.Abbreviation);
    //   totalGroupMap[d.Abbreviation] = d;
    //   console.log(d.Abbreviation, "RD_Difference", d.RD_Difference); 
    // })
    // ;

    let IStates = [];
    IGroup.map( d => {
      IStates.push(d.Abbreviation);
      totalStates.push(d.Abbreviation);
      totalGroupMap[d.Abbreviation] = d;
    });
    DGroup.map( d => {
      totalStates.push(d.Abbreviation);
      totalGroupMap[d.Abbreviation] = d;
    })
    ;    
    RGroup.map( d => {
      totalStates.push(d.Abbreviation);
      totalGroupMap[d.Abbreviation] = d;

      //console.log(d.Abbreviation, "RD_Difference", d.RD_Difference); 

    })
    ;


    let stack = d3.stack()
        .keys(totalStates)
        .value( function(d, key){ 
            return widthScale(d[key].Total_EV)
          })

        ;

    //console.log("RGroup",RGroup);
    let groups = this.svg.append('g')
        .attr('transform', `translate(10, ${this.svgHeight/2})`)
        ;

    groups.selectAll("rect")
        .data(stack([totalGroupMap]))
        .enter()
        .append('rect')
        .attr('class', 'electoralVotes')
        .attr('id', d => d.key)
        .attr('width', d => d[0][1] - d[0][0] )
        .attr('height', 30)
        .attr('x', d => d[0][0])
        .style('fill', d => {
          //console.log("key", d.key in IStates);
          return IStates.includes(d.key)?'#45AD6A':colorScale(totalGroupMap[d.key].RD_Difference) ;
        })
        ;


    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary
    let sumList = [{
      "I": d3.sum(IGroup, d => d.Total_EV),
      "D": d3.sum(DGroup, d => d.Total_EV),
      "R": d3.sum(RGroup, d => d.Total_EV),
    }]
    let total = Object.values(sumList[0]).reduce((a,b) => a+b) ;
    let sumStack = d3.stack()
        .keys(["I","D","R"])
    console.log("sumList", sumList);

    groups.selectAll("text")
        .data(sumStack(sumList))
        .enter()
        .append("text")
        .text( d => {
          console.log("text d", d);
          if(d[0][1]){
            return d[0][1] - d[0][0]
          }
        })
        .attr("dx", d => { return d.key == 'R'?widthScale(total): widthScale((d[0][0])) })
        .attr("dy", '-1em')
        .attr('class','electoralVoteText')
        .style("fill", d => this.chooseColor(d.key))
        .attr('text-anchor', d => { return d.key == 'R'? 'end':'start'})
        ;



    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.
    
    // this.svg.append('g')
    //     .attr('transform', `translate(10, ${this.svgHeight/2})`)
    groups.append('rect')
        .attr('class', 'middlePoint')
        .attr('height', 40)
        .attr('x', widthScale(total/2))
        .attr('y', -10)
        ;

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element
    groups.append('text')
        .text(`Electoral Vote(${Math.ceil(total/2)} needed to win)`)
        .attr('class', 'electoralVotesNote')
        .attr('dx', widthScale(total/2))
        .attr('dy', '-1em')
        ;

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
    let groupRange = this.svg.select('g').node().getBoundingClientRect();
    let electoralVoteChart = this;
    console.log('groupRange', groupRange);

    let brush = d3.brushX().extent([
        [groupRange.left, groupRange.top], [groupRange.left + groupRange.width, groupRange.top + groupRange.height-30]
        ])
        .on('end', function(){
          console.log("brush", d3.event);
          let selectedRange = d3.event.selection;
          let electoralVotesRect = electoralVoteChart.svg.selectAll('.electoralVotes').nodes();

          let selectedStates = [];
          electoralVotesRect.map( d => {
              // console.log("electoralVotesRect d", d);
              // console.log("electoralVotesRect width", d.getAttribute('width'));

              let x1 = Number(d.getAttribute('x'));
              let x2 = Number(x1) + Number(d.getAttribute('width')) ;
              if (x2 >= selectedRange[0] && x1 < selectedRange[1]){
                selectedStates.push(totalGroupMap[d.getAttribute('id')].State);
                //console.log("selected", x1,x2)
              };
          })


          console.log("selectedStates", selectedStates);
          electoralVoteChart.shiftChart.update(selectedStates);
        })
        ;
    this.svg.append('g')
        .attr('class', 'brush')
        .attr('transform', 'translate(8.5, -170)')
        .attr('height', 30)
        //.attr('width', groupRange.width + )
        .call(brush);

    this.svg.select('.overlay')
        .attr('x', 0)
        ;

    //let brushRange = this.svg.select('.brush rect').node().getBoundingClientRect();
    //console.log("gap", groupRange, brushRange, brushRange.x - groupRange.x);

  };



  
}
