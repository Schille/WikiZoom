var ZoomUI = new Class({
	initialize : function() {
		this.paintStack = new Array();
		paper_width = (window.innerWidth - window.innerWidth / 10);
		paper_height = (window.innerHeight - window.innerHeight / 10);
		paper = Raphael(0, 0, paper_width, paper_height);
		paths = paper.set();
		selectedNode = null;
		this.velocity = 200;
		this.IntervalOn = null;
		this.Interval = null;
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
	if(this.intervalOn == myFlag)
		return;	
	if(myFlag == true)
		this.Interval = setInterval(this.paintVertices, this.velocity);
		this.IntervalOn = true;
	else
		clearInterval(this.Interval);
		this.IntervalOn = false;
	},

	createEdge : function(vertexChild) {

		var xP = this.getParentX(vertexChild);
		var yP = this.getParentY(vertexChild);
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
		CUR_LEVEL++;
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
		var angle = angle_steps;

		if (child_count >= 1) {
			console.log("I'm on");
			for (var i = 0; i < child_count; i++) {
				console.log("I'm in ya");
				this.moveNode(vertex.children[i], Math.ceil((200 * level_fac * Math.cos(angle) + vertex.svg[0].attr('cx'))), Math.ceil((200 * level_fac * Math.sin(angle) + vertex.svg[0].attr('cy'))));
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
		var size = 50 * level_fac;
		var fontsize = 20 * level_fac;
		var temp_scope = this;

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
			temp_vertex.svg.animate({
				opacity : 0,
			}, 500, "linear");
			temp_vertex.path.remove();
			if (temp_vertex.children.length > 0) {
				temp_scope.fadeOutChildren(temp_vertex);
			}
		});
	},

	moveNode : function(myNode, mx, my) {
		var gnupsi1 = myNode.svg;
		var nodePath = myNode.path;
		var xP = this.getParentX(myNode);
		var yP = this.getParentY(myNode);

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
			var angle = angle_steps;
			for (var j = 0; j < children.length; j++) {
				this.moveNode(children[j], Math.ceil((200 * level_fac * Math.cos(angle)) + mx), Math.ceil((200 * level_fac * Math.sin(angle)) + my));
				angle = angle_steps + angle;
			}
		}

	},

	paint : function(myVertex) {

		if (myVertex.level == 0) {
			this.paintNode(myVertex, paper_width / 2, paper_height / 2);
			return;
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

	},

	paintChildVertex : function(myVertex) {
		var parent = myVertex.parent;
		var x = this.getParentX(myVertex);
		var y = this.getParentY(myVertex);
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
			angle = angle_steps;

			for (var i = 0; i < siblings.length; i++) {
				this.moveNode(siblings[i], Math.ceil((300 * level_fac * Math.cos(angle) + x)), Math.ceil((300 * level_fac * Math.sin(angle) + y)));
				angle = angle_steps + angle;
			}

		}

		//paint actual vertex and create its edge
		this.paintNode(myVertex, Math.ceil((300 * level_fac * Math.cos(angle) + x)), Math.ceil((300 * level_fac * Math.sin(angle) + y)));
		this.createEdge(myVertex);
	},

	paintNode : function(myNode, x, y) {
		var level_fac = (Math.pow(0.7, (myNode.level - CUR_LEVEL)));
		var size = 50 * level_fac;
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

		myNode.svg = set3;

		var intro = "Albert Einstein (* 14. März 1879 in Ulm; † 18. April 1955 in Princeton, New Jersey) war ein theoretischer Physiker. Seine Forschungen zur Struktur von Materie, Raum und Zeit sowie dem Wesen der Gravitation veränderten maßgeblich das physikalische Weltbild. Er gilt daher als einer der größten Physiker aller Zeiten.Einsteins Hauptwerk, die Relativitätstheorie, machte ihn weltberühmt. Im Jahr 1905 erschien seine Arbeit mit dem Titel Zur Elektrodynamik bewegter Körper, deren Inhalt heute als spezielle Relativitätstheorie bezeichnet wird. 1915 publizierte Einstein die allgemeine Relativitätstheorie. Auch zur Quantenphysik leistete er wesentliche Beiträge: Für seine Erklärung des photoelektrischen Effekts, die er ebenfalls 1905 publiziert hatte, wurde ihm im November 1922 der Nobelpreis für Physik für 1921 verliehen. Seine theoretischen Arbeiten spielten – im Gegensatz zur verbreiteten Meinung – beim Bau der Atombombe und der Entwicklung der Kernenergie nur eine indirekte Rolle.Albert Einstein gilt als Inbegriff des Forschers und Genies. Er nutzte seine außerordentliche Bekanntheit auch außerhalb der naturwissenschaftlichen Fachwelt bei seinem Einsatz für Völkerverständigung und Frieden. In diesem Zusammenhang verstand er sich selbst als Pazifist, Sozialist, und Zionist.Im Laufe seines Lebens war Einstein Staatsbürger mehrerer Länder: Durch Geburt besaß er die württembergische Staatsbürgerschaft. Von 1896 bis 1901 staatenlos, danach Staatsbürger der Schweiz, war er 1911/12 auch Bürger Österreich-Ungarns. Seit 1914 Mitglied der Akademie der Wissenschaften und Bürger Preußens, war er somit erneut Staatsangehöriger im Deutschen Reich. Mit der Machtergreifung Hitlers gab er 1933 den deutschen Pass endgültig ab. Zum seit 1901 geltenden Schweizer Bürgerrecht trat ab 1940 noch die US-Staatsbürgerschaft.";
		var lineLength = 80;
		var maxChars = 500;
		var boxWidth = 500;
		var boxHeight = 17 * (maxChars / lineLength + 1);

		var toolTip = paper.rect(0, 0, boxWidth, boxHeight, 5).hide();
		toolTip.attr({
			fill : 'white'
		});

		var textTip = paper.text(0, 0, myNode.intro).hide();
		textTip.attr('text-anchor', 'start');
		textTip.attr('font-size', 12);

		var over = function(event) {
			//zoomUI.selectedNode = myNode;
			set3.animate({
				transform : "s1.1"
			}, 2000, "elastic");
			var xPos = set3[0].attr('cx') + set3[0].attr('r') - 20 * level_fac;
			var yPos = set3[0].attr('cy') + set3[0].attr('r') - 20 * level_fac;
			if (xPos > paper_width / 2)
				xPos = set3[0].attr('cx') - set3[0].attr('r') + 20 * level_fac - boxWidth;
			if (yPos > paper_height / 2)
				yPos = set3[0].attr('cy') - set3[0].attr('r') + 20 * level_fac - boxHeight;
			toolTip.attr({
				x : xPos,
				y : yPos
			});
			toolTip.toFront();
			toolTip.show();
			textTip.attr({
				x : xPos,
				y : yPos
			});
			textTip.toFront();
			textTip.show();

			//Event handler for mouswheel
			mouse = function() {
				if (event.preventDefault)
					event.preventDefault();
				event.returnValue = false;
				UI.zoomIn(myNode)
				document.removeEventListener('mousewheel', mouse, false);
			};
			console.log("adding event")
			document.addEventListener('mousewheel', mouse, false);
		};

		var out = function(event) {
			//zoomUI.selectedNode = null;
			document.removeEventListener('mousewheel', mouse, false);
			set3.animate({
				transform : "s1"
			}, 2000, "elastic");
			toolTip.hide();
			textTip.hide();
		};

		set3.mouseover(over);
		set3.mouseout(out);

		var click = function(event) {
			window.open(myNode.link);
		};
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
});
