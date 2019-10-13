/** Class implementing the infoPanel view. */
class InfoPanel {
  /**
   * Creates a infoPanel Object
   */
  constructor() {
  }

  /**
   * Update the info panel to show info about the currently selected world cup
   * @param oneWorldCup the currently selected world cup
   */
  updateInfo(oneWorldCup) {

    // ******* TODO: PART III *******

    // Update the text elements in the infoBox to reflect:
    // World Cup Title, host, winner, runner_up, and all participating teams that year

    // Hint: For the list of teams, you can create an list element for each team.
    // Hint: Select the appropriate ids to update the text content.

    //Set Labels

    document.getElementById("edition").innerHTML = "World Cup Title" + oneWorldCup["EDITION"];

    document.getElementById("host").innerHTML = oneWorldCup["host"];

    document.getElementById("winner").innerHTML = oneWorldCup["winner"];

    document.getElementById("silver").innerHTML = oneWorldCup["runner_up"];

    // let teams = document.getElementById("teams");
    let teams_list = oneWorldCup["teams_names"];
    let ul = document.createElement("ul");
    ul.style = "list-style-type:none;"
    ul.style.padding = 0;
    ul.style.margin = 0;
    teams_list.map( (t, i) => {
      let li = document.createElement("li");
      li.innerHTML = t;
      ul.appendChild(li);

    })
    document.getElementById("teams").appendChild(ul);

  }

}
