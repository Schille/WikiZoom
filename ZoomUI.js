var zoomUI = new Class({
	initialize : function() {

		paper_width = (window.innerWidth - window.innerWidth / 10);
		paper_height = (window.innerHeight - window.innerHeight / 10);
		paper = Raphael(0, 0, paper_width, paper_height);
		paths = paper.set();
		scope_zoomUI = this;
		paper.customAttributes.grad = function(colorAngle, startColor, endColor) {
			return {
				fill : colorAngle + '-' + startColor + '-' + endColor,
			};
		}
		paper.customAttributes.stroke1 = function() {
			return {
				stroke : 'none',
			};
		}
			

	},

	calcIPoint : function(myNode1, myNode2) {
		if (Math.sqrt((myNode2.svg[0].attr("cx") - (myNode1.svg[0].attr("cx")) ^ 2 + ((myNode2.svg[0].attr("cy") - (myNode1.svg[0].attr("cy")) ^ 2) >= ((myNode2.svg[0].attr("r") + (myNode1.svg[0].attr("r")))))))) {

			return true;
		} else {
			return true;
		}

	},

	createEdge : function(vertexChild) {

		var xP = vertexChild.parent.svg[0].attr("cx");
		var yP = vertexChild.parent.svg[0].attr("cy");
		var xC = vertexChild.svg[0].attr("cx");
		var yC = vertexChild.svg[0].attr("cy");
		var startColor = vertexChild.parent.svg[0].attr("fill");
		var endColor = vertexChild.parent.svg[0].attr("fill");
		var colorAngle = Math.ceil(Raphael.angle(xP, yP, xC, yC));
	
		
	
		if (colorAngle > 90 && colorAngle < 270)
			if (colorAngle > 180)
				colorAngle = colorAngle - 90 + 180;
			else
				colorAngle = colorAngle - 180;
		else 
			if (colorAngle < 180)
				colorAngle = colorAngle + 90 + 180;
			else
				colorAngle = colorAngle + 90;

		if (xP <= xC && yP < yC) {
			var path = paper.path("M" + (xP - 10) + "," + yP + " L" + xC + "," + yC + " L" + xP + "," + (yP - 10));
			path.attr({
				'fill' : 'white',
				stroke : 'none',
			});
			path.animate({
				grad : [colorAngle, startColor, endColor],
				stroke1 : 'none',
			}, 2000, ">").toBack();
			paths.push(path);
			vertexChild.path = path;
		}
		if (xP >= xC && yP <= yC) {
			var path = paper.path("M" + xP + "," + (yP - 10) + " L" + xC + "," + yC + " L" + (xP + 10) + "," + yP);
			path.attr({
				'fill' : 'white',
				stroke : 'none',
			});
			path.animate({
				grad : [colorAngle, startColor, endColor],
				stroke1 : 'none',
			}, 2000, ">").toBack();
			paths.push(path);
			vertexChild.path = path;
			
		}
		if (xP >= xC && yP > yC) {
			var path = paper.path("M" + xP + "," + (yP + 10) + " L" + xC + "," + yC + " L" + (xP + 10) + "," + yP);
			path.attr({
				'fill' : 'white',
				stroke : 'none',
			});
			path.animate({
				grad : [colorAngle, startColor, endColor],
				stroke1 : 'none',
			}, 2000, ">").toBack();
			paths.push(path);
			vertexChild.path = path;

		}
		if (xP <= xC && yP >= yC) {
			var path = paper.path("M" + (xP - 10) + "," + yP + " L" + xC + "," + yC + " L" + xP + "," + (yP + 10));
			path.attr({
				'fill' : 'white',
				stroke : 'none',
			});
			path.animate({
				grad : [colorAngle, startColor, endColor],
				stroke1 : 'none',
			}, 2000, ">").toBack();
			paths.push(path);
			vertexChild.path = path;
		}


	},

	shadeColor : function(color, percent) {
		var num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 0x00FF) + amt, G = (num & 0x0000FF) + amt;
		return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
	},

	displayChildNodes : function(myNode, x, y) {
		var level_fac = (Math.pow(0.7, myNode.level));

		var child_count = myNode.children.length;

		var angle_steps = Math.PI * 2 / child_count;
		var angle = angle_steps;

		if (child_count > 1) {

			for ( i = 0; i < child_count - 1; i++) {
				this.moveNode(myNode.children[i], Math.ceil((200 * level_fac * Math.cos(angle) + x)), Math.ceil((200 * level_fac * Math.sin(angle) + y)));
				angle = angle_steps + angle;
			}

		}

		var vertex_to_paint = this.paintNode(myNode.children[child_count - 1], Math.ceil((200 * level_fac * Math.cos(angle) + x)), Math.ceil((200 * level_fac * Math.sin(angle) + y)), myNode)
		this.createEdge(myNode.children[child_count - 1]);
		return vertex_to_paint;

	},

	moveNode : function(myNode, mx, my) {
		var gnupsi1 = myNode.svg;
		var nodePath = myNode.path;
		var xP = myNode.parent.svg[0].attr("cx");
		var yP = myNode.parent.svg[0].attr("cy");
		
		
		var level_fac = (Math.pow(0.7, myNode.level));
		var child_count = myNode.children.length;

		var angle_steps = Math.PI * 2 / child_count;
		var angle = angle_steps;
		
		gnupsi1.forEach(function(element) {
			if (element.attr("text") != undefined) {
				var move1 = element.animate({
					"x" : mx,
					"y" : my
				}, 2000, "backOut");
			} else {
				element.animate({
					"cx" : mx,
					"cy" : my
				}, 2000, "backOut");
			}

		});
		
		myNode.svg.attr({
					"cx" : (mx),
					"cy" : (my),
					"x" : (mx),
					"y" : (my)
				});
		
		
		
		if (xP <= mx && yP <= my) {
			nodePath.animate({
				path : "M" + (xP - 10) + "," + yP + " L" + mx + "," + my + " L" + xP  + "," + (yP - 10),
			}, 2000, "backOut").toBack();
			

		}
		if (xP >= mx && yP <= my) {
			nodePath.animate({
				path : "M" + xP + "," + (yP - 10) + " L" + mx + "," + my + " L" + (xP + 10) + "," + yP,
			}, 2000, "backOut").toBack();
			
		}
		if (xP >= mx && yP >= my) {
			nodePath.animate({
			path : "M" + xP + "," + (yP + 10) + " L" + mx + "," + my + " L" + (xP + 10) + "," + yP,
			}, 2000, "backOut").toBack();
			

		}
		if (xP <= mx && yP >= my) {
			nodePath.animate({
				path : "M" + (xP - 10) + "," + yP + " L" + mx + "," + my + " L" + xP + "," + (yP + 10),
			}, 2000, "backOut").toBack();
			
		}
		
		if(myNode.children.length > 0) {
			
			for(var j = 0; j < myNode.children.length; j++) {
				this.moveNode(myNode.children[j],Math.ceil((200 * level_fac * Math.cos(angle)) + mx), Math.ceil((200 * level_fac * Math.sin(angle)) + my));
				angle = angle_steps + angle;
			}
		}
		
	},

	paintNode : function(myNode, x, y) {
		var level_fac = (Math.pow(0.7, myNode.level));
		var size = 50 * level_fac;
		var fontsize = 20 * level_fac;
		
		paper.setStart();
		var circle1 = paper.circle(x, y, 0);

		circle1.attr({
			"fill" : "#CCCCCC",
			"fill-opacity" : 1,
			"stroke" : '#AAAAAA',
			"stroke-width" : 2,
		});
		var circle11 = paper.circle(x, y, 0);
		circle11.attr({
			"stroke" : '#AAAAAA',
			"stroke-dasharray" : "- ",
			"stroke-width" : 2,
			"stroke-linecap" : "round",
		});

		var text1 = paper.text(x, y, myNode.title).toFront();
		text1.attr({
			"font-size" : 0,
			"font-family" : "Cabin",
			"fill" : '#555555',
		});
		var set3 = paper.setFinish();

		circle1.attr({
			"fill" : this.shadeColor("#CCCCCC", (1 - level_fac) * 35),
			"stroke" : this.shadeColor("#AAAAAA", (1 - level_fac) * 50)
		});
		circle11.attr({
			"stroke" : this.shadeColor("#AAAAAA", (1 - level_fac) * 50)
		});
		text1.attr({
			"fill" : this.shadeColor("#555555", (1 - level_fac) * 80)
		});

		var an1 = circle1.animate({
			"r" : size
		}, 2000, "elastic");
		circle11.animateWith(circle1, an1, {
			"r" : (size - 4)
		}, 2000, "elastic");
		text1.animateWith(circle1, an1, {
			"font-size" : fontsize
		}, 2000, "elastic");

		myNode.svg = set3;

		var over = function(event) {
			set3.animate({
				transform : "s1.1"
			}, 2000, "elastic");

		};

		var out = function(event) {
			set3.animate({
				transform : "s1"
			}, 2000, "elastic");
		};

		set3.mouseover(over);
		set3.mouseout(out);
		
	
		
		
		

		return myNode;
	},

	test : function() {
		
		
		var vertex_mom = new Vertex();
		vertex_mom.title = "Chaostheorie";
		vertex_mom.intro = "introtext";
		vertex_mom.level = 0;
		
		var vertex_child1 = new Vertex();
		vertex_child1.title = "Shits";
		vertex_child1.intro = "introtext";
		vertex_child1.level = 1;
		vertex_child1.parent = vertex_mom;
		vertex_mom.children.push(vertex_child1);
		vertext_mom = this.paintNode(vertex_mom, paper_width / 2, paper_height / 2, null, null);
		vertex_child1 = this.displayChildNodes(vertex_mom, vertex_mom.svg[0].attr("cx"), vertex_mom.svg[0].attr("cy"));
		//moveNode(vertex_child1, 200, 200);

		var vertex_child2 = new Vertex();
		vertex_child2.title = "Hass";
		vertex_child2.intro = "introtext";
		vertex_child2.level = 1;
		vertex_child2.parent = vertex_mom;
		vertex_mom.children.push(vertex_child2);
		vertex_child2 = this.displayChildNodes(vertex_mom, vertex_mom.svg[0].attr("cx"), vertex_mom.svg[0].attr("cy"));

		var vertex_child3 = new Vertex();
		vertex_child3.title = "Liebe";
		vertex_child3.intro = "introtext";
		vertex_child3.level = 1;
		vertex_child3.parent = vertex_mom;
		vertex_mom.children.push(vertex_child3);
		vertex_child3 = this.displayChildNodes(vertex_mom, vertex_mom.svg[0].attr("cx"), vertex_mom.svg[0].attr("cy"));

		var vertex_child4 = new Vertex();
		vertex_child4.title = "Ahh";
		vertex_child4.intro = "introtext";
		vertex_child4.level = 1;
		vertex_child4.parent = vertex_mom;
		vertex_mom.children.push(vertex_child4);
		vertex_child4 = this.displayChildNodes(vertex_mom, vertex_mom.svg[0].attr("cx"), vertex_mom.svg[0].attr("cy"));

		var vertex_child5 = new Vertex();
		vertex_child5.title = "Mies";
		vertex_child5.intro = "introtext";
		vertex_child5.level = 1;
		vertex_child5.parent = vertex_mom;
		vertex_mom.children.push(vertex_child5);
		vertex_child5 = this.displayChildNodes(vertex_mom, vertex_mom.svg[0].attr("cx"), vertex_mom.svg[0].attr("cy"));

		var vertex_child11 = new Vertex();
		vertex_child11.title = "Poop";
		vertex_child11.intro = "introtext";
		vertex_child11.level = 2;
		vertex_child11.parent = vertex_child1;
		vertex_child1.children.push(vertex_child11);
		vertex_child11 = this.displayChildNodes(vertex_child1, vertex_child1.svg[0].attr("cx"), vertex_child1.svg[0].attr("cy"));
		
		
		var rect = paper.rect(0, 0, 50, 50);
		rect.attr({fill:'black'});
		rect.click(function() {
			var vertex_child6 = new Vertex();
			vertex_child6.title = "New Stuff";
			vertex_child6.intro = "introtext";
			vertex_child6.level = 2;
			vertex_child6.parent = vertex_child1;
			vertex_child1.children.push(vertex_child6);
			vertex_child6 = scope_zoomUI.displayChildNodes(vertex_child1, vertex_child1.svg[0].attr("cx"), vertex_child1.svg[0].attr("cy"));
			
			// var vertex_child7 = new Vertex("New Stuff", "Some things about hass", "http://wikipedia.org/hass", 2, vertex_child5);
			// vertex_child5.children.push(vertex_child7);
			// vertex_child7 = scope.displayChildNodes(vertex_child5, vertex_child5.svg[0].attr("cx"), vertex_child5.svg[0].attr("cy"));
// 			
		});
		var rect = paper.rect(60, 0, 50, 50);
		rect.attr({fill:'black'});
		rect.click(function(event) {
			var vertex_child6 = new Vertex();
			vertex_child6.title = "New Stuff";
			vertex_child6.intro = "introtext";
			vertex_child6.level = 1;
			vertex_child6.parent = vertex_mom;
			vertex_mom.children.push(vertex_child6);
			vertex_child6 = scope_zoomUI.displayChildNodes(vertex_mom, vertex_mom.svg[0].attr("cx"), vertex_mom.svg[0].attr("cy"));
						
			// var vertex_child7 = new Vertex("New Stuff", "Some things about hass", "http://wikipedia.org/hass", 2, vertex_child5);
			// vertex_child5.children.push(vertex_child7);
			// vertex_child7 = scope.displayChildNodes(vertex_child5, vertex_child5.svg[0].attr("cx"), vertex_child5.svg[0].attr("cy"));
// 			
		});
		
		

	},
});
