/** Class implementing the table. */
class Table {
  /**
   * Creates a Table Object
   */
  constructor(teamData, treeObject) {

    // Maintain reference to the tree Object; 
    this.tree = treeObject; 

    // Create list of all elements that will populate the table
    // Initially, the tableElements will be identical to the teamData
    this.tableElements = teamData.slice(); //

    // Store all match data for the 2014 Fifa cup
    //this.teamData = null;
    this.teamData = teamData;

    // Default values for the Table Headers
    this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

    // To be used when sizing the svgs in the table cells.
    this.cell = {
      "width": 70, //70,
      "height": 20, //20,
      "buffer": 15
    };
    this.goalSize = {
      "width": 120,
      "height": 30,
      "margin": 5,
    }

    this.bar = {
      "height": 20
    };


    // Set variables for commonly accessed data columns
    this.goalsMadeHeader = 'Goals Made';
    this.goalsConcededHeader = 'Goals Conceded';

    // Setup the scales
//    this.goalScale = null;
    this.goalScale = d3.scaleLinear()
        .domain([0, d3.max(
            function(data){
                let res = [];
                data.map( d => {
                    let maxGoal = Math.max(d["value"]["Goals Conceded"], d["value"]["Goals Made"]);
                    res.push(maxGoal);
                });
                return res
            }(this.tableElements)
        )])
        .range([ 2*this.goalSize.margin, this.goalSize.width - 2*this.goalSize.margin])
      ;

    // Used for games/wins/losses
    // this.gameScale = null;
    this.totalGamesList = function (data) {
        let res = [];
        data.map( d => {
            res.push(d.value.TotalGames)
        });
        return res
    }(this.tableElements)
    ;
    this.gameScale = d3.scaleLinear()
        .domain([0, d3.max( this.totalGamesList) ])
        .range([0, this.cell.width - 5])
        ;

    // Color scales
    // For aggregate columns  Use colors '#ece2f0', '#016450' for the range.
    this.aggregateColorScale = d3.scaleLinear()
        .domain([0, d3.max( this.totalGamesList) ])
        .range(['#ece2f0', '#016450'])
    ;

    // For goal Column. Use colors '#cb181d', '#034e7b'  for the range.
    this.sign = ['-', '+']
    this.goalColorScale = d3.scaleOrdinal()
        .domain(this.sign)
        .range(['#cb181d', '#034e7b'])
    ;
  }


  /**
   * Creates a table skeleton including headers that when clicked allow
   * you to sort the table by the chosen attribute.
   * Also calculates aggregate values of goals, wins, losses and total
   * games as a function of country.
   */
  createTable() {

    // ******* TODO: PART II *******
    console.log("teamData", this.teamData);
//    console.log("teamObject", teamObject);
    let dataSet = this.teamData;
    let margin = this.goalSize.margin;
    let svgWidth = this.goalSize.width;
    let svgHeight = this.goalSize.height;
    let xaxisWidth = svgWidth - 2*margin;
    let xaxisHeight = svgHeight - 2*margin ;

    // Update Scale Domains
//    this.goalScale = d3.scaleLinear()
//        .domain([0, d3.max(
//            function(data){
//                let res = [];
//                data.map( d => {
//                    let maxGoal = Math.max(d["value"]["Goals Conceded"], d["value"]["Goals Made"]);
//                    res.push(maxGoal);
//                });
//                return res
//            }(dataSet)
//        )])
//        .range([0, xaxisWidth])
//      ;

    // Create the x axes for the goalScale.
    let xaxis = d3.axisTop(this.goalScale)
     ;

    d3.select("#goalHeader")
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append("g")
      .attr('transform', `translate(${margin}, ${xaxisHeight})`)
      .call(xaxis)
      ;


    // Add GoalAxis to header of col 1.

    // ******* TODO: PART V *******

    // Set sorting callback for clicking on headers
    // one click desc order, double click asc
    let table = this;
    let header, lastHeader;
    let sign, lastSign;
    console.log("table", table);

    function compareValue(key, sign){
      return function(a, b) {
          let varA, varB ;
          let _key = key.replace(/\s/g, '');
          if(_key == "Team"){
            varA = a.key;
            varB = b.key;
          }else if(_key == "Goals"){
            varA = a.value["Delta Goals"]
            varB = b.value["Delta Goals"]
          }else if(_key == "Round/Result"){
            varA = a.value.Result.ranking
            varB = b.value.Result.ranking
          }else{
            varA = a.value[_key]
            varB = b.value[_key]
          }
          let comparison = 0;
          if (varA > varB){
            comparison = 1;
          } else if( varA < varB){
            comparison = -1
          }
          return comparison * sign
      }

    };
    function sorting(){
        header = d3.select(this).text();
        sign = header == lastHeader? lastSign * -1: -1;
        lastHeader = header.slice();
        lastSign = Number(sign);

        table.collapseList();
        table.tableElements.sort(compareValue(header, sign));
        table.updateTable();
    }


    // Clicking on headers should also trigger collapseList() and
    // updateTable(). 
    d3.selectAll('#matchTable thead')
      .select('tr')
      .selectAll('td, th')
      .on("click", sorting)
      ;


    
  }


