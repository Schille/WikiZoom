function start(initialArticle){
	UI = new ZoomUI();
	Core = new ZoomCore(initialArticle);
},

var ZoomCore = new Class({
	initialize : function() {
		this.fetcher = new WikiFetcher();
		this.nextID = 0;
	},
	
	function getNextID(){
		result = this.nextID;
		this.nextID += 1
		return result;
	}
	
	function createVertex(articleName){
		vertex = new Vertex()
		vertex.id = this.getNextID();
		vertex.title = articleName;
	}
	
	
}),