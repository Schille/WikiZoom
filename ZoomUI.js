/**
 * @author Robert Stein, Michael Schilonka, Max Quellmalz
 */
var ZoomUI = new Class({
	/**
	 * @constructor Initializing the ZoomUI
	 */
	initialize : function() {
		this.paintVector = new Array();
		this.currentVertex = null;
		this.zoompending = false;
		this.createTooltip();
		paper_width = (window.innerWidth - window.innerWidth / 100);
		// width of raphael paper
		paper_height = (window.innerHeight - window.innerHeight / 10);
		// height of raphael paper
		paper = Raphael(0, 0, paper_width, paper_height);
		paper.renderfix();
		this.background = paper.image('dependencies/room1.jpg',0, 0, paper_width, paper_height).toBack();
		// In order to solve some rendering bugs. For more information
		// take a look at raphael's doc.
		this.velocity = 50;
		// time in ms between paintVertices function calls
		this.intervalOn = null;
		// flag to determine if interval function calls should be
		// executed (of paintVertices)
		this.interval = null;
		// interval function call reference

		// scroll out timout
		this.mouseoutTimeout = 500;
		// add zoom out handler
		if (document.addEventListener) {
			document.addEventListener('mousewheel', mousescrollout, false);
			document.addEventListener("DOMMouseScroll", mousescrollout, false);
		} else {
			document.addEvent("onmousewheel", mousescrollout);
		}

	},

	/**
	 * Determines whether paintVertices() is called or not + at which
	 * speed.
	 *
	 * @param{Boolean} myFlag
	 */

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

	/**
	 * Creates edge from child to parent node.
	 *
	 * @param{Vertex} vertexChild
	 */

	createEdge : function(vertexChild) {

		var xP = vertexChild.parent.svg.x;
		var yP = vertexChild.parent.svg.y;
		var xC = vertexChild.svg.x;
		var yC = vertexChild.svg.y;
		var startColor = vertexChild.parent.svg[0].attr("fill");
		var endColor = vertexChild.svg[0].attr("fill");
		var colorAngle = Math.ceil(Raphael.angle(xP, yP, xC, yC));

		// Detect quadrant which edge aims to.

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

		}, 100, ">").toBack();

		// Append svg of edge to its vertex (child).
		vertexChild.path = path;
		this.background.toBack();
	},

	/**
	 * Used to calculate color for fading effect.
	 *
	 * @param{#RGB} rgb color code
	 * @param{Number} percentage of fading
	 * @return{#RGB} new rgb color code
	 */

	shadeColor : function(color, percent) {
		var num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 0x00FF) + amt, G = (num & 0x0000FF) + amt;
		return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
	},

	/**
	 * Updates rendering of the graph on zoomOut event
	 */
	zoomOut : function() {
		if (UI.zoompending == true || this.currentVertex.parent == null)
			return;

		UI.zoompending = true;
		setTimeout(function() {
			UI.zoompending = false;
		}, 5000);
		
		var vertex = this.currentVertex;
		this.currentVertex = vertex.parent;

		Core.zoomed(vertex.parent);
	},

	zoomIn : function(vertex) {
		if (UI.zoompending == true)
			return;
		
		UI.zoompending = true;
		setTimeout(function() {
			UI.zoompending = false;
		}, 5000);

		this.currentVertex = vertex;
		
		
		var tmp = vertex.level - CUR_LEVEL;
		var oneparent = vertex;
		for (var i = 0; i < tmp; i++) {
			this.repaintNode(oneparent);
			this.fadeOutSiblings(oneparent, false);
			oneparent.path.remove();
			var oneparent = oneparent.parent;
		}

	Core.zoomed(vertex);		

		// Factor to calculate distance between father and child node
		// and color fading.
		var level_fac = (Math.pow(0.7, (vertex.level - CUR_LEVEL + 1)));

		// Relocate zoomed on svg to middle of paper.
		vertex.svg.animate({
			"cx" : paper_width / 2,
			"cy" : paper_height / 2,
			"x" : paper_width / 2,
			"y" : paper_height / 2,
		}, 200);
		vertex.svg.attr({
			"cx" : paper_width / 2,
			"cy" : paper_height / 2,
			"x" : paper_width / 2,
			"y" : paper_height / 2,
		});

		vertex.svg.x = paper_width / 2;
		vertex.svg.y = paper_height / 2;

		vertex.path.remove();

		
		this.fadeOutSiblings(vertex,false);
		this.repaintNode(vertex);

		

		var child_count = vertex.children.length;

		if (child_count > 0) {

			// calculate the new angles for all sibling vertices
			var angle_steps = Math.PI * 2 / (child_count);

			if (vertex.level - CUR_LEVEL <= 1) {
				if ((vertex.level - CUR_LEVEL + 1) % 2 == 0) {
					angle = angle_steps;
				} else {
					angle = Math.ceil(angle_steps / 2);
				}
			} else {
				angle = Math.atan2(vertex.parent.parent.svg.y - vertex.parent.svg.y, vertex.parent.parent.svg.x - vertex.parent.svg.x);
				if (angle < 0)
					angle = angle + Math.PI * 2;
				//console.log("angle between " + vertex.parent.parent.title + " and " + vertex.parent.title + "is" + angle);
				angle = angle + 16 / 18 * 2 * Math.PI;

			}

			// Update all child- and following nodes.
			if (child_count >= 1) {
				console.log("I'm on");
				for (var i = 0; i < child_count; i++) {
					console.log("I'm in ya");
					if (vertex.children[i].svg != undefined) {
						this.moveNode(vertex.children[i], Math.ceil((window.innerHeight / 1.5 * (Math.pow(0.45, (vertex.level - CUR_LEVEL + 1))) * Math.cos(angle) + vertex.svg.x)), Math.ceil((window.innerHeight / 1.5 * (Math.pow(0.45, (vertex.level - CUR_LEVEL + 1))) * Math.sin(angle) + vertex.svg.y)));
						angle = angle_steps + angle;
						this.repaintChildren(vertex.children[i]);
					}
				}
			}

		}
	},

	/**
	 * Recursively calls repaint node to update style of every node.
	 */

	repaintChildren : function(vertex) {

		this.repaintNode(vertex);

		if (vertex.children.length > 0) {
			for (var i = 0; i < vertex.children.length; i++) {
				this.repaintChildren(vertex.children[i]);
			}
		}
	},

	/**
	 * Updates style of nodes.
	 *
	 * @param{Vertex} vertex
	 */

	repaintNode : function(vertex) {
		console.error('detected ' + vertex.title);
		// Factor to calculate distance between father and child node
		// and color fading.
		var level_fac = (Math.pow(0.7, (vertex.level - CUR_LEVEL)));
		var size = window.innerHeight / 16 * level_fac;
		var fontsize = 20 * level_fac;
		var temp_scope = this;

		if (vertex.svg != undefined)

			// Adapt every element in set of vertex.svg
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

	/**
	 * Fades out given sibilings of
	 *
	 * @param{Vertex} vertex.
	 */

	fadeOutSiblings : function(vertex, myFlag) {
		console.debug(vertex.parent.children);
		var siblings = vertex.parent.children;
		var parent = vertex.parent;
		var temp_scope = this;
		if (myFlag == false) {
			siblings.forEach(function(temp_vertex) {
				if (temp_vertex.title != vertex.title) {
					temp_vertex.svg.animate({
						opacity : 0,
					}, 500, "linear");
					temp_vertex.path.remove();
					temp_vertex.svg.remove();
					temp_scope.fadeOutChildren(temp_vertex);
				}
			});
		} else {
			siblings.forEach(function(temp_vertex) {
				temp_vertex.svg.animate({
					opacity : 0,
				}, 500, "linear");
				temp_vertex.path.remove();
				temp_vertex.svg.remove();
				temp_vertex.svg = null;
				temp_vertex.path = null;
				temp_scope.fadeOutChildren(temp_vertex);
			});
		}

		parent.svg.animate({
			opacity : 0
		}, 500, "linear");

	},

	/**
	 * Fades out children of given
	 *
	 * @param{Vertex} vertex,
	 */

	fadeOutChildren : function(vertex) {
		var temp_scope = this;

		vertex.children.forEach(function(temp_vertex) {
			if (temp_vertex.svg != null) {
				temp_vertex.svg.animate({
					opacity : 0,
				}, 100);
				temp_vertex.path.remove();
				temp_vertex.svg.remove();
				temp_vertex.svg = null;
				temp_vertex.path = null;
				if (temp_vertex.level < (CUR_LEVEL+Core.prefetch)) {
					temp_scope.fadeOutChildren(temp_vertex);
				}
			}
		});
	},

	/**
	 * Moves
	 *
	 * @param{Vertex} myNode's svg and path to parent to the given
	 * @param{Number} mx,my. Works recursively, moves children of
	 *                children . . .
	 */
	moveNode : function(myNode, mx, my) {
		var gnupsi1 = myNode.svg;
		var nodePath = myNode.path;
		var xP = myNode.parent.svg.x;
		var yP = myNode.parent.svg.y;

		var startColor = myNode.parent.svg[0].attr("fill");
		console.log(myNode.title);

		// Factor to calculate distance between father and child node
		// and color fading.

		var level_fac = (Math.pow(0.7, (myNode.level - CUR_LEVEL)));
		myNode.svg.x = mx;
		myNode.svg.y = my;
		gnupsi1.forEach(function(element) {
			if (element.attr("text") != undefined) {
				var move1 = element.animate({
					"x" : mx,
					"y" : my
				}, 500);
			} else {
				element.animate({
					"cx" : mx,
					"cy" : my
				}, 500);
			}

		});

		// This is trying to fix the positioning bug of raphael.js
		// It seems that the coordinates of objects aren't always
		// updated after animations.
		myNode.svg.attr({
			"cx" : (mx),
			"cy" : (my),
			"x" : (mx),
			"y" : (my)
		});

		// Check which quadrant path (is an triangle) shows to.
		// Depending on which direction paint path with given
		// paramters..

		if (xP <= mx && yP < my) {
			nodePath.animate({
				path : "M" + (xP - 10) + "," + yP + " L" + mx + "," + my + " L" + xP + "," + (yP - 10),
				fill : startColor,
			}, 500).toBack();

		}
		if (xP >= mx && yP <= my) {
			nodePath.animate({
				path : "M" + xP + "," + (yP - 10) + " L" + mx + "," + my + " L" + (xP + 10) + "," + yP,
				fill : startColor,
			}, 500).toBack();

		}
		if (xP >= mx && yP > my) {
			nodePath.animate({
				path : "M" + xP + "," + (yP + 10) + " L" + mx + "," + my + " L" + (xP + 10) + "," + yP,
				fill : startColor,
			}, 500).toBack();

		}
		if (xP <= mx && yP >= my) {
			nodePath.animate({
				path : "M" + (xP - 10) + "," + yP + " L" + mx + "," + my + " L" + xP + "," + (yP + 10),
				fill : startColor,
			}, 500).toBack();

		}
		
		this.background.toBack();

		// collect all already painted children of myVertex

		var children = new Array();
		for (var i = 0; i < myNode.children.length; i++) {
			if (myNode.children[i].svg != null)
				children.push(myNode.children[i]);
		}

		if (children.length > 0) {

			// calculate the new angles for all sibling vertices
			var angle_steps = Math.PI * 2 / (children.length);

			if (myNode.level <= 1) {
				if ((myNode.level - CUR_LEVEL + 1) % 2 == 0) {
					angle = angle_steps;
				} else {
					angle = Math.ceil(angle_steps / 2);
				}
			} else {
				angle = Math.atan2(myNode.parent.svg.y - myNode.svg.y, myNode.parent.svg.x - myNode.svg.x);
				if (angle < 0)
					angle = angle + Math.PI * 2;
				console.log("angle between " + myNode.parent.parent.title + " and " + myNode.parent.title + "is" + angle);
				angle = angle + 16 / 18 * 2 * Math.PI;

			}

			for (var j = 0; j < children.length; j++) {
				if (children[j].svg != undefined) {
					this.moveNode(children[j], Math.ceil((window.innerHeight / 1.5 * (Math.pow(0.45, (myNode.level - CUR_LEVEL + 1))) * Math.cos(angle)) + mx), Math.ceil((window.innerHeight / 1.5 * (Math.pow(0.45, (myNode.level - CUR_LEVEL + 1))) * Math.sin(angle)) + my));
					angle = angle_steps + angle;
				}
			}
		}

	},

	/**
	 * Called by ZoomCore in order to paint the fetched vertices. If
	 * input
	 *
	 * @param {Vertex}
	 *            is not the initial one it is pushed into the
	 *            paintVector.
	 */

	paint : function(myVertex) {

		if (myVertex.level == CUR_LEVEL) {
			this.paintNode(myVertex, paper_width / 2, paper_height / 2);
			return;
		}

		UI.paintVector.push(myVertex);

		UI.zoompending = true;
		setTimeout(function() {
			UI.zoompending = false;
		}, 4000);

	},

	/**
	 * Empties the paintVector in order to paint all vertices.
	 */

	paintVertices : function() {
		console.info("Running paint job.")

		// Look if there are unpainted elements in paintVector which
		// parent is painted.
		// If there are, paint.

		for (var i = 0; i < UI.paintVector.length; i++) {
			if (UI.paintVector[i].parent.svg == null) {
				console.error('Parent was not painted yet, ' + UI.paintVector[i].parent.title);
			} else {

				vertex = UI.paintVector[i];

				if (vertex.svg == null) {
					UI.paintChildVertex(vertex);
					UI.paintVector.splice(i, 1)
				} else {
					UI.repaintNode(vertex);
					UI.paintVector.splice(i, 1)

				}
				//To control with which probability more then one element is painted.
				if (Math.random() < 0.8)
					break;
			}
		}

		// Stop paintVertices() iteration if there is no element left to
		// paint.

		if (UI.paintVector.length == 0) {
			UI.setPaintJob(false);
		}

	},

	/**
	 * Attaches
	 *
	 * @param{Vertex} myVertex as child node to its father, recursively.
	 *                Calls moveNode to relocate its sibling nodes.
	 */

	paintChildVertex : function(myVertex) {

		var parent = myVertex.parent;
		var x = myVertex.parent.svg.x;
		var y = myVertex.parent.svg.y;
		console.info('Painting ' + myVertex.title + 'to x:' + x + ' y:' + y);

		// Factor to calculate distance between father and child node
		// and color fading.
		var level_fac = (Math.pow(0.7, (myVertex.level - CUR_LEVEL)));

		// collect all already painted siblings of myVertex
		var siblings = new Array()
		for (var i = 0; i < myVertex.parent.children.length; i++) {
			if (myVertex.parent.children[i].svg != null)
				siblings.push(myVertex.parent.children[i]);
		}

		console.info(myVertex.title + ' : ' + siblings.length);

		var angle = 0;
		// eventually move siblings
		if (siblings.length > 0) {

			// calculate the new angles for all sibling vertices
			var angle_steps = Math.PI * 2 / (siblings.length + 1);

			if (myVertex.level <= 1) {
				if ((myVertex.level - CUR_LEVEL + 1) % 2 == 0) {
					angle = angle_steps;
				} else {
					angle = Math.ceil(angle_steps / 2);
				}
			} else {
				angle = Math.atan2(myVertex.parent.parent.svg.y - myVertex.parent.svg.y, myVertex.parent.parent.svg.x - myVertex.parent.svg.x);
				if (angle < 0)
					angle = angle + Math.PI * 2;
				//console.log("angle between " + myVertex.parent.parent.title + " and " + myVertex.parent.title + "is" + angle);
				angle = angle + 16 / 18 * 2 * Math.PI;

			}

			for (var i = 0; i < siblings.length; i++) {
				if (siblings[i].svg != null) {
					this.moveNode(siblings[i], Math.ceil((window.innerHeight / 1.5 * (Math.pow(0.45, (myVertex.level - CUR_LEVEL))) * Math.cos(angle) + x)), Math.ceil((window.innerHeight / 1.5 * (Math.pow(0.45, (myVertex.level - CUR_LEVEL))) * Math.sin(angle) + y)));
					angle = angle_steps + angle;
				}
			}

		}

		// paint actual vertex and create its edge
		this.paintNode(myVertex, Math.ceil((window.innerHeight / 1.5 * (Math.pow(0.45, (myVertex.level - CUR_LEVEL))) * Math.cos(angle) + x)), Math.ceil((window.innerHeight / 1.5 * (Math.pow(0.45, (myVertex.level - CUR_LEVEL))) * Math.sin(angle) + y)));
		this.createEdge(myVertex);
	},

	/**
	 * Creates the actual svg-elements with its style specification and
	 * synthesizes them to a set.
	 *
	 * @param{Vertex} myNode
	 * @param{number} x,y
	 */

	paintNode : function(myNode, x, y) {
		// Factor to calculate distance between father and child node
		// and color fading.
		var level_fac = (Math.pow(0.7, (myNode.level - CUR_LEVEL)));
		var size = window.innerHeight / 16 * level_fac;
		var fontsize = 20 * level_fac;

		paper.setStart();
		var circle1 = paper.circle(x, y, size);

		circle1.attr({
			"fill" : "#CCCCCC",

			"stroke" : '#AAAAAA',
			"stroke-width" : 2,
		});
		var circle11 = paper.circle(x, y, size - 4);
		circle11.attr({
			"stroke" : '#AAAAAA',
			"stroke-dasharray" : "- ",
			"stroke-width" : 2,
			"stroke-linecap" : "round",
		});

		var text1 = paper.text(x, y, myNode.title).toFront();

		text1.attr({
			"font-size" : fontsize,
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

		// var an1 = circle1.animate({
			// "r" : size
		// }, 2000);
		// circle11.animateWith(circle1, an1, {
			// "r" : (size - 4)
		// }, 2000);
		// text1.animateWith(circle1, an1, {
			// "font-size" : fontsize
		// }, 2000);

		set3.x = x;
		set3.y = y;
		// Attach svg-set to {Vertex}
		myNode.svg = set3;

		// Event handler for mouse over
		var over = function(event) {

			UI.showTooltip(myNode.title, myNode.intro, event);
			set3.animate({
				transform : "s1.1"
			}, 2000);

			// Event handler for mousewheel
			mouse = function(e) {
				if (UI.zoompending == true)
					return;
				// Remove the event listener, since we want to fire this
				// only once
				if (document.addEventListener) {
					document.removeEventListener('mousewheel', mouse, false);
					document.removeEventListener("DOMMouseScroll", mouse, false);
				} else {
					document.removeEvent("onmousewheel", mouse);
				}
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				if (delta > 0) {
					console.debug('Zoom on ' + myNode.title);
					UI.zoomIn(myNode);
				}

			};
			// Event handler - end

			// Add event handler for mousewheel
			if (document.addEventListener) {
				// Chrome, Firefox, IE9
				document.addEventListener('mousewheel', mouse, false);
				document.addEventListener("DOMMouseScroll", mouse, false);
			} else {
				// IE 6,7,8
				document.attachEvent("onmousewheel", mouse);
			}

		};
		// Event handler for mouse over - end

		// Event handler for mouse out
		var out = function(event) {
			UI.hideTooltip();
			// Remove event listener, since there is no selected vertex
			// yet
			if (document.addEventListener) {
				document.removeEventListener('mousewheel', mouse, false);
				document.removeEventListener("DOMMouseScroll", mouse, false);
			} else {
				document.removeEvent("onmousewheel", mouse);
			}
			// Shrink the vertex back
			set3.animate({
				transform : "s1"
			}, 100);
			Tips4 = null;
		};
		// Event handler for mouse out - end

		// Event hanbler for click on vertex
		var click = function(event) {
			window.open(myNode.link);
		};

		// Set events to the above defined event handler
		set3.mouseover(over);
		set3.mouseout(out);
		set3.click(click);

	},

	/**
	 * Create and attach css for tooltips.
	 */

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

	/**
	 * Hides tooltip when called.
	 */

	hideTooltip : function() {
		var tip = document.id('tip');
		tip.hide();
	},

	/**
	 * Displays tooltip depending on mouseposition.
	 *
	 * @param {String}
	 *            myHeading
	 * @param {String}
	 *            myContent
	 * @param {Event}
	 *            event - mouseover event
	 */

	showTooltip : function(myHeading, myContent, event) {
		var tip = document.id('tip');
		tip.setStyle("left", event.clientX + 20).setStyle("top", event.clientY + 20);
		tip.show();
		this.setTooltipHeading(myHeading);

		// Cut text of tooltip at 300st character.
		if (myContent.length > 300) {
			myContent = myContent.substring(0, 300) + " ...";
		}
		this.setTooltipContent(myContent);
	},

	/**
	 * Fills tip-head div with content of myHeading.
	 *
	 * @param {String}
	 *            myHeading
	 */

	setTooltipHeading : function(myHeading) {
		var heading = document.id('tip-head');
		heading.set('text', myHeading);
	},

	/**
	 * Fills tip-tail div with content of myContent.
	 *
	 * @param {String}
	 *            myContent
	 */

	setTooltipContent : function(myContent) {
		var content = document.id('tip-tail');
		content.set('text', myContent);
	},
});

mousescrollout = function(e) {
	if (document.addEventListener) {
		document.removeEventListener('mousewheel', mousescrollout, false);
		document.removeEventListener("DOMMouseScroll", mousescrollout, false);
	} else {
		document.removeEvent("onmousewheel", mousescrollout);
	}
	setTimeout(function() {
		if (document.addEventListener) {
			document.addEventListener('mousewheel', mousescrollout, false);
			document.addEventListener("DOMMouseScroll", mousescrollout, false);
		} else {
			document.addEvent("onmousewheel", mousescrollout);
		}
	}, UI.mouseoutTimeout);
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	if (delta < 0) {
		console.log("zooming out");
		UI.zoomOut();
	}

};