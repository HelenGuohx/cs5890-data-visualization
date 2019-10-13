/** Class implementing the map view. */
class Map {
  /**
   * Creates a Map Object
   */
  constructor() {
    this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

  }

  /**
   * Function that clears the map
   */
  clearMap() {

    // ******* TODO: PART V*******
    // Clear the map of any colors/markers; You can do this with inline styling or by
    // defining a class style in styles.css

    // Hint: If you followed our suggestion of using classes to style
    // the colors and markers for hosts/teams/winners, you can use
      d3.select("#map")
        .selectAll("path")
        .attr("class","countries")
        ;

  }

  /**
   * Update Map with info for a specific FIFA World Cup
   * @param wordcupData the data for one specific world cup
   */
  updateMap(worldcupData) {

    //Clear any previous selections;
    this.clearMap();
    d3.select("#map").select("circle").remove();


    // ******* TODO: PART V *******

    // Add a marker for the winner and runner up to the map.

    // Hint: remember we have a conveniently labeled class called .winner
    // as well as a .silver. These have styling attributes for the two
    // markers.


    // Select the host country and change it's color accordingly.

    // Iterate through all participating teams and change their color as well.

    // We strongly suggest using CSS classes to style the selected countries.


    // Add a marker for gold/silver medalists
    console.log("worldcupData", worldcupData);

    let teams_iso = worldcupData.teams_iso;
    teams_iso.forEach( (t, i) => {
      d3.select("#map")
        .select('#' + t.toString())
        .attr("class", "team")
        ;
    });

    document.getElementById(worldcupData.host_country_code).setAttribute('class','host');

    let win_pos = worldcupData.win_pos;
    let ru_pos = worldcupData.ru_pos;
    win_pos = this.projection(win_pos);
    ru_pos = this.projection(ru_pos);

    d3.select("#map").select("circle").remove();
    d3.select("#map")
      .append("circle")
      .attr("cx", win_pos[0])
      .attr("cy", win_pos[1])
      .attr("r", 8)
      .attr("class", "gold")
      ;

    d3.select("#map")
      .append("circle")
      .attr("cx", ru_pos[0])
      .attr("cy", ru_pos[1])
      .attr("r", 8)
      .attr("class", "silver")
      ;




  }

  /**
   * Renders the actual map
   * @param the json data with the shape of all countries
   */
  drawMap(world) {

    //(note that projection is a class member
    // updateMap() will need it to add the winner/runner_up markers.)

    // ******* TODO: PART IV *******

    // Draw the background (country outlines; hint: use #map).
    // You will need to convert the topoJSON file to geoJSON.
    // Make sure and add gridlines to the map.

    // Hint: assign an id to each country path to make it easier to select afterwards
    // we suggest you use the variable in the data element's .id field to set the id

    // Make sure and give your paths the appropriate class (see the .css selectors at
    // the top of the provided html file)

    console.log("world",world);
    var countries = topojson.feature(world, world.objects.countries);
    var path = d3.geoPath().projection(this.projection);

    var graticule=d3.geoGraticule();
    var graticuleProjection=d3.geoPath().projection(graticule.lines());

    d3.select("#map")
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr('id', c => c.id)
      .attr("stroke-width",1)
      .attr("class", "countries")
      .on("click", function(c, i) {
        console.log(c,i);
        barChart.worldMap.clearMap();
        d3.select(this).attr('class', 'selected');

      })
      ;


     d3.select("#points")
        .append("path")
        .datum(graticule)
        .attr("d",path)
        .attr("fill","none")
        .style("stroke","grey")
        .style("stroke-width", "1")
        .style("opacity", 0.3)



  }


}
