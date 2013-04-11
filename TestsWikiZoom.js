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
	UI = ZoomUI();
	Core = ZoomCore('Mannheim');

}
