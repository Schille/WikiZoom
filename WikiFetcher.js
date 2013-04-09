var WikiFetcher = new Class({
	
initialize : function (vertex) {
	this.myVertex = vertex;
	scope = this;
},
/**
 * This function decodes all HTML tags in a String
 * @param html This is the HTML encoded String to be decoded
 */
decodeHtml : function (html) {
	var txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
},
/**
 * This function fetches the Links and the content of the introduction of a Wikipedia article
 * @param {Object} title This is the title of the Wikipedia article to be fetched
 */
fetch : function (vertex) {
	
	window.addEvent('domready', function() {

		var obj;
		new Request.JSONP({
			// create URL for API call
			url : "http://de.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&format=json&titles=" + vertex.title,
			data : {

			},
			// onComplete start the action
			onComplete : function(JSONdata) {
				//first parse the JSON Object
				var pageid = Object.keys(JSONdata.query.pages)
				var intro = JSONdata.query.pages[pageid].revisions[0]["*"]
				// then search for the ''' Pattern to determine the start of the introduction
				var n = intro.indexOf("'''");
				var k = 1;
				// go back to the first \n and cut off the text in front
				while (true) {
					if (intro.substring(n - k, n - k + 1) == '\n') {
						var index = intro.substring(n - k + 1, intro.length);
						break;
					}
					k++;

				}
				// decode HTML tags
				index = scope.decodeHtml(index);
				// create RegEx patterns for the Wikipedia Link pattern [[Name of Link|text in introduction]]
				var doubleLinkSearch = /\[\[[a-zäüöß\(\).,\-\s#]+\s?([a-zäüöß\(\).,\-\s#]+)?\|[a-zäüöß\(\).,\-\s#]+\s?([a-zäüöß\(\).,\-\s#]+)?\]\]/gi;
				// pattern for [[Link]], when link = text in introduction
				var singleLinkSearch = /\[\[[a-zäöüß,.\(\)\s\-]+\]\]/gi;
				var result;
				// create arrays to store the links
				DoubleLinks = new Array();
				Links = new Array();
				// go through the introduction String and push every pattern which matches doubleLinkSearch into the array
				while ( result = doubleLinkSearch.exec(index)) {
					DoubleLinks.push(result[0]);
				}
				// put every pattern which matches the singleLinkSearch pattern into the array
				while ( result = singleLinkSearch.exec(index)) {
					Links.push(result[0]);
				}
				// go through the DoubleLinks array and split Strings to determine the Link title and the text in the introduction then put them into the Links array
				for (var k = 0; k < DoubleLinks.length; k++) {
					helper = String.split(DoubleLinks[k], "|");
					Links.push(helper[0]);
				}
				// replace unwanted patterns in the Link array
				for (var k = 0; k < Links.length; k++) {
					var element = Links[k];
					var clean = element.replace(/\[|\]/gi, '')
					Links[k] = clean;
				}
				// get rid of every unwanted pattern in the introduction this includes:
				// href Links, Wikipedia Links, parenthesis patterns and some other formatting
				var cleanIntro = index.replace(/<ref>[^<]+<\/ref>/gi, '').replace(/\[http[^\]]+]/gi, '').replace(/\[\[[a-zäüöß\(\).,\-\s#]+\s?([a-zäüöß\(\).,\-\s#]+)?\|/gi, '').replace(/{{[^']+'''/gi, '').replace(/'|{|}/gi, '').replace(/<[^>]+>/gi, '').replace(/\[|\]/gi, '');
				console.info(cleanIntro);
				console.info(Links);
				test = this
			}
		}).send();

	});
	return;
},

});
