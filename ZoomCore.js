var ZoomCore = new Class({
	initialize : function(myInitialArticle) {
		console.info('Initialize new ZoomCore with:' + myInitialArticle);
		CUR_LEVEL = 0;
		this.fetcher = new WikiFetcher();
		//this.settings = new Settings();
		this.nextID = 0;
		this.prefetch = 3;
		this.vertices = 5;
		initialVertex = this.createVertex(myInitialArticle, null, 0);
		//fetcher.fetch(initialVertex);
	},

	zoomed : function(myVertex) {
		if (myVertex.level == CUR_LEVEL)
			return;

		if (myVertex.level < CUR_LEVEL) {
			console.log('Zooming back to vertex: ' + myVertex.id + '(' + myVertex.title + ')');
			CUR_LEVEL = myVertex.level;
			return;
		} else {
			console.log('Zooming to vertex: ' + myVertex.id + '(' + myVertex.title + ')');
			this.iterateChildren(myVertex, this.vertices);
		}

	},

	updated : function(myVertex) {
		if (myVertex.level < (CUR_LEVEL + (this.prefetch + 1))) {
			this.iterateChildren(myVertex, this.vertices);
		}
	},

	iterateChildren : function(myVertex, f) {
		if(myVertex.outlinks == undefined)
			return;
		for (var i = 0; i < f; i++) {
			if(myVertex.outlinks[i] == undefined)
				continue;
			var vertex = this.createVertex(myVertex.outlinks[i], myVertex, (myVertex.level + 1));
			console.log('Fetching vertex: ' + vertex.id + '(' + vertex.title + ' ' + vertex.level + ')');
			this.fetcher.fetch(vertex);
		}
		return;
	},

	getNextID : function() {
		result = this.nextID;
		this.nextID += 1
		return result;
	},

	createVertex : function(myArticleName, myParent, myLevel) {
		var vertex = new Vertex()
		vertex.id = this.getNextID();
		vertex.title = myArticleName;
		vertex.level = myLevel;
		vertex.parent = myParent;
		console.log('Created new Vertex: ' + vertex.title + ' ID:' + vertex.id);
		return vertex;
	},
})

function start(initialArticle) {
	UI = new ZoomUI();
	Core = new ZoomCore(initialArticle);
}