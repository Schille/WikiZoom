
			var vertex = new Class({
				initialize : function(myTitle, myIntro, myLink, myLevel) {
					this.id = 0;
					this.parent = null;
					this.ajax
					this.children = new Array();
					this.title = myTitle;
					this.intro = myIntro;
					this.link = myLink;
					this.outlinks;
					this.svg;
					this.level = myLevel;
				},
			});