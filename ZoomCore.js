var ZoomCore = new Class({
	/**
	 * @constructor Initializing ZoomCore
	 */
	initialize : function(myInitialArticle) {
		console.info('Initialize new ZoomCore with:' + myInitialArticle);
		//Create and initialize the global variable CUR_LEVEL
		CUR_LEVEL = 0;
		this.fetcher = new WikiFetcher();
		//this.settings = new Settings();
		//These are the values, loaded with the Setting component 
		this.nextID = 0;
		//Defines the actual prefetch level - in which the vertex will not be painted
		this.prefetch = 3;
		//Measure how many requests are still pending
		this.requestsPending = 0;
		//The initial amount of vertices in level 1
		this.vertices = 2;
		
		//Create and fetch the initial article
		initialVertex = this.createVertex(myInitialArticle, null, 0);
		this.fetcher.fetch(initialVertex);
	},

	/**
	 * The zoomed function is called by ZoomUI to tell ZoomCore on which vertex
	 * the user has been zoomed on. ZoomCore will be aware of the current zoom level and
	 * depending on this, invoke several actions.
  	 * @param {Vertex} myVertex The vertex on which ZoomUI zoomed on.
  	 */
	zoomed : function(myVertex) {
		//If the current zoom level is equal to the vertex's level, no actual zoom has been performed
		if (myVertex.level == CUR_LEVEL)
			return;
		//The user zoomed out - there is no actual action required by ZoomCore
		if (myVertex.level < CUR_LEVEL) {
			console.log('Zooming back to vertex: ' + myVertex.id + '(Title:' + myVertex.title + ' Level:' 
			+ myVertex.level + ')');
			CUR_LEVEL = myVertex.level;
			this.paintSuccessors(myVertex, true);
		} else {
			//This code will be reached if the user performed an zoom (in) action on a certain vertex
			console.log('Zooming to vertex: ' + myVertex.id + '(Title: "' + myVertex.title + '" Level:' 
			+ myVertex.level + ')');
			CUR_LEVEL = myVertex.level;
			//Now we have to paint all the vertices, which have not been painted yet
			this.paintSuccessors(myVertex, false);
			//Requests the missing vertices
			this.iterateChildren(myVertex, this.vertices);
		}

	},
	
	/**
	 * This paints the successors of a certain vertex, which have not been displayed
	 * yet. 
	 * @param {Vertex} The actual 'ancestor' of the to be painted vertices 
	 */
	paintSuccessors : function(myVertex, myPaintAll){
	
		if(myPaintAll == true){
			UI.paint(myVertex);
			UI.setPaintJob(true);
		}
		else{
			//Decided whether the vertex's level is on the upcoming
			if(myVertex.level == ((this.prefetch + 1) - CUR_LEVEL)){
				UI.paint(myVertex);
				//Activate the cyclic paint 'thread'
				UI.setPaintJob(true);
			}
		}
			
		//Traverse recursively downwards the tree in order to paint the next visible 
		//level
		for(var i = 0; i < myVertex.children.length; i++){
			this.paintSuccessors(myVertex.children[i], myPaintAll);
		}
		
	},

	/**
	 * This function will be called by WikiFetcher. It happens when a new vertex's retrieval has
	 * been fulfilled. At this point a vertex stores all data to be processed.
 	 * @param {Vertex} myVertex The just arrived vertex object
	 */
	updated : function(myVertex) {
		//Decrement the pending requests counter
		this.requestsPending -= 1;
		//The wikipedia link will only be set, in case everything went just fine 
		if (myVertex.link != null) {
			//Check whether the next vertex will not be beyond the prefetch level
			if (myVertex.level < (CUR_LEVEL + (this.prefetch + 1))) {
				//Go through the successors for this vertex
				this.iterateChildren(myVertex, (this.vertices - (myVertex.level - CUR_LEVEL)));
			}
		}
		
		//In case the current vertex is within the visible levels, just paint it
		if(myVertex.level < (CUR_LEVEL + this.prefetch)){
			UI.paint(myVertex);
			//Activate the cyclic paint 'thread', since a new vertex was added
			UI.setPaintJob(true);
		}
		
		
	},

	/**
	 * This function collects the successors of the given vertex by following its outgoing
	 * links. It also creates the vertex-objects and submits the request with WikiFetcher. 
 	 * @param {Vertex} myVertex The actual 'ancestor'
 	 * @param {Number} f This defined the amount of vertices to fetch for the given level 
	 */
	iterateChildren : function(myVertex, f) {
		//If the given vertex contains already some children, we either have to add some or
		//catch them the all
		if (myVertex.children.length != 0) {
			//If the given vertex has already the required (or more) count of children, only the successors have to be checked
			if (myVertex.children.length >= f) {
				for (var i = 0; i < myVertex.children.length; i++) {
					this.iterateChildren(myVertex.children[i], f - 1);
				}
			} else {
				//This branch will be reached in case a vertex has less than the required children
				//However, the children also have to be checked
				for (var i = 0; i < f; i++) {
					if (myVertex.outlinks[i] == undefined){
						console.error('Outlink was undefined.');
						continue;
					}
					if(myVertex.children[i] != undefined){
						this.iterateChildren(myVertex.children[i], f -1);
					}
					else
					{
						//For the amount of additional required children: fetch the remaining
						//Create a new vertex - pass the title, pass this as ancestor, increase the level
						var vertex = this.createVertex(myVertex.outlinks[i], myVertex, (myVertex.level + 1));
						//Add it as child to this vertex
						myVertex.children.push(vertex);
						console.log('Fetching new vertex:' + vertex.title + ' ID:' + vertex.id + ' Level:' + vertex.level);
						this.fetcher.fetch(vertex);
						//Increment the pending requests counter
						this.requestsPending += 1;
					}
				}
			}
		} else {
			//This branch will be reached in case the vertex has no children ever loaded.
			//If the given vertex has no outlink, there is no option to point out some children
			if (myVertex.outlinks == null)
				return;
			for (var i = 0; i < f; i++) {
				if(myVertex.outlinks[i] == undefined){
					continue;
				}
				//Create a new vertex - pass the title, pass this as ancestor, increase the level
				var vertex = this.createVertex(myVertex.outlinks[i], myVertex, (myVertex.level + 1));
				//Add it as child to this vertex
				myVertex.children.push(vertex);
				console.log('Fetching new vertex:' + vertex.title + ' ID:' + vertex.id + ' Level:' + vertex.level);
				//FETCH!
				this.fetcher.fetch(vertex);
				this.requestsPending += 1;
			}
		}
	},

	/**
	 * This function generates a unique id. 
 	 * @return Returns the next id, which can be assigned on a vertex 
 	 */
	getNextID : function() {
		result = this.nextID;
		this.nextID += 1
		return result;
	},
	
	/**
	 * This function constructs an new vertex object.
 	 * @param {String} myArticleName The name of the related wikipedia article 
     * @param {Vertex} myParent The 'ancestor' of this new vertex
     * @param {Number} myLevel The designated level of this vertex
     * @return The constructed vertex object
	 */
	createVertex : function(myArticleName, myParent, myLevel) {
		var vertex = new Vertex()
		vertex.id = this.getNextID();
		vertex.title = myArticleName;
		vertex.level = myLevel;
		vertex.parent = myParent;
		return vertex;
	},
})

/**
 * This function will be called by the landingpage in order to start the WikiZoom application.
 * @param {String} initialArticle The initial article name
 */
function start(initialArticle) {
	UI = new ZoomUI();
	Core = new ZoomCore(initialArticle);
}
