var Vertex = new Class({
	initialize : function(myTitle, myIntro, myLink, myLevel, myParent) {
		this.id = 0;
		this.parent = myParent;
		this.ajax
		this.children = new Array();
		this.title = myTitle;
		this.intro = myIntro;
		this.link = myLink;
		this.outlinks;
		this.svg;
		this.level = myLevel;
		this.path;
	},
});