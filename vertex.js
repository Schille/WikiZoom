var Vertex = new Class({
	initialize : function() {
		this.id;						//unique id of vertex {Number}
		this.parent;					//parent vertex {Vertex}
		this.ajax						//AJAX request object
		this.children = new Array();	//array of vertex children [{Vertex}]
		this.title;						//title of vertex {String}
		this.intro;						//parsed intro text {String}
		this.link;						//link to article on wikipedia {String}
		this.outlinks = new Array();;   //array of title from outgoing links [{String}]
		this.svg;						//SVG object of vertex {Raphael}
		this.level;						//level of vertex in tree structure {Number}
		this.path;						//SVG object of vertex to it parent {Raphael}
	},

}); 

