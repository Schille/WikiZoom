var ZoomCore = new Class({
	initialize : function(myInitialArticle) {
		console.info('Initialize new ZoomCore with:' + myInitialArticle);
		CUR_LEVEL = 0;
		this.fetcher = new WikiFetcher();
		//this.settings = new Settings();
		this.nextID = 0;
		this.prefetch = 3;
		this.requestsPending = 0;
		this.prefetchStack = new Array();
		this.vertices = 5;
		initialVertex = this.createVertex(myInitialArticle, null, 0);
		this.fetcher.fetch(initialVertex);
	},

	zoomed : function(myVertex) {
		if (myVertex.level == CUR_LEVEL)
			return;

		if (myVertex.level < CUR_LEVEL) {
			console.log('Zooming back to vertex: ' + myVertex.id + '(Title:' + myVertex.title + ' Level:' 
			+ myVertex.level + ')');
			CUR_LEVEL = myVertex.level;
			return;
		} else {
			console.log('Zooming to vertex: ' + myVertex.id + '(Title: "' + myVertex.title + '" Level:' 
			+ myVertex.level + ')');
			CUR_LEVEL += 1;
			this.iterateChildren(myVertex, this.vertices);
			UI.paint(Object.clone(this.prefetchStack));
			this.prefetchStack.length = 0;
		}

	},

	updated : function(myVertex) {
		this.requestsPending -= 1;
		if (myVertex.link != null) {
			if (myVertex.level < (CUR_LEVEL + (this.prefetch))) {
				this.iterateChildren(myVertex, (this.vertices - (myVertex.level - CUR_LEVEL)));
			}
		}
		
		if(myVertex.level >= (CUR_LEVEL + this.prefetch)){
			this.prefetchStack.push(myVertex);
		}
		else{
			UI.paint(myVertex);	
		}
		if(this.requestsPending > 0){
			UI.setPaintJob(true);
		}
		
	},

	iterateChildren : function(myVertex, f) {
		if (myVertex.children.length != 0) {
			if (myVertex.children.length >= f) {
				for (var i = 0; i < myVertex.children.length; i++) {
					this.iterateChildren(myVertex.children[i], f - 1);
				}
			} else {
				for (var i = 0; i < (f - myVertex.children.length); i++) {
					if (myVertex.outlinks[i] == undefined)
						continue;
					var vertex = this.createVertex(myVertex.outlinks[i], myVertex, (myVertex.level + 1));
					myVertex.children.push(vertex);
					console.log('Fetching new vertex:' + vertex.title + ' ID:' + vertex.id + ' Level:' + vertex.level);
					this.fetcher.fetch(vertex);
					this.requestsPending += 1;
				}
			}
		} else {
			if (myVertex.outlinks == null)
				return;
			for (var i = 0; i < f; i++) {
				if(myVertex.outlinks[i] == undefined)
					continue;
				var vertex = this.createVertex(myVertex.outlinks[i], myVertex, (myVertex.level + 1));
				myVertex.children.push(vertex);
				console.log('Fetching new vertex:' + vertex.title + ' ID:' + vertex.id + ' Level:' + vertex.level);
				this.fetcher.fetch(vertex);
				this.requestsPending += 1;
			}
		}
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
		return vertex;
	},
})

function start(initialArticle) {
	UI = new ZoomUI();
	Core = new ZoomCore(initialArticle);
}
