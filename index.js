//require('dotenv').config()
let axios = require('axios')
//let Twit = require('twit')
//console.log(require('/opt/nodejs/node14/index.js'))
const Crawler = require('crawler');
const cheerio = require('cheerio');

var c = new Crawler({
    maxConnections : 10,
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
        }
        done();
    }
});

let page = 2954;

let theUrl = `https://www.ehistory.go.kr/page/photo/nation_index.jsp?page=${page}&yearCheck=&typeCheck=&searchCategory=whole&searchText=&pageSize=10&subjectID=&orderBy=orderByDate&orderAsc=DESC&input_sdate=1980&input_edate=1990&listType=list`

axios.get(theUrl)
    .then((res) =>{
        const $ = cheerio.load(res.data);      
        const list = '#container > div.bbs_basic_list2';
        const num = 1;
        const classes = $(list).children();
        const child = list + ` > div:nth-child(${num})`;
        const photo = child + ` > div > a > img`;
        const photoText = child + ` > dl`;
        const title = photoText + ` > dt > a`;
        const titleExp = photoText + ` > dd`;
        const expText = titleExp + ' > p'
        const length = classes.length;
        const photoNum = $(photo).attr('src');
        const getTitle = $(title).text();
        const getExp = $(titleExp).text();
        const getText = $(expText).text();
        const date = getExp.match(/\d+.\d+.\d+/g)[0];
        //console.log(classes)
        //console.log(length)
        console.log(photoNum)
        console.log(getTitle)
        //console.log(getExp)
        console.log(getText)
        console.log(date)
        //#container > div.bbs_basic_list2
        let response = {
            statusCode: 200,
            //body: JSON.stringify(tweet)    
          }
      
          return response;
      
          })