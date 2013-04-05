function decodeHtml(html) {
	var txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}

function fetch(title) {
	var global;
	window.addEvent('domready', function() {

		var obj;
		new Request.JSONP({
			url : "http://de.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&format=json&titles=" + title,
			data : {

			},
			onComplete : function(JSONdata) {
				// Log the result to console for inspection
				var pageid = Object.keys(JSONdata.query.pages)
				var intro = JSONdata.query.pages[pageid].revisions[0]["*"]
				var n = intro.indexOf("'''");
				var k = 1;
				while (true) {
					if (intro.substring(n - k, n - k + 1) == '\n') {
						var index = intro.substring(n - k + 1, intro.length);
						break;
					}
					k++;

				}
				index = decodeHtml(index);
				var doubleLinkSearch = /\[\[[a-zäüöß\(\).,\-\s#]+\s?([a-zäüöß\(\).,\-\s#]+)?\|[a-zäüöß\(\).,\-\s#]+\s?([a-zäüöß\(\).,\-\s#]+)?\]\]/gi;
				var singleLinkSearch = /\[\[[a-zäöüß,.\(\)\s\-]+\]\]/gi;
				var result;
				DoubleLinks = new Array();
				Links = new Array();
				while ( result = doubleLinkSearch.exec(index)) {
					DoubleLinks.push(result[0]);
				}
				while ( result = singleLinkSearch.exec(index)) {
					Links.push(result[0]);
				}
				for (var k = 0; k < DoubleLinks.length; k++) {
					helper = String.split(DoubleLinks[k], "|");
					Links.push(helper[0]);
				}
				for (var k = 0; k < Links.length; k++) {
					var element = Links[k];
					var clean = element.replace(/\[|\]/gi, '')
					Links[k] = clean;
				}
				var cleanIntro = index.replace(/<ref>[^<]+<\/ref>/gi, '').replace(/\[http[^\]]+]/gi, '').replace(/\[\[[a-zäüöß\(\).,\-\s#]+\s?([a-zäüöß\(\).,\-\s#]+)?\|/gi, '').replace(/{{[^']+'''/gi, '').replace(/'|{|}/gi, '').replace(/<[^>]+>/gi, '').replace(/\[|\]/gi, '');
				console.info(cleanIntro);
				console.info(Links);

			}
		}).send();

	});
	return;
}