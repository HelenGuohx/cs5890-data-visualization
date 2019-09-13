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

		//init node
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
		this.nodeList.some( node => {
				if (node.name === 'mammal') {
					nodeStart = node
					return true
				}
				//nodeStart = node
				//return node.name === 'mammal'
			}
		);
		console.log(nodeStart);

        //Assign Positions and Levels by making calls to assignPosition() and assignLevel()

    }

	/**
	 * Recursive function that assign positions to each node
	 */
	assignPosition(node, position) {
		
	}

	/**
	 * Recursive function that assign levels to each node
	 */
	assignLevel(node, level) {
		node.level = node.parentNode.level + 1
		
	}

	/**
	 * Function that renders the tree
	 */
	renderTree() {
        
    }

}