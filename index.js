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
let arr = [];

function scrapData(theUrl) {
return axios.get(theUrl)
    .then((res) =>{
        const $ = cheerio.load(res.data);      
        const list = '#container > div.bbs_basic_list2';        
        const classes = $(list).children();
        const length = classes.length;        
        for (let num = 1; num <= length; num++) {                
        //const num = 1;        

        let obj = {};
        const child = list + ` > div:nth-child(${num})`;
        const photo = child + ` > div > a > img`;
        const photoText = child + ` > dl`;
        const title = photoText + ` > dt > a`;
        const titleExp = photoText + ` > dd`;
        const expText = titleExp + ' > p'
        const photoNum = $(photo).attr('src');
        const getTitle = $(title).text();
        const getExp = $(titleExp).text();
        const getText = $(expText).text();
        let date = getExp.match(/\d+.\d+.\d+/g)[0];        
        let splitDate = date.split('.')
        let targetDate = parseInt(splitDate[1]);
        let targetMonth = parseInt(splitDate[2]);
        let today = new Date;
        let getDate = today.getDate();
        let getMonth = today.getMonth();
        //if (targetDate === getDate && targetMonth === getMonth) {}

        obj.src= photoNum;
        obj.title = getTitle;
        obj.text = getText;
        obj.date = splitDate;
        obj.exp = getExp;
        obj.order = num;

        arr.push(obj);

        //console.log(classes)
        //console.log(length)
        console.log(photoNum)
        console.log(getTitle)
        //console.log(getExp)
        console.log(getText)
        console.log(date)
        }
        console.log(arr);
        console.log(page, theUrl, 'in func')
        //#container > div.bbs_basic_list2
        let response = {
            statusCode: 200,
            //body: JSON.stringify(tweet)    
          }
      
          return response;
      
          })
        }

scrapData(theUrl)
          .then((res) => {
              if (arr[0].order === 1) {
                  page--;                  
                  theUrl = `https://www.ehistory.go.kr/page/photo/nation_index.jsp?page=${page}&yearCheck=&typeCheck=&searchCategory=whole&searchText=&pageSize=10&subjectID=&orderBy=orderByDate&orderAsc=DESC&input_sdate=1980&input_edate=1990&listType=list`;
                  console.log(page, theUrl, 'in if')
                  return scrapData(theUrl);
              } else return //twit
          })