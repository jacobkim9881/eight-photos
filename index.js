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

function rewriteUrl(page) {
  return `https://www.ehistory.go.kr/page/photo/nation_index.jsp?page=${page}&yearCheck=&typeCheck=&searchCategory=whole&searchText=&pageSize=10&subjectID=&orderBy=orderByDate&orderAsc=DESC&input_sdate=1980&input_edate=1990&listType=list`

}

let page;
	//2665;
let theUrl;
let arts = {};
let order = 0;
let thisYear = new Date().getFullYear().toString();

function pickNthPost($, num) {
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
	return {
		"photo-num": photoNum, 
		"get-title": getTitle,
		"get-text": getText,
		"date" : splitDate,
		"get-exp": getExp
	}
}

async function getList(res) {
        const $ = cheerio.load(res.data);      
        const list = '#container > div.bbs_basic_list2';        
        const classes = $(list).children();
        const length = classes.length;        
        for (let num = 1; num <= length; num++) {                
	let postObj = pickNthPost($, num);
        let targetDate = postObj.date[2]
	, targetMonth = postObj.date[1]
	, today = new Date;
	let getFullYear = today.getFullYear();		
        let getDate = today.getDate();
        let getMonth = today.getMonth() + 1

		//console.log(splitDate);
		//console.log(targetDate, parseInt(getDate), targetMonth, parseInt(getMonth))
	if (targetDate === parseInt(getDate) && targetMonth === parseInt(getMonth)) {		
	order++;		
        //if (targetDate === getDate && targetMonth === getMonth) {}
        arts[order + 1] = {};	
        arts[order + 1].src= postObj["photo-num"];
        arts[order + 1].title = postObj["get-title"];
        arts[order + 1].text = postObj["get-text"];
        arts[order + 1].date = postObj["date"];
        arts[order + 1].exp = postObj["get-exp"];
	}
//console.log(Date.parse(`${getFullYear}-${splitDate[1]}-${splitDate[2]}`) - Date.now())
		//if one of lists have older month-day than today, then stop scraping posts 
 	if (Date.parse(`${getFullYear}-${targetMonth}-${targetDate}`) - Date.now() > 0) return false;		
        }
        return true; 

}

async function scrapData(theUrl) {
return await axios.get(theUrl)
    .then((res) => getList(res))
	.then((res) => {
	                  page--;                  
	  console.log(page)
		console.log('day same', res);
                  theUrl = rewriteUrl(page);
		  //console.log(page, theUrl, 'in if')
                  if (res) return scrapData(theUrl)
		  else return page + 1;
	})
        }

let serverUrl = 'http://hotisred.xyz';
let lastPage = serverUrl + '/users/get_last';
let postPage = serverUrl + '/users/create';

async function getLastPage(lastPage) {
return await axios.get(lastPage)
	.then(res => {
		console.log('from server:',res.data)
		page = res.data.name;
		theUrl = rewriteUrl(page);
 	return scrapData(theUrl)
	})
}

async function postPageNum(postPage, page) {
return await axios.post(postPage, {
  name: page 
})
  .then(res => console.log(res))
  .catch(err => console.log('err while post', err));
}

getLastPage(lastPage);
  .then(res => postPageNum(postPage, res);
