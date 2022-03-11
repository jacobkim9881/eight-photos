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

async function getList(res) {
        const $ = cheerio.load(res.data);      
        const list = '#container > div.bbs_basic_list2';        
        const classes = $(list).children();
        const length = classes.length;        
        for (let num = 1; num <= length; num++) {                
        //const num = 1;        

        //let obj = {};
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
        let targetDate = parseInt(splitDate[2]);
        let targetMonth = parseInt(splitDate[1]);
        let today = new Date;
	let getFullYear = today.getFullYear();		
        let getDate = today.getDate();
        let getMonth = today.getMonth() + 1
		//console.log(splitDate);
		//console.log(targetDate, parseInt(getDate), targetMonth, parseInt(getMonth))
	if (targetDate === parseInt(getDate) && targetMonth === parseInt(getMonth)) {		
	order++;		
        //if (targetDate === getDate && targetMonth === getMonth) {}
        arts[order + 1] = {};	
        arts[order + 1].src= photoNum;
        arts[order + 1].title = getTitle;
        arts[order + 1].text = getText;
        arts[order + 1].date = splitDate;
        arts[order + 1].exp = getExp;
	}
//console.log(Date.parse(`${getFullYear}-${splitDate[1]}-${splitDate[2]}`) - Date.now())
 	if (Date.parse(`${getFullYear}-${splitDate[1]}-${splitDate[2]}`) - Date.now() > 0) return false;		
	        //console.log(classes)
        //console.log(length)
        console.log(photoNum)
        console.log(getTitle)
        //console.log(getExp)
        console.log(getText)
        //console.log(date)
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
/*
  for (let i = 0; i < 1; i++) {
  let lastTime = arts[order].exp;
  let lastYear = lastTime[0][3];	  
  let lastMont = lastTime[1];
  let lastDay = lastTime[2];	 
  let isLeftedArts = Date.parse(`${thisYear}-${lastMont}-${lastDay}`) - Date.now() < 0 ? false : true;	  
  if (thisYear[3] === lastYear) {
    
  } else {};
  }
  */
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
/*
          .then((res) => {
  let lastTime = arts[order].date;
  let lastYear = lastTime[0][3];	  
  let lastMont = lastTime[1];
  let lastDay = lastTime[2];	 
  let isLeftedArts = Date.parse(`${thisYear}-${lastMont}-${lastDay}`) - Date.now() < 0 ? true: false;	
		 // console.log('articles',arts)
		 // console.log('order',order)
		  console.log(lastTime, lastYear)
		  console.log(thisYear)
		  console.log(isLeftedArts)
  if (parseInt(thisYear[3]) === parseInt(lastYear) && isLeftedArts) {
                  page--;                  
	  console.log(page)
                  theUrl = `https://www.ehistory.go.kr/page/photo/nation_index.jsp?page=${page}&yearCheck=&typeCheck=&searchCategory=whole&searchText=&pageSize=10&subjectID=&orderBy=orderByDate&orderAsc=DESC&input_sdate=1980&input_edate=1990&listType=list`;
                  console.log(page, theUrl, 'in if')
                  return scrapData(theUrl);
              } else return //twit
          });
	  */

/*
scrapData(theUrl)
          .then((res) => {
              if (arr[0].order === 1) {
                  page--;                  
                  theUrl = `https://www.ehistory.go.kr/page/photo/nation_index.jsp?page=${page}&yearCheck=&typeCheck=&searchCategory=whole&searchText=&pageSize=10&subjectID=&orderBy=orderByDate&orderAsc=DESC&input_sdate=1980&input_edate=1990&listType=list`;
                  console.log(page, theUrl, 'in if')
                  return scrapData(theUrl);
              } else return //twit
          })
	  */
