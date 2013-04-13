function testZoomCore_iterateChildren(){
	Core = new ZoomCore('Albert Einstein');
	
	vertex1 = new Vertex()
	vertex1.id = 0;
	vertex1.level = 0;
	vertex1.title = "Albert Einstein";
	vertex1.outlinks.push("Ulm");
	vertex1.outlinks.push("New Jersey");
	vertex1.outlinks.push("Materie");
	vertex1.outlinks.push("Zeit");
	vertex1.outlinks.push("Gravitation");
	vertex1.outlinks.push("Relativitätstheorie");
	vertex1.outlinks.push("spezielle Relativitätstheorie");
		
	Core.iterateChildren(vertex1, 5);
}


function testZoomCore_updated(){
	Core = new ZoomCore('Mannheim');
	
	vertex1 = new Vertex()
	vertex1.id = 0;
	vertex1.level = 0;
	vertex1.title = 'Mannheim';
	vertex1.link = 'http://de.wikipedia.de/wiki/Mannheim'
	vertex1.outlinks.push('Baden-Württemberg');
	vertex1.outlinks.push('Quadratestadt');
	vertex1.outlinks.push('Mannheim Hauptbahnhof');
	vertex1.outlinks.push('Werner von Siemens');
	vertex1.outlinks.push('Hafen Mannheim');
	vertex1.outlinks.push('Kunsthalle Mannheim');
	vertex1.outlinks.push('Bertha Benz Memorial Route');
		
	Core.updated(vertex1);
}

function testZoomCore_initialize(){
	Core = new ZoomCore('Volkswagen');
}

function testZoomCore_zoomed(){
	vertex1 = initialVertex.children[0];
	Core.zoomed(vertex1);
}

function testZoomCore_zoomed1(){
	vertex1 = initialVertex.children[0].children[0];
	Core.zoomed(vertex1);
}

function testWikiZoom_integration(){
	UI = new ZoomUI();
	Core = new ZoomCore('Erfurt');

}

function testFetch(test){
	vertex = new Vertex();
	vertex.title = test;
	Fetcher = new WikiFetcher();
	Fetcher.fetch(vertex);
}

 function testZoomUI() {
		UI = new ZoomUI();
		var vertex_mom = new Vertex();
		vertex_mom.title = "Chaostheorie";
		vertex_mom.intro = "introtext";
		vertex_mom.level = 0;
		vertex_mom.link = "https://de.wikipedia.org/wiki/Chaosforschung";
		UI.paint(vertex_mom);
		
		

		vertex_child1 = new Vertex();
		vertex_child1.title = "Shits";
		vertex_child1.intro = "introtext";
		vertex_child1.level = 1;
		vertex_child1.link = "https://de.wikipedia.org/wiki/Chaosforschung";
		vertex_child1.parent = vertex_mom;
		vertex_mom.children.push(vertex_child1);
		
		UI.paint(vertex_child1);
		//moveNode(vertex_child1, 200, 200);

		vertex_child2 = new Vertex();
		vertex_child2.title = "Hass";
		vertex_child2.intro = "introtext";
		vertex_child2.level = 1;
		vertex_child2.link = "https://de.wikipedia.org/wiki/Chaosforschung";
		vertex_child2.parent = vertex_mom;
		vertex_mom.children.push(vertex_child2);
		UI.paint(vertex_child2);

		var vertex_child3 = new Vertex();
		vertex_child3.title = "Liebe";
		vertex_child3.intro = "introtext";
		vertex_child3.level = 1;
		vertex_child3.link = "https://de.wikipedia.org/wiki/Chaosforschung";
		vertex_child3.parent = vertex_mom;
		vertex_mom.children.push(vertex_child3);
		UI.paint(vertex_child3);

		var vertex_child4 = new Vertex();
		vertex_child4.title = "Ahh";
		vertex_child4.intro = "introtext";
		vertex_child4.level = 1;
		vertex_child4.link = "https://de.wikipedia.org/wiki/Chaosforschung";
		vertex_child4.parent = vertex_mom;
		vertex_mom.children.push(vertex_child4);
		UI.paint(vertex_child4);

		var vertex_child5 = new Vertex();
		vertex_child5.title = "Mies";
		vertex_child5.intro = "introtext";
		vertex_child5.level = 1;
		vertex_child5.link = "https://de.wikipedia.org/wiki/Chaosforschung";
		vertex_child5.parent = vertex_mom;
		vertex_mom.children.push(vertex_child5);
		UI.paint(vertex_child5);

		vertex_child11 = new Vertex();
		vertex_child11.title = "Poop";
		vertex_child11.intro = "introtext";
		vertex_child11.level = 2;
		vertex_child11.link = "https://de.wikipedia.org/wiki/Chaosforschung";
		vertex_child11.parent = vertex_child1;
		vertex_child1.children.push(vertex_child11);
		UI.paint(vertex_child11);

		vertex_child111 = new Vertex();
		vertex_child111.title = "Poope die 2.";
		vertex_child111.intro = "introtext";
		vertex_child111.level = 3;
		vertex_child111.link = "https://de.wikipedia.org/wiki/Chaosforschung";
		vertex_child111.parent = vertex_child11;
		vertex_child11.children.push(vertex_child111);
		UI.paint(vertex_child111);

		var rect = paper.rect(0, 0, 50, 50);
		rect.attr({
			fill : 'black'
		});

		rect.click(function() {
			var vertex_child6 = new Vertex();
			vertex_child6.title = "New Stuff";
			vertex_child6.intro = "introtext";
			vertex_child6.level = 2;
			vertex_child6.link = "https://de.wikipedia.org/wiki/Chaosforschung";
			vertex_child6.parent = vertex_child1;
			vertex_child1.children.push(vertex_child6);
			vertex_child6 = scope_zoomUI.displayChildNodes(vertex_child1, vertex_child1.svg[0].attr("cx"), vertex_child1.svg[0].attr("cy"));

			// var vertex_child7 = new Vertex("New Stuff", "Some things about hass", "http://wikipedia.org/hass", 2, vertex_child5);
			// vertex_child5.children.push(vertex_child7);
			// vertex_child7 = scope.displayChildNodes(vertex_child5, vertex_child5.svg[0].attr("cx"), vertex_child5.svg[0].attr("cy"));
			//
		});
		var rect1 = paper.rect(60, 0, 50, 50);
		rect1.attr({
			fill : 'black'
		});
		rect1.click(function(event) {
			var vertex_child6 = new Vertex();
			vertex_child6.title = "New Stuff";
			vertex_child6.intro = "introtext";
			vertex_child6.level = 1;
			vertex_child6.link = "https://de.wikipedia.org/wiki/Chaosforschung";
			vertex_child6.parent = vertex_mom;
			vertex_mom.children.push(vertex_child6);
			vertex_child6 = scope_zoomUI.displayChildNodes(vertex_mom, vertex_mom.svg[0].attr("cx"), vertex_mom.svg[0].attr("cy"));

			// var vertex_child7 = new Vertex("New Stuff", "Some things about hass", "http://wikipedia.org/hass", 2, vertex_child5);
			// vertex_child5.children.push(vertex_child7);
			// vertex_child7 = scope.displayChildNodes(vertex_child5, vertex_child5.svg[0].attr("cx"), vertex_child5.svg[0].attr("cy"));
			//
		});

	}
