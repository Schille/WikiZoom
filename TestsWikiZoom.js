function testZoomCore_iterateChildren(){
	var core = new ZoomCore('Albert Einstein');
	
	var vertex1 = new Vertex()
	vertex1.id = 1;
	vertex1.title = "Albert Einstein";
	vertex1.outlinks.push("Ulm");
	vertex1.outlinks.push("New Jersey");
	vertex1.outlinks.push("Materie");
	vertex1.outlinks.push("Zeit");
	vertex1.outlinks.push("Gravitation");
	vertex1.outlinks.push("Relativitätstheorie");
	vertex1.outlinks.push("spezielle Relativitätstheorie");
		
	core.iterateChildren(vertex1, 5);
}