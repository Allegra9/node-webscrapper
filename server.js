const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
// require('make-runnable');

// hackernews --posts n
// --posts how many posts to print. A positive integer <= 100.
//  hackernews( {posts: n} )  //func that takes in an arg obj


// module.exports = {
//     addTogether: function(x,y){
//         return x + y
//     }, doSomethingWithObject: function(object){
//         object.newKey = "easy AF";
//         return object;
//     }, simpleValue: 'also works'
// };
// require('make-runnable');

//module.exports = {
    // hackernews: async function(obj){
    //   return getData(obj)
    // }
// };
// require('make-runnable');

const hackernews = async ({posts: postsRequested}) => {
  try {
    const res1 = await axios.get('https://news.ycombinator.com/news?p=1')
    const res2 = await axios.get('https://news.ycombinator.com/news?p=2')
    const res3 = await axios.get('https://news.ycombinator.com/news?p=3')
    const res4 = await axios.get('https://news.ycombinator.com/news?p=4')
    let htmls = [res1.data, res2.data, res3.data, res4.data]  // 4
    for (let i = 0; i < htmls.length; i++){
      getPosts(htmls[i], postsRequested)
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
      title: title,
      uri: uri,
      author: author,
      points: parseInt(points),
      comments: parseInt(comments),
      rank: parseInt(rank)
    }
    if (obj.rank <= posts) {
      results.push(obj)
    }
  })
  if (results.length > 0){
    console.log(results)
  }
}

hackernews({posts: 2})  // will be called from terminal

//VALIDATIONS:

// title and author are non empty strings not longer than 256 characters.
// title.length > 0 && title.length < 256 ?
//   title
//   : "no title or it's wayyyy too long"  //title = title.substring(0,253)+"...";
//
// author.length > 0 && author.length < 256 ?
//   author
//   : "no author or it's wayyyy too long"
//
// //points and comments are integers >= 0
// if (comments === 'discuss' || parseInt(comments) <= 0) {
//   comments = 0
// }
// if (parseInt(points) < 0) {
//   points = 0
// }
// //checks if uri is valid:
//  let regex = (^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?)
// let regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
// if (!regex.test(uri)){
//   uri = "URI NOT VALID !!!!!!!!!!!"
// }
