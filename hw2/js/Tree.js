/** Class representing a Tree. */
class Tree {
	/**
	 * Creates a Tree Object
	 * parentNode, children, parentName,level,position
	 * @param {json[]} json - array of json object with name and parent fields
	 */
	constructor(json) {

		var nodeList = [];
		var parentMap = new Map();

		for (var i = 0; i < json.length; i ++ ) {
			let node = new Node(json[i].name, json[i].parent)
			nodeList.push(node)
			
			if( !parentMap.has(node.name) ) {
				parentMap.set(node.name, node)
			}
		};

		for ( var i = 0; i < nodeList.length; i ++ ) {
			let node = nodeList[i]
			node.parentNode = parentMap.get(node.parentName)
			
			if( node.parentName != 'root') {
				node.parentNode.addChild(node)
			}
			
		};

		this.nodeList = nodeList
		
		
	}

	/**
	 * Function that builds a tree from a list of nodes with parent refs
	 */
	buildTree() {
		var nodeStart
		var nodeMammal
		var levelPositionMap = new Map()

		this.nodeList.some( node => {
				if (node.name === 'Mammal') {
					nodeMammal = node
				}
				else if(node.name === 'Animal' ) {
					nodeStart = node
				}

				return nodeMammal && nodeStart
			});

		console.log(nodeStart);
		console.log(nodeMammal);

        //Assign Positions and Levels by making calls to assignPosition() and assignLevel()
        this.assignLevel(nodeStart, 0);
        this.assignPosition(nodeStart, 0);
		console.log("tree after assigning level and postion",nodeStart);

		this.nodeStart = nodeStart


    }

	/**
	 * Recursive function that assign positions to each node
	 */


	// Iteration that gets the arrays of all the nodes in the same level
	assignPosition(node, position) {
		var nodeListSameLevel = [node];
		var startPosition;
		node.position = position;
		while (nodeListSameLevel){
			var temp = [];
			for(let i = 0; i < nodeListSameLevel.length; i ++ ) {
			 	temp  = temp.concat(nodeListSameLevel[i].children)
			};
			if(!temp || !temp.length) {
				break
			};
			nodeListSameLevel = temp;
			startPosition = nodeListSameLevel[0].parentNode.position;
			nodeListSameLevel.forEach( (nodeChild, idx) => {
				nodeChild.position = startPosition + idx
			});
		}
	}

	/**
	 * Recursive function that assign levels to each node
	 */
	assignLevel(node, level) {
		node.level = level
		if(node.children) {
			node.children.forEach( nodeChild => {
				this.assignLevel(nodeChild, level + 1)
			})
		}
			
	}

	//tree to array
	convertTreeToArray(node, nodeList) {

		if (!node.children || !node.children.length) {
			return nodeList
		} 
		node.children.forEach( nodeChild => {
			nodeList.push(nodeChild)
			this.convertTreeToArray(nodeChild, nodeList)
		})

	}

	/**
	 * Function that renders the tree
	 */
	renderTree() {
		let svg = d3.select('body')
					.append('svg')
					.attr('width', 1200)
					.attr('height', 1200)
		;
		let data = [this.nodeStart];
		this.convertTreeToArray(this.nodeStart, data) ;
		console.log("data",data);
		
		var selections = svg.selectAll('line')
		   .data(data)
		   .enter()

	    selections.append('line')
		   		  .attr('x1', d => d.level * 200 + 200)
		          .attr('y1', d => d.position * 100 + 100)
		          .attr('x2', d => !d.parentNode?200: d.parentNode.level * 200 + 200)
		          .attr('y2', d => !d.parentNode?100: d.parentNode.position * 100 + 100)
		
		;		


		selections.append('circle')
		   		  .attr('cx', d => d.level * 200 + 200)
		          .attr('cy', d => d.position * 100 + 100)
		          .attr('r', 40)

		;

		selections.append('text')
				  .attr('class', 'label')
				  .text(d => d.name)
		   		  .attr('x', d => d.level * 200 + 200)
		          .attr('y', d => d.position * 100 + 100)
		          .attr('text-anchor', "middle")
		          .attr('alignment-baseline', 'middle')
		
		;
	
        
    }

}