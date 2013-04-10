function start(initialArticle){
	/*UI = new ZoomUI();*/
	Core = new ZoomCore(initialArticle);
}

var ZoomCore = new Class({
	initialize : function(myInitialArticle) {
		console.log('Initialize new ZoomCore with:' + myInitialArticle);
		this.fetcher = new WikiFetcher();
		this.settings = new Settings();
		this.nextID = 0;
		this.curLevel = 0;
		this.prefetch = 3;
		this.vertices = 5;
		initialVertex = this.createVertex(myInitialArticle, null, 0);
		fetcher.fetch(initialVertex);
	},
	
	zoomed : function(myVertex){
		if(myVertex.level = this.curLevel)
			return;
		console.log('Zooming to vertex: ' + myVertex.id + '(' + myVertex.title + ')');
		if(myVertex.level < this.curLevel)
		{
			//TODO add code here...
			return;
		}
		
	},
	
	updated : function(myVertex){
		
	},
	
	iterateChildren : function(myVertex, f){
		for (var i=0;i<f;i++)
		{ 
			var vertex = this.createVertex(myVertex.outlinks[i],myVertex, myVertex.level + 1);
			this.fetcher.fetch(vertex);
		}
	},
	
	getNextID : function(){
		result = this.nextID;
		this.nextID += 1
		return result;
	},
	
	createVertex : function(myArticleName,myParent, myLevel){
		vertex = new Vertex()
		vertex.id = this.getNextID();
		vertex.title = myArticleName;
		vertex.level = myLevel;
		vertex.parent = myParent;
		console.log('Created new Vertex: ' + vertex.title + ' ID:' + vertex.id);
		return vertex;
	}
	
	
}),