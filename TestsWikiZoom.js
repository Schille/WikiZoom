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