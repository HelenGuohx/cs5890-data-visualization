// d3.json('data/fifa-matches.json').then(function(data) {
//   console.log(data);

//   //get the map of round and ranking 
//   // let resultMap = {};
//   // data.map( d => {
//   //     let games = d.value.games;
//   //     games.map( g => {
//   //         let res = g.value.Result
//   //         let label = res.label;
//   //         let ranking = res.ranking;
//   //         if(!resultMap.hasOwnProperty(label)) {
//   //             resultMap[label] = ranking; 
//   //         }
//   //     })
      

//   // });
//   // console.log(resultMap);

//    // Loads in the tree information from fifa-tree.csv and calls
//    // createTree(csvData) to render the tree.
//   d3.csv("data/fifa-tree.csv").then(function(csvData) {
//     console.log(csvData);

//     //Create a unique "id" field for each game
//     csvData.forEach(function (d, i) {
//       d.id = d.Team + d.Opponent + i;
//     });

//     //Create Tree Object
//     let tree = new Tree();
//     tree.createTree(csvData);

//     // Create Table Object and pass in reference to tree object
//     // (for hover linking)
//     let table = new Table(data,tree);

//     table.createTable();
//     table.updateTable();




//   });
// });



// //************************* HACKER VERSION *****************************
// // Loads in fifa-matches.csv file, aggregates the data into the correct
// // format, then calls the appropriate functions to create and populate
// // the table.


d3.csv("data/fifa-matches.csv").then( function(data) {
  console.log("data", data);
  
  //mapping round and ranking
  let roundRank = {
      "Group": 0,
      "Round of Sixteen":1,
      "Quarter Finals": 2,
      "Semi Finals": 3,
      "Fourth Place": 4,
      "Third Place": 5,
      "Runner-Up": 6,
      "Winner": 7,
  };
  // using index referring to keys
  let roundList = Object.keys(roundRank);


  let dataWithRank = data.slice();
  dataWithRank.map( d => {
      d.Ranking =  roundRank[d.Result];
  })

  let gameData = d3.nest()
       .key( d => d.Team)
       .rollup( leaves => {
           console.log("first leaves",leaves);
       })
       .key( d => d.Opponent)
       .rollup( leaves => {
          //console.log(leaves);
          let result = {
            "Goals Made": leaves[0]["Goals Made"],
            "Goals Conceded": leaves[0]["Goals Conceded"],
            "Delta Goals": [],
            "Wins": [],
            "Losses": [],
            "Result": {"label": leaves[0]["Result"] , "ranking": leaves[0]["Ranking"] }, //
            "type": "game",
            "Opponent": leaves[0]["Team"], //
          
          }
          ;
          return result
       })
       .entries(data);


  let teamData = d3.nest()
       .key( d => d.Team)
       .rollup( leaves => {
          // console.log(leaves);
          let rank = d3.max(leaves, l => l["Ranking"]);
          let label = roundList[rank];
          let result = {
            "Goals Made": d3.sum(leaves, l => l["Goals Made"]),
            "Goals Conceded": d3.sum(leaves, l => l["Goals Conceded"]),
            "Delta Goals": d3.sum(leaves, l => l["Delta Goals"]),
            "Wins": d3.sum(leaves, l => l["Wins"]),
            "Losses": d3.sum(leaves, l => l["Losses"]),
            "Result": {"label": label,  "ranking": rank},
            "TotalGames": leaves.length,
            "type": "aggregate",
            "games":""
          }
          ;
          return result
       })
       .entries(data);

  
  //hash map
  let gameMap = {}
  gameData.map( d => {
      return gameMap[d.key] = d;
  });

  teamData.map((d,i) => {
      return d.value.games = gameMap[d.key].values;
    });

  //console.log("teamdata", teamData);
  //console.log("gameData", gameData);
  //console.log("gameMap", gameMap);

//   // Loads in the tree information from fifa-tree.csv and calls
//   // createTree(csvData) to render the tree.
  d3.csv("data/fifa-tree.csv").then( function(csvData) {
    console.log(csvData);

    //Create a unique "id" field for each game
    csvData.forEach(function (d, i) {
      d.id = d.Team + d.Opponent + i;
    });

    //Create Tree Object
    let tree = new Tree();
    tree.createTree(csvData);

    // Create Table Object and pass in reference to tree object
    // (for hover linking)
    let table = new Table(teamData,tree);

    table.createTable();
    table.updateTable();

  });
});
// //*********************** END HACKER VERSION ***************************
