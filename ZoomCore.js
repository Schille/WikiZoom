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
			//TODO add code here...
		}

	},

	updated : function(myVertex) {
		if (myVertex.link != undefined) {
			if (myVertex.level < (CUR_LEVEL + (this.prefetch + 1))) {
				this.iterateChildren(myVertex, (this.vertices - (myVertex.level - CUR_LEVEL)));
			}
		}
		UI.paint(myVertex)
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
				}
			}
		} else {
			if (myVertex.outlinks == undefined)
				return;
			for (var i = 0; i < f; i++) {
				if(myVertex.outlinks[i] == undefined)
					continue;
				var vertex = this.createVertex(myVertex.outlinks[i], myVertex, (myVertex.level + 1));
				myVertex.children.push(vertex);
				console.log('Fetching new vertex:' + vertex.title + ' ID:' + vertex.id + ' Level:' + vertex.level);
				this.fetcher.fetch(vertex);
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
