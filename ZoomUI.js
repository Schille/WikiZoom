var ZoomUI = new Class({
	initialize : function() {
		this.paintStack = new Array();
		this.createTooltip();
		paper_width = (window.innerWidth - window.innerWidth / 10);
		paper_height = (window.innerHeight - window.innerHeight / 10);
		paper = Raphael(0, 0, paper_width, paper_height);
		paper.renderfix();
		paths = paper.set();
		selectedNode = null;
		this.velocity = 200;
		this.intervalOn = null;
		this.interval = null;
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

	getParentX : function(vertex) {
		return vertex.parent.svg[0].attr("cx");
	},

	getParentY : function(vertex) {
		return vertex.parent.svg[0].attr("cy");
	},

	setPaintJob : function(myFlag) {
		if (UI.intervalOn == myFlag)
			return;
		if (myFlag == true) {
			UI.interval = setInterval(this.paintVertices, this.velocity);
			UI.intervalOn = true;
		} else {
			clearInterval(UI.interval);
			UI.intervalOn = false;
		}
	},

	createEdge : function(vertexChild) {

		var xP = vertex.parent.svg[0].attr("cx");
		var yP = vertex.parent.svg[0].attr("cy");
		var xC = vertexChild.svg[0].attr("cx");
		var yC = vertexChild.svg[0].attr("cy");
		var startColor = vertexChild.parent.svg[0].attr("fill");
		var endColor = vertexChild.svg[0].attr("fill");
		var colorAngle = Math.ceil(Raphael.angle(xP, yP, xC, yC));

		if (colorAngle > 90 && colorAngle < 270)
			if (colorAngle > 180)
				colorAngle = colorAngle - 90 + 180;
			else
				colorAngle = colorAngle - 180;
		else if (colorAngle < 180)
			colorAngle = colorAngle + 90 + 180;
		else
			colorAngle = colorAngle + 90;

		if (xP <= xC && yP < yC) {
			var path = paper.path("M" + (xP - 10) + "," + yP + " L" + xC + "," + yC + " L" + xP + "," + (yP - 10));
		}
		if (xP >= xC && yP <= yC) {
			var path = paper.path("M" + xP + "," + (yP - 10) + " L" + xC + "," + yC + " L" + (xP + 10) + "," + yP);
		}
		if (xP >= xC && yP > yC) {
			var path = paper.path("M" + xP + "," + (yP + 10) + " L" + xC + "," + yC + " L" + (xP + 10) + "," + yP);
		}
		if (xP <= xC && yP >= yC) {
			var path = paper.path("M" + (xP - 10) + "," + yP + " L" + xC + "," + yC + " L" + xP + "," + (yP + 10));
		}
		path.attr({
			'fill' : 'white',
			stroke : 'none',
		});
		path.animate({
			'fill' : startColor,
			stroke1 : 'none',
		}, 2000, ">").toBack();
		vertexChild.path = path;
		return path;

	},

	shadeColor : function(color, percent) {
		var num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 0x00FF) + amt, G = (num & 0x0000FF) + amt;
		return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
	},

	zoomIn : function(vertex) {
		Core.zoomed(vertex);
		var level_fac = (Math.pow(0.7, (vertex.level - CUR_LEVEL)));
		vertex.svg.animate({
			"cx" : paper_width / 2,
			"cy" : paper_height / 2,
			"x" : paper_width / 2,
			"y" : paper_height / 2,
		}, 2000, "backOut");
		vertex.svg.attr({
			"cx" : paper_width / 2,
			"cy" : paper_height / 2,
			"x" : paper_width / 2,
			"y" : paper_height / 2,
		});
		vertex.path.remove();
		this.fadeOutSiblings(vertex);
		this.repaintNode(vertex);

		var child_count = vertex.children.length;

		var angle_steps = Math.PI * 2 / child_count;
		if ((vertex.level - CUR_LEVEL + 1) % 2 == 0) {
			var angle = angle_steps;
		} else {
			var angle = Math.ceil(angle_steps / 2);
		}

		if (child_count >= 1) {
			console.log("I'm on");
			for (var i = 0; i < child_count; i++) {
				console.log("I'm in ya");
				this.moveNode(vertex.children[i], Math.ceil((window.innerHeight / 4 * level_fac * Math.cos(angle) + vertex.svg[0].attr('cx'))), Math.ceil((window.innerHeight / 4 * level_fac * Math.sin(angle) + vertex.svg[0].attr('cy'))));
				angle = angle_steps + angle;
				this.repaintChildren(vertex.children[i]);
			}
		}
	},

	repaintChildren : function(vertex) {

		this.repaintNode(vertex);

		if (vertex.children.length > 0) {
			for (var i = 0; i < vertex.children.length; i++) {
				this.repaintChildren(vertex.children[i]);
			}
		}
	},

	repaintNode : function(vertex) {

		var level_fac = (Math.pow(0.7, (vertex.level - CUR_LEVEL)));
		var size = window.innerHeight / 16 * level_fac;
		var fontsize = 20 * level_fac;
		var temp_scope = this;

		if (vertex.svg != undefined)
			vertex.svg.forEach(function(element) {
				if (element.attr('text') == undefined) {
					if (element.attr("stroke-dasharray") == "- ") {
						element.animate({
							"stroke" : temp_scope.shadeColor("#AAAAAA", (1 - level_fac) * 50),
							"r" : size - 4,
						}, 500, "linear");
					} else {
						element.animate({
							"fill" : temp_scope.shadeColor("#CCCCCC", (1 - level_fac) * 35),
							"stroke" : temp_scope.shadeColor("#AAAAAA", (1 - level_fac) * 50),
							"r" : size
						}, 500, "linear");
						element.attr('fill', temp_scope.shadeColor("#CCCCCC", (1 - level_fac) * 35));
					}
				} else {
					element.animate({
						"fill" : temp_scope.shadeColor("#555555", (1 - level_fac) * 80),
						"font-size" : fontsize
					}, 500, "linear");
				}

			});

	},

	fadeOutSiblings : function(vertex) {
		var siblings = vertex.parent.children;
		var parent = vertex.parent;
		var temp_scope = this;
		siblings.forEach(function(temp_vertex) {
			if (temp_vertex.title != vertex.title) {
				temp_vertex.svg.animate({
					opacity : 0,
				}, 500, "linear");
				temp_vertex.path.remove();
				temp_scope.fadeOutChildren(temp_vertex);
			}
		});

		parent.svg.animate({
			opacity : 0
		}, 500, "linear");

	},

	fadeOutChildren : function(vertex) {
		var temp_scope = this;

		vertex.children.forEach(function(temp_vertex) {
			if (temp_vertex.svg != undefined) {
				temp_vertex.svg.animate({
					opacity : 0,
				}, 500, "linear");
				temp_vertex.path.remove();
				if (temp_vertex.children.length > 0) {
					temp_scope.fadeOutChildren(temp_vertex);
				}
			}
		});
	},

	moveNode : function(myNode, mx, my) {
		var gnupsi1 = myNode.svg;
		var nodePath = myNode.path;
		var xP = myNode.parent.svg[0].attr("cx");
		var yP = myNode.parent.svg[0].attr("cy");

		var startColor = myNode.parent.svg[0].attr("fill");
		console.log(myNode.title);

		var level_fac = (Math.pow(0.7, (myNode.level - CUR_LEVEL)));

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
				path : "M" + (xP - 10) + "," + yP + " L" + mx + "," + my + " L" + xP + "," + (yP - 10),
				fill : startColor,
			}, 2000, "backOut").toBack();

		}
		if (xP >= mx && yP <= my) {
			nodePath.animate({
				path : "M" + xP + "," + (yP - 10) + " L" + mx + "," + my + " L" + (xP + 10) + "," + yP,
				fill : startColor,
			}, 2000, "backOut").toBack();

		}
		if (xP >= mx && yP >= my) {
			nodePath.animate({
				path : "M" + xP + "," + (yP + 10) + " L" + mx + "," + my + " L" + (xP + 10) + "," + yP,
				fill : startColor,
			}, 2000, "backOut").toBack();

		}
		if (xP <= mx && yP >= my) {
			nodePath.animate({
				path : "M" + (xP - 10) + "," + yP + " L" + mx + "," + my + " L" + xP + "," + (yP + 10),
				fill : startColor,
			}, 2000, "backOut").toBack();

		}

		//collect all already painted children of myVertex
		var children = new Array()
		for (var i = 0; i < myNode.children.length; i++) {
			if (myNode.children[i].svg != null)
				children.push(myNode.children[i]);
		}

		if (children.length > 0) {
			var angle_steps = Math.PI * 2 / (children.length + 1);
			if ((myNode.level - CUR_LEVEL + 1) % 2 == 0) {
				var angle = angle_steps;
			} else {
				var angle = Math.ceil(angle_steps / 2);
			}

			for (var j = 0; j < children.length; j++) {
				this.moveNode(children[j], Math.ceil((window.innerHeight / 4 * level_fac * Math.cos(angle)) + mx), Math.ceil((window.innerHeight / 4 * level_fac * Math.sin(angle)) + my));
				angle = angle_steps + angle;
			}
		}

	},

	paint : function(myVertex) {

		if (myVertex.level == 0) {
			this.paintNode(myVertex, paper_width / 2, paper_height / 2);
			return;
		}
		if ( myVertex instanceof Array) {
			for (var i = 0; i < myVertex.length; i++) {
				UI.paintStack.push(myVertex[i]);
			}
			return;
		},
		}
		if (myVertex.parent == undefined)
			console.error("who is my daddy " + myVertex.title);
		UI.paintStack.push(myVertex)

	},

	paintVertices : function() {
		console.info("Running paint job.")
		for (var i = 0; i < UI.paintStack.length; i++) {
			if (UI.paintStack[i].parent.svg == null) {
				console.error('Parent was not painted yet, ' + UI.paintStack[i].parent.title);
			} else {

				vertex = UI.paintStack[i];
				UI.paintChildVertex(vertex);
				UI.paintStack.splice(i, 1);

				if (Math.random() < 0.8)
					break;
			}
		}
		if (UI.paintStack.length == 0) {
			UI.setPaintJob(false);
		}

	},

	paintChildVertex : function(myVertex) {
		var parent = myVertex.parent;
		var x = vertex.parent.svg[0].attr("cx");
		var y = vertex.parent.svg[0].attr("cy");
		console.info('Painting ' + myVertex.title + 'to x:' + x + ' y:' + y);
		var level_fac = (Math.pow(0.7, (myVertex.level - CUR_LEVEL)));

		//collect all already painted siblings of myVertex
		var siblings = new Array()
		for (var i = 0; i < myVertex.parent.children.length; i++) {
			if (myVertex.parent.children[i].svg != null)
				siblings.push(myVertex.parent.children[i]);
		}

		console.info(myVertex.title + ' : ' + siblings.length);

		var angle = 0;
		//eventually move siblings
		if (siblings.length > 0) {

			//calculate the new angles for all sibling vertices
			var angle_steps = Math.PI * 2 / (siblings.length + 1);

			if ((myVertex.level - CUR_LEVEL + 1) % 2 == 0) {
				angle = angle_steps;
			} else {
				angle = Math.ceil(angle_steps / 2);
			}

			for (var i = 0; i < siblings.length; i++) {
				this.moveNode(siblings[i], Math.ceil((window.innerHeight / 3 * level_fac * Math.cos(angle) + x)), Math.ceil((window.innerHeight / 3 * level_fac * Math.sin(angle) + y)));
				angle = angle_steps + angle;
			}

		}

		//paint actual vertex and create its edge
		this.paintNode(myVertex, Math.ceil((window.innerHeight / 3 * level_fac * Math.cos(angle) + x)), Math.ceil((window.innerHeight / 3 * level_fac * Math.sin(angle) + y)));
		this.createEdge(myVertex);
	},

	paintNode : function(myNode, x, y) {
		var level_fac = (Math.pow(0.7, (myNode.level - CUR_LEVEL)));
		var size = window.innerHeight / 16 * level_fac;
		var fontsize = 20 * level_fac;

		paper.setStart();
		var circle1 = paper.circle(x, y, 0);

		circle1.attr({
			"fill" : "#CCCCCC",

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

		//Compress all vertex components to one set
		myNode.svg = set3;

		//Event handler for mouse over
		var over = function(event) {

			UI.showTooltip(myNode.title, myNode.intro, event);
			set3.animate({
				transform : "s1.1"
			}, 2000, "elastic");

			//Event handler for mousewheel
			mouse = function(e) {
				//Remove the event listener, since we want to fire this only once
				if (document.addEventListener) {
					document.removeEventListener('mousewheel', mouse, false);
					document.removeEventListener("DOMMouseScroll", mouse, false);
				} else {
					document.removeEvent("onmousewheel", mouse);
				}
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				if (delta > 0) {
					UI.zoomIn(myNode);
				}
				/* Mousewheel DOWN*/
				else {
					console.log('zooming out');
				}

			};
			//Event handler - end

			//Add event handler for mousewheel
			if (document.addEventListener) {
				//Chrome, Firefox, IE9
				document.addEventListener('mousewheel', mouse, false);
				document.addEventListener("DOMMouseScroll", mouse, false);
			} else {
				//IE 6,7,8
				document.attachEvent("onmousewheel", mouse);
			}

		};
		//Event handler for mouse over - end

		//Event handler for mouse out
		var out = function(event) {
			UI.hideTooltip();
			//Remove event listener, since there is no selected vertex yet
			if (document.addEventListener) {
				document.removeEventListener('mousewheel', mouse, false);
				document.removeEventListener("DOMMouseScroll", mouse, false);
			} else {
				document.removeEvent("onmousewheel", mouse);
			}
			//Shrink the vertex back
			set3.animate({
				transform : "s1"
			}, 2000, "elastic");
			Tips4 = null;
		};
		//Event handler for mouse out - end

		//Event hanbler for click on vertex
		var click = function(event) {
			window.open(myNode.link);
		};

		//Set events to the above defined event handler
		set3.mouseover(over);
		set3.mouseout(out);
		set3.click(click);

		return myNode;
	},

	formatIntro : function(intro, lineLength, maxChars) {
		var currentPos = 0;
		var lastSpacePos = 0;
		for ( currentPos = 0; currentPos < maxChars; currentPos++) {
			if (intro.charAt(currentPos) == ' ')
				lastSpacePos = currentPos;
			if (currentPos % lineLength == 0) {
				intro = intro.slice(0, lastSpacePos) + '\n' + intro.slice(lastSpacePos, intro.length);
			}
		}
		intro = intro.slice(0, lastSpacePos) + '...';
		return intro;
	},

	createTooltip : function() {
		var content = {
			'font-family' : 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif',
			'font-size' : '12px',
			'margin' : '0px 20px',
			'padding' : '10px',
			'background' : '#DFE1F0',

			'-webkit-radius' : '3px',
			'-moz-radius' : '3px',
			'border-radius' : '3px',
		};
		var heading = {

			'font-family' : 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif',
			'font-size' : '15px',
			'margin' : '0px 20px 10px',
			'padding' : '5px',
			'background' : '#DFE1F0',

			'-webkit-radius' : '3px',
			'-moz-radius' : '3px',
			'border-radius' : '3px',
		};
		var tooltip = {
			'position' : 'absolute',
			'display' : 'none',
			'padding' : '3px',
			'z-index' : '1000',

			'max-width' : '400px',
			'-webkit-radius' : '3px',
			'-moz-radius' : '3px',
		}

		var tip = new Element('div', {
			id : 'tip',
		}).setStyles(tooltip);
		tip.adopt(new Element('div', {
			id : 'tip-head',
		}).setStyles(heading));
		tip.adopt(new Element('div', {
			id : 'tip-tail',
		}).setStyles(content));
		$(document.body).adopt(tip)
	},

	hideTooltip : function() {
		var tip = document.id('tip');
		tip.hide();
	},

	showTooltip : function(myHeading, myContent, event) {
		var tip = document.id('tip');
		tip.setStyle("left", event.clientX + 20).setStyle("top", event.clientY + 20);
		tip.show();
		this.setTooltipHeading(myHeading);
		if (myContent.length > 300) {
			myContent = myContent.substring(0, 300) + " ...";
		}
		this.setTooltipContent(myContent);
	},

	setTooltipHeading : function(myHeading) {
		var heading = document.id('tip-head');
		heading.set('text', myHeading);
	},

	setTooltipContent : function(myContent) {
		var content = document.id('tip-tail');
		content.set('text', myContent);
	},
});