  /**
   * Updates the table contents with a row for each element in the global
   * variable tableElements.
   */
  updateTable() {
    // ******* TODO: PART III *******
    // Create table rows
    console.log(this.tableElements);
    // d3.select("#matchTable tbody").selectAll("*").remove();
    d3.select("#matchTable tbody").selectAll("th").remove();
    d3.select("#matchTable tbody").selectAll("td").remove();

    let tr = d3.select("#matchTable tbody")
      .selectAll("tr")
      .data(this.tableElements)
    ;

    tr.exit().remove();

    let newTr = tr.enter()
    .append('tr')
    .on("mouseover", this.tree.updateTree)
    .on("mouseout", this.tree.clearTree)
    .merge(tr)
    ;


    let td = newTr.selectAll('td')
        .data( function(d){
            // console.log("data from tr to td", d);
            let value = d.value;
            let goalsData = {
                "made": value["Goals Made"],
                "conceded" : value["Goals Conceded"],
                "delta": value["Goals Made"] - value["Goals Conceded"],
            }
            //let goalsData = [ value["Goals Made"], value["Goals Conceded"], value["Delta Goals"]]
            let result = [
            {
                "type": value.type,
                "vis": "text",
                "value": value.type == "aggregate"? d.key: "x" + d.key, 
                "class":"team",
            }, {
                "type": value.type,
                "vis": "goals",
                "value": goalsData,
                "class":"goals"
            },{
                "type": value.type,
                "vis": "text",
                "value": value.Result,
                "class":"result"
            },{
                "type": value.type,
                "vis": "bar",
                "value": value.Wins,
                "class":"wins",
            },{
                "type": value.type,
                "vis": "bar",
                "value": value.Losses,
                "class":"losses",
            },{
                "type": value.type,
                "vis": "bar",
                "value": value.TotalGames,
                "class": "total",

            }];
            //console.log("result", result[0].value, result)

            return result
        })
        .enter()
        .append("td")
        .attr("class", d => d.class)
        ;
    // console.log("td", td);

    // Append th elements for the Team Names
    d3.selectAll(".team")
      .append("th")
      .attr("class", d => {
        return d.type == "game"? "game": "aggregate";
      })
      .text(d => d.value)
      .on("click", (d,i) => this.updateList(i))
      ;

    // Append td elements for the remaining columns. 
    // Data for each cell is of the type: {'type':<'game' or 'aggregate'>,
    // 'value':<[array of 1 or two elements]>}
    d3.selectAll(".result")

      .text(d => {
//          console.log(d);
          return d.value.label
      })
      ;

     let bars = td.filter( function (d) {
         return d.vis == 'bar' && d.type == "aggregate";
     });

     bars.append('svg')
        .attr('width', this.cell.width)
        .attr('height', this.cell.height)
        .append('rect')
        .attr('height', this.bar.height)
        .attr('width', d => {
            // console.log("rect d", d);
            return this.gameScale(d.value)
            })
        .style('fill', d => this.aggregateColorScale(d.value))
        ;
     bars.selectAll("svg")
         .append('text')
         .text(d => d.value)
         .attr('x', d => this.gameScale(d.value) - 3)
         .attr('y', this.bar.height / 2 + 3)
         .style('fill', 'white')
         .style("font-size", 12)
         .style("text-anchor", "end")
        ;

    
    //Add scores as title property to appear on hover

    //Populate cells (do one type of cell at a time)

    //Create diagrams in the goals column
    let goals = td.filter( function(d) {
        return d.vis == 'goals'
    });
    let goalsSvg = goals.append("svg")
        .attr('width', this.goalSize.width)
        .attr('height', this.cell.height)

    goalsSvg.append("rect")
        .classed("goalBar", true)
        .attr("x", d => this.goalScale(d3.min([d.value.conceded, d.value.made])) + 5 )
        .attr("y", d => {
            return d.type == "aggregate" ? 5: 8;
        })
        .attr("width", d => {
            let temp = this.goalScale( Math.abs(d.value.made - d.value.conceded) ) - 20
            return temp > 0? temp: 0
          })
        .attr("height", 10)
        .attr("height", d => {
            //console.log("rect d", d);
            return d.type == "aggregate" ? 10: 5;
        })
        .attr("fill", d => {
              let sign = d.value.delta < 0 ? this.sign[0]: this.sign[1];
              return this.goalColorScale(sign)
            })


        ;
    //goal made
    goalsSvg.append("circle")
        .classed("goalCircle", true)
        .attr("cy", this.bar.height / 2)
        .attr("cx", d => {
            return this.goalScale(d.value.made)
        })
        .style("fill", d => {
             return d.type == "aggregate"?"#034e7b":"none"
           }) 
        .style( "stroke", '#034e7b')
         
        ;
    // goal conceded
    goalsSvg.append("circle")
        .classed("goalCircle", true)
        .attr("cy", this.bar.height / 2)
        .attr("cx", d =>  this.goalScale(d.value.conceded) )
        .style("fill", d => {
            return d.type == "aggregate"?"#cb181d":"none"
           }) //'#cb181d', '#034e7b'
        .style( "stroke", '#cb181d')
        ;


    //Set the color of all games that tied to light gray
    goals.filter( d => d.value.delta === 0)
        .selectAll("circle")
        .style("fill", d => {
            return d.type == "aggregate"?"gray":"none"
        })
        .style( "stroke", 'gray')
    ;




  };

  /**
   * Updates the global tableElements variable, with a row for each row
   * to be rendered in the table.
   */
  updateList(i) {
    // ******* TODO: PART IV *******
    
    // Only update list for aggregate clicks, not game clicks
    console.log(i);
    let clickedElement = this.tableElements[i];
    let nextElement = this.tableElements[i+1];
    if( clickedElement.value.type == "aggregate" && nextElement.value.type == "aggregate") {
        clickedElement.value.games.map( (d,idx) => {
            this.tableElements.splice(i+idx+1, 0, d);
          });
    } 
    else if(clickedElement.value.type == "aggregate" && nextElement.value.type == "game"){
        let nextOne = this.tableElements[i+1];
        while(nextOne.value.type == "game"){
          this.tableElements.splice(i+1, 1);
          nextOne = this.tableElements[i+1];
        }
    }
    // If a game was clicked, do nothing.
    ;
    this.updateTable();
    
  }

  /**
   * Collapses all expanded countries, leaving only rows for aggregate
   * values per country.
   */
  collapseList() {
    
    // ******* TODO: PART IV *******
    let _tableElements = this.tableElements.filter( d => {
        return d.value.type == "aggregate"
    });
    this.tableElements = _tableElements;

    //this.updateTable()

  }
}
