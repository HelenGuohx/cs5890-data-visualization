/** Class implementing the votePercentageChart. */
class VotePercentageChart {

  /**
   * Initializes the svg elements required for this chart;
   */
  constructor(tooltip){
    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //fetch the svg bounds
    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 200;

    //add the svg to the div
    this.svg = divvotesPercentage.append("svg")
      .attr("width",this.svgWidth)
      .attr("height",this.svgHeight)

    this.tooltip = tooltip;
  }


  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  chooseClass(data) {
    if (data == "R"){
      return "republican";
    }
    else if (data == "D"){
      return "democrat";
    }
    else if (data == "I"){
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
   * Renders the HTML content for tool tip
   *
   * @param tooltip_data information that needs to be populated in the tool tip
   * @return text HTML content for toop tip
   */
  tooltip_render (tooltip_data) {
    let text = "<ul>";
    tooltip_data.result.forEach((row)=>{
      text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });

    return text;
  }

  /**
   * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
   *
   * @param electionResult election data for the year selected
   */
  update (electionResult){
    // ******* TODO: PART III *******
    this.svg.selectAll('rect').remove();
    this.svg.selectAll('text').remove();
    this.svg.selectAll('g').remove();

    let widthScale = d3.scaleLinear()
        .domain([0,100])
        .range([0, this.svgWidth-100])

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.
    let partyPercentage = [{
      'I': electionResult[0].I_PopularPercentage.replace('%',''),
      'D': electionResult[0].D_PopularPercentage.replace('%',''),
      'R': electionResult[0].R_PopularPercentage.replace('%',''),
    }]
    ;

    console.log("partyPercentage", partyPercentage);
    let partyPercentageKeys = electionResult[0].I_PopularPercentage.replace("/\s/g", '')  ? ['I', 'D', 'R']: ['D', 'R']

    let stack = d3.stack()
        .keys(partyPercentageKeys)

    let group = this.svg.append('g')
        .attr('transform', `translate(10, ${this.svgHeight/2})`)
        ;

    let groupData = group.selectAll('rect')
        .data(stack(partyPercentage))
        .enter()

    groupData.append('rect')
        .attr('width', d => { 
          console.log("percentage rect d", d);
          return widthScale(d[0][1] - d[0][0])
        })
        .attr('height', 30)
        .attr('x', d => widthScale(d[0][0]) )
        .attr('class', 'votesPercentage')
        .style('fill', d => this.chooseColor(d.key))
        ;

    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary
    let totol = d3.sum(Object.values(partyPercentage[0])) ;
    let candidates = electionResult[0].I_PopularPercentage.replace("/\s/g", '') ?
      [electionResult[0].I_Nominee_prop, electionResult[0].D_Nominee_prop, electionResult[0].R_Nominee_prop]:
      [electionResult[0].D_Nominee_prop, electionResult[0].R_Nominee_prop]
    ;
    console.log("candidates",candidates);
    groupData.append('text')
        .text(d => `${Math.round((d[0][1] - d[0][0])*100)/100}%`)
        .classed('votesPercentageText', true)
        .style('fill', d => this.chooseColor(d.key))
        .attr('dx', d => { return d.key == 'R'? widthScale(totol): d.key == 'D'? widthScale(d[0][0]) + 100 : widthScale(d[0][0])})
        .attr('dy', '-0.6em')
        .attr('text-anchor', d => { return d.key == 'R'? 'end':'start'})
        ;

    groupData.append('text')
        .text((d,i) => candidates[i])
        .attr('class', 'votesPercentageText')
        .attr('dx', d => { return d.key == 'R'? widthScale(totol): d.key == 'D'? widthScale(d[0][0]) + 200 : widthScale(d[0][0])})
        .attr('dy', '-3em')
        .attr('text-anchor', d => { return d.key == 'R'? 'end':'start'})
        .style('fill', d => this.chooseColor(d.key))

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.
    group.append('rect')
        .attr('class', 'middlePoint')
        .attr('height', 45)
        .attr('x', widthScale(50))
        .attr('y', -10)
        ;

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element
    group.append('text')
        .text('Popular Vote (50%)')
        .attr('class', 'votesPercentageNote')
        .attr('dx', widthScale(50))
        .attr('dy', '-0.6em')
        ;

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.????????/
    //then, vote percentage and number of votes won by each party.

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

  };


}
