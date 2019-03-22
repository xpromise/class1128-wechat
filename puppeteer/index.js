const puppeteer = require('puppeteer');

(async () => {
  // 打开浏览器
  const browser = await puppeteer.launch({
    headless: false
  });
  // 新建标签页
  const page = await browser.newPage();
  // 跳转到指定网址
  await page.goto('https://movie.douban.com/cinema/nowplaying/shenzhen/', {
    waitUntil: ['domcontentloaded']
  });
  
  // 爬取所有正在热映的电影网址
  const result = await page.evaluate(() => {
    // 抓取网页中的内容
    const $a = $('.lists>li .poster a');
    
    const result = [];
  
    $a.each(function (index, item) {
      // item --> DOM对象
      result.push(item.href);
    })
    // 方法中没有任何输出的
    // console.log(result);
    return result;
  });
  
  console.log(result);
  /*
    [ 'https://movie.douban.com/subject/27624661/?from=playing_poster',
  'https://movie.douban.com/subject/27150225/?from=playing_poster',
  'https://movie.douban.com/subject/27663742/?from=playing_poster',
  'https://movie.douban.com/subject/26213252/?from=playing_poster',
  'https://movie.douban.com/subject/25833233/?from=playing_poster',
  'https://movie.douban.com/subject/26715636/?from=playing_poster',
  'https://movie.douban.com/subject/27060077/?from=playing_poster',
  'https://movie.douban.com/subject/5300054/?from=playing_poster',
  'https://movie.douban.com/subject/30205168/?from=playing_poster',
  'https://movie.douban.com/subject/26266893/?from=playing_poster',
  'https://movie.douban.com/subject/30464313/?from=playing_poster',
  'https://movie.douban.com/subject/27166442/?from=playing_poster',
  'https://movie.douban.com/subject/19899707/?from=playing_poster',
  'https://movie.douban.com/subject/27602116/?from=playing_poster',
  'https://movie.douban.com/subject/1652592/?from=playing_poster',
  'https://movie.douban.com/subject/27191431/?from=playing_poster',
  'https://movie.douban.com/subject/30304656/?from=playing_poster',
  'https://movie.douban.com/subject/30426150/?from=playing_poster',
  'https://movie.douban.com/subject/27135473/?from=playing_poster',
  'https://movie.douban.com/subject/30163509/?from=playing_poster',
  'https://movie.douban.com/subject/30376836/?from=playing_poster',
  'https://movie.douban.com/subject/30474016/?from=playing_poster',
  'https://movie.douban.com/subject/30192287/?from=playing_poster',
  'https://movie.douban.com/subject/27000904/?from=playing_poster',
  'https://movie.douban.com/subject/30424795/?from=playing_poster',
  'https://movie.douban.com/subject/27133179/?from=playing_poster',
  'https://movie.douban.com/subject/30460368/?from=playing_poster',
  'https://movie.douban.com/subject/30164448/?from=playing_poster',
  'https://movie.douban.com/subject/25924056/?from=playing_poster',
  'https://movie.douban.com/subject/27179414/?from=playing_poster',
  'https://movie.douban.com/subject/26909787/?from=playing_poster',
  'https://movie.douban.com/subject/27132728/?from=playing_poster',
  'https://movie.douban.com/subject/30384186/?from=playing_poster',
  'https://movie.douban.com/subject/27042871/?from=playing_poster',
  'https://movie.douban.com/subject/30447810/?from=playing_poster',
  'https://movie.douban.com/subject/30334073/?from=playing_poster',
  'https://movie.douban.com/subject/26728669/?from=playing_poster' ]
   */
  
  let movies = [];
  // 爬取正在热映的电影详情
  for (let i = 0; i < result.length; i++) {
    const url = result[i];
    // 跳转到指定网址
    await page.goto(url);
    // 爬取正在热映的电影详情
    const detail = await page.evaluate(() => {
      // 电影标题
      const title = $('[property="v:itemreviewed"]').text()
      // 电影评分
      const rating = $('[property="v:average"]').text()
      // 电影海报
      const image = $('[rel="v:image"]').attr('src');
      
      return {
        title,
        rating,
        image
      };
      
    });
  
    movies.push(detail);
    
  }
  
  console.log(movies);
  /*
    [ { title: '比悲伤更悲伤的故事 比悲傷更悲傷的故事',
    rating: '4.9',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2549523952.webp' },
  { title: '狂暴凶狮 Prooi',
    rating: '',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2548549246.webp' },
  { title: '老师·好',
    rating: '7.2',
    image: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2551352209.webp' },
  { title: '惊奇队长 Captain Marvel',
    rating: '7.0',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2548870813.webp' },
  { title: '乐高大电影2 The Lego Movie 2: The Second Part',
    rating: '7.1',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2549353234.webp' },
  { title: '地久天长',
    rating: '7.9',
    image: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2550208359.webp' },
  { title: '绿皮书 Green Book',
    rating: '8.9',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2549177902.webp' },
  { title: '波西米亚狂想曲 Bohemian Rhapsody',
    rating: '8.6',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2549558913.webp' },
  { title: '篮球冠军 Campeones',
    rating: '7.1',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2550534680.webp' },
  { title: '流浪地球',
    rating: '8.0',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2545472803.webp' },
  { title: '夜伴歌声',
    rating: '',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2548652745.webp' },
  { title: '夏目友人帐 劇場版 夏目友人帳 ～うつせみに結ぶ～',
    rating: '8.0',
    image: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2546745948.webp' },
  { title: '驯龙高手3 How To Train Your Dragon: The Hidden World',
    rating: '7.5',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2546335362.webp' },
  { title: '我的英雄学院：两位英雄 僕のヒーローアカデミア THE MOVIE ～2人の英雄～',
    rating: '7.3',
    image: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2548783889.webp' },
  { title: '阿丽塔：战斗天使 Alita: Battle Angel',
    rating: '7.6',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2544987866.webp' },
  { title: '过春天',
    rating: '8.0',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2549537782.webp' },
  { title: '老公去哪了',
    rating: '',
    image: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2548167457.webp' },
  { title: '少女宿舍',
    rating: '',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2550454042.webp' },
  { title: '阳台上',
    rating: '6.1',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2546828235.webp' },
  { title: '飞驰人生',
    rating: '7.0',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2542973862.webp' },
  { title: '梦想之城',
    rating: '',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2549237420.webp' },
  { title: '爱无痕',
    rating: '',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2550632216.webp' },
  { title: '把哥哥退货可以吗？ น้อง.พี่.ที่รัก',
    rating: '5.4',
    image: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2550530988.webp' },
  { title: '江海渔童之巨龟奇缘',
    rating: '',
    image: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2549234757.webp' },
  { title: '古井凶灵',
    rating: '',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2547985203.webp' },
  { title: '318号公路',
    rating: '',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2550556541.webp' },
  { title: '醒来之爱的呼唤',
    rating: '',
    image: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2549170039.webp' },
  { title: '海市蜃楼 Durante la tormenta',
    rating: '7.9',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2551172384.webp' },
  { title: '小飞象 Dumbo',
    rating: '',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2549234765.webp' },
  { title: '人间·喜剧',
    rating: '',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2550450064.webp' },
  { title: '三重威胁之跨国大营救 Triple Threat',
    rating: '',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2551252121.webp' },
  { title: '警告 El aviso',
    rating: '5.5',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2549893086.webp' },
  { title: '似水流年',
    rating: '',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2540569584.webp' },
  { title: '精灵怪物：疯狂之旅 Happy Family',
    rating: '5.2',
    image: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2548674757.webp' },
  { title: '毕业旅行之逍遥骑士',
    rating: '',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2550763404.webp' },
  { title: '调音师 Andhadhun',
    rating: '8.4',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2551201286.webp' },
  { title: '风中有朵雨做的云',
    rating: '7.9',
    image: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2546758383.webp' } ]

   */
  
  // 关闭浏览器
  await browser.close();
})();