#!/usr/bin/env node

const fetch = require('node-fetch')
const cheerio = require('cheerio')
const program = require('commander')

const getPagesArray = (numberOfPosts) =>
  Array(Math.ceil(numberOfPosts / 30))   //divides by 30 (posts per page)
    .fill()                          //creates a new array
    .map((_, index) => index + 1)    //fills it with values [1, 2, 3,..]

const getPageHTML = (pageNumber) =>
  fetch(`https://news.ycombinator.com/news?p=${pageNumber}`)
    .then(resp => resp.text())

const getAllHTML = async (numberOfPosts) => {
  if (numberOfPosts < 1 || numberOfPosts > 100) {
    return 'Please choose a number between 1 and 100'
  }
  return Promise.all(getPagesArray(numberOfPosts).map(getPageHTML))
    //maps getPageHTML func on each element of PagesArray [1, 2, 3, 4,...]
    .then(htmls => htmls.join(''))   // one joined html for all pages
}

const getPosts = (html, posts) => {
  let results = []
  let $ = cheerio.load(html)

  $('span.comhead').each(function() {
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
  if (results.length > 0) {
    console.log(results)
    return results
  }
}

// hackernews --posts n     // hackernews -p 2
program
  .option('-p, --posts [value]', 'Number of posts', 30)
  .action(args =>
    getAllHTML(args.posts)
      .then(html => getPosts(html, args.posts))
  )

program.parse(process.argv)

//VALIDATIONS:

const checkInput = (input) => {
  if (input.length > 0 && input.length < 256){
    return input
  }else {
    return input.substring(0,253)+"...";
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
  if (comments === 'discuss' || comments === '' || parseInt(comments) <= 0) {
    return 0
  }else {
    return parseInt(comments)
  }
}
