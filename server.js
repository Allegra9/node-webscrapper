const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');

// hackernews --posts n
// --posts how many posts to print. A positive integer <= 100.
//  hackernews({ posts: n })

//  node server hackernews --posts 5

// module.exports = {
//     addTogether: function(x,y){
//         return x + y
//     }, doSomethingWithObject: function(object){
//         object.newKey = "easy AF";
//         return object;
//     }, simpleValue: 'also works'
// };
// require('make-runnable');


// module.exports = {
//     hackernews: async function(obj){
//       //LALALALa
//     }
// };
// require('make-runnable');

const hackernews = async ({posts: postsRequested}) => {
  try {
    let htmls = await Promise.all([
      axios.get('https://news.ycombinator.com/news?p=1'),
      axios.get('https://news.ycombinator.com/news?p=2'),
      axios.get('https://news.ycombinator.com/news?p=3'),
      axios.get('https://news.ycombinator.com/news?p=4')
    ])
    for (let i = 0; i < htmls.length; i++){
      getPosts(htmls[i].data, postsRequested)
    }
  } catch (error) {
    console.error(error);
  }
}

const getPosts = (html, posts) => {
  let results = []
  let $ = cheerio.load(html)

  $('span.comhead').each(function(){
    let a = $(this).prev()

    let title = a.text()
    let uri = a.attr('href')
    let rank = a.parent().parent().text()

    let subtext = a.parent().parent().next().children('.subtext').children()
    let author = $(subtext).eq(1).text()
    let points = $(subtext).eq(0).text()
    let comments = $(subtext).eq(5).text()

    let obj = {
      title: checkInput(title),
      uri: checkURI(uri),
      author: checkInput(author),
      points: checkPoints(points),
      comments: checkComments(comments),
      rank: parseInt(rank)
    }
    if (obj.rank <= posts) {
      results.push(obj)
    }
  })
  if (results.length > 0){
    console.log(results)
    //return results
  }
}

hackernews({posts: 32})  // will be called from terminal

//VALIDATIONS:

const checkInput = (input) => {
  if (input.length > 0 && input.length < 256){
    return input
  }else {
    return 'no input or its more than 256 chars'
    //input = input.substring(0,253)+"...";
  }
}

const checkURI = (uri) => {
  let regex = /(^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?)/
  if (regex.test(uri)){
    return uri
  }else {
    return "uri not valid"
  }
}

const checkPoints = (points) => {
  if (parseInt(points) <= 0) {
    return 0
  }else {
    return parseInt(points)
  }
}

const checkComments = (comments) => {
  if (comments === 'discuss' || parseInt(comments) <= 0) {
    return 0
  }else {
    return parseInt(comments)
  }
}
