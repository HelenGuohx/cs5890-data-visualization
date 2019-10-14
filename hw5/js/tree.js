/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on
     * the input data
     *
     * @param treeData an array of objects that contain parent/child
     * information.
     */
  createTree(treeData) {

    // ******* TODO: PART VI *******
    console.log("tree data", treeData);

    // Create a tree and give it a size() of 800 by 300. 
    let treeMap = d3.tree().size([800, 300]);

    // Create a root for the tree using d3.stratify(); 
    let root = d3.stratify()
        .id(d => { return d.id })
        .parentId( d => { 
            return d.ParentGame? treeData[Number(d.ParentGame)].id : null;
          })
        (treeData)
        ;
    console.log("root", root);

    // Add nodes and links to the tree. 
    let nodes = treeMap(root).descendants() ;
    let nodesWithParents = treeMap(root).descendants().slice(1) ;

    let tree = d3.select('#tree')
    tree.attr("transform", "translate(80, 0)");

    tree.selectAll("path")
        .data(nodesWithParents)
        .enter()
        .append("g")
        // .attr("transform", "translate(0, 400) scale(")
        .append("path")
        .attr('transform', 'translate(0,20)')
        .attr('id', d => `link${d.data.Team}`)
        .attr("class", "link")
        .attr('d', d => {
            console.log(d);
            let mid = (d.parent.y-d.y)/3;
            return `M ${d.y}, ${d.x} C ${d.y + mid}, ${d.x}` 
                  +` ${d.parent.y - mid} , ${d.parent.x} ${d.parent.y} , ${d.parent.x}`
        })

        ;
    let node = tree.selectAll("circle")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform", d => { return `translate(${d.y}, ${d.x+20})`} )
        .attr("class", "node")
        .append("g")
        .attr("class", d => { return d.data.Wins > d.data.Losses? "winner": "loser"} )
        ;

    node.append("circle") //add circle to each node
        .attr("id", d => "c" + d.id)
        .attr("r", 5)
        ;


    node.append("text")  // add text to each node
        .attr("id", d => `text${d.data.Team}`)
        .attr("dx", d => {return d.depth == 4? 7: -7})
        .attr("dy", 5)
        .text(d => d.data.Team)
        .attr("text-anchor", d => {
          return d.depth == 4? "start" : "end";
        })

        ;


    
  };

  /**
   * Updates the highlighting in the tree based on the selected team.
   * Highlights the appropriate team nodes and labels.
   *
   * @param row a string specifying which team was selected in the table.
   */
  updateTree(row) {
    // ******* TODO: PART VII *******
    // console.log("row", row)
    d3.selectAll(`#link${row.key}`).attr("class","selected");

    d3.selectAll(`#text${row.key}`).attr("class","selectedLabel") ;

    
  }

  /**
   * Removes all highlighting from the tree.
   */
  clearTree() {
    // ******* TODO: PART VII *******

    // You only need two lines of code for this! No loops! 
    d3.selectAll('.selected').attr("class","link");

    d3.selectAll(".selectedLabel").classed("selectedLabel",false) ;
  }
}
