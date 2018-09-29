const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');

// hackernews --posts n
// --posts how many posts to print. A positive integer <= 100.
//  hackernews( {posts: n} )  //func that takes in an arg obj
//  https://news.ycombinator.com/news?p=2   // each page has 30 articles

const hackernews = async ({posts: postsRequested}) => {

  getData()     //async func will return Promise unitl it's resolved

  async function getData() {
    try {
      const res1 = await axios.get('https://news.ycombinator.com/news?p=1')
      const res2 = await axios.get('https://news.ycombinator.com/news?p=2')
      const res3 = await axios.get('https://news.ycombinator.com/news?p=3')
      const res4 = await axios.get('https://news.ycombinator.com/news?p=4')
      let arr = [res1.data, res2.data, res3.data, res4.data]  // 4
      for (i = 0; i < arr.length; i++){
        getFromhtml(arr[i])
      }
      //getFromhtml(arr[0])
    } catch (error) {
      console.error(error);
    }
  }

  const getFromhtml = (html) => {
    let results = []

    let $ = cheerio.load(html)
    $('span.comhead').each(function(i, element){
      let a = $(this).prev()

      let title = a.text()
      let uri = a.attr('href')
      let rank = a.parent().parent().text()

      // if (parseInt(rank) < postsRequested) {
      //   console.log(rank)
      // }
      //console.log(rank)

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
      //results.push(obj)
      if (obj.rank <= postsRequested) {
        //console.log(obj)
        results.push(obj)
      }
    })
    if (results.length > 0){
      console.log(results.length)
    }
    // if (obj.rank < postsRequested) {
    //   console.log(obj)
    // }
    //console.log(results.length)
    // if (results.rank < postsRequested) {
    //   console.log(results.rank)
    // }
  }
}

//getPosts(3, 5)
hackernews({posts: 35})  // will be called from terminal

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
