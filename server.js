const request = require('request');
const cheerio = require('cheerio');

let base_url = "https://news.ycombinator.com/"   // page 1

//  https://news.ycombinator.com/news?p=2   // each page has 30 articles

request(base_url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    let $ = cheerio.load(html);
    $('span.comhead').each(function(i, element){
      let a = $(this).prev();
      //console.log(a.text());

      let title = a.text();
      //console.log("TITLE:", title)

      let uri = a.attr('href');
      //console.log("URI:", uri)

      let subtext = a.parent().parent().next().children('.subtext').children();

      let author = $(subtext).eq(1).text();
      //console.log("AUTHOR:", author)

      let points = $(subtext).eq(0).text();
      //console.log("POINTS:", points)

      let comments = $(subtext).eq(5).text();
      //console.log("COMMENTS:", comments)

      let rank = a.parent().parent().text();
      //console.log("RANK:", rank)

      let obj = {
        title: title,
        uri: uri,
        author: author,
        points: parseInt(points),
        comments: parseInt(comments),
        rank: parseInt(rank),
      }
      console.log(obj)
    });
  }
});
