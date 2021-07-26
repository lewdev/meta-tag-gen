const NOUNS = 'time,year,people,way,day,man,thing,woman,life,child,world,school,state,family,student,group,country,problem,hand,part,place,case,week,company,system,program,question,work,government,number,night,point,home,water,room,mother,area,money,story,fact,month,lot,right,study,book,eye,job,word,business,issue,side,kind,head,house,service,friend,father,power,hour,game,line,end,member,law,car,city,community,name,president,team,minute,idea,kid,body,information,back,parent,face,others,level,office,door,health,person,art,war,history,party,result,change,morning,reason,research,girl,guy,moment,air,teacher,force,education'.split(",");
const ADJECTIVES = 'abrupt,acidic,adorable,adventurous,aggressive,agitated,alert,aloof,bored,brave,bright,colossal,condescending,confused,cooperative,corny,costly,courageous,cruel,despicable,determined,dilapidated,diminutive,distressed,disturbed,dizzy,exasperated,excited,exhilarated,extensive,exuberant,frothy,frustrating,funny,fuzzy,gaudy,graceful,greasy,grieving,gritty,grotesque,grubby,grumpy,handsome,happy,hollow,hungry,hurt,icy,ideal,immense,impressionable,intrigued,irate,foolish,frantic,fresh,friendly,frightened,frothy,frustrating,glorious,gorgeous,grubby,happy,harebrained,healthy,helpful,helpless,high,hollow,homely,large,lazy,livid,lonely,loose,lovely,lucky,mysterious,narrow,nasty,outrageous,panicky,perfect,perplexed,quizzical,teeny,tender,tense,terrible,tricky,troubled,unsightly,upset,wicked,yummy,zany,zealous,zippy'.split(',');
const NAMES = 'James,Mary,Robert,Patricia,John,Jennifer,Michael,Linda,William,Elizabeth,David,Barbara,Richard,Susan,Joseph,Jessica,Thomas,Sarah,Charles,Karen,Christopher,Nancy,Daniel,Lisa,Matthew,Betty,Anthony,Margaret,Mark,Sandra,Donald,Ashley,Steven,Kimberly,Paul,Emily,Andrew,Donna,Joshua,Michelle,Kenneth,Dorothy,Kevin,Carol,Brian,Amanda,George,Melissa,Edward,Deborah,Ronald,Stephanie,Timothy,Rebecca,Jason,Sharon,Jeffrey,Laura,Ryan,Cynthia,Jacob,Kathleen,Gary,Amy,Nicholas,Shirley,Eric,Angela,Jonathan,Helen,Stephen,Anna,Larry,Brenda,Justin,Pamela,Scott,Nicole,Brandon,Emma,Benjamin,Samantha,Samuel,Katherine,Gregory,Christine,Frank,Debra,Alexander,Rachel,Raymond,Catherine,Patrick,Carolyn,Jack,Janet,Dennis,Ruth,Jerry,Maria,Tyler,Heather,Aaron,Diane,Jose,Virginia,Adam,Julie,Henry,Joyce,Nathan,Victoria,Douglas,Olivia,Zachary,Kelly,Peter,Christina,Kyle,Lauren,Walter,Joan,Ethan,Evelyn,Jeremy,Judith,Harold,Megan,Keith,Cheryl,Christian,Andrea,Roger,Hannah,Noah,Martha,Gerald,Jacqueline,Carl,Frances,Terry,Gloria,Sean,Ann,Austin,Teresa,Arthur,Kathryn,Lawrence,Sara,Jesse,Janice,Dylan,Jean,Bryan,Alice,Joe,Madison,Jordan,Doris,Billy,Abigail,Bruce,Julia,Albert,Judy,Willie,Grace,Gabriel,Denise,Logan,Amber,Alan,Marilyn,Juan,Beverly,Wayne,Danielle,Roy,Theresa,Ralph,Sophia,Randy,Marie,Eugene,Diana,Vincent,Brittany,Russell,Natalie,Elijah,Isabella,Louis,Charlotte,Bobby,Rose,Philip,Alexis,Johnny,Kayla'.split(',');
const WORDS = NOUNS.concat(ADJECTIVES);
const cap = word => word.charAt(0).toUpperCase() + word.slice(1);

const randArr = arr => arr[Math.floor(Math.random() * arr.length)];

const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randWord = (count = 1) => repeat(() => randArr(WORDS), count).join(' ');

const randWordCap = (count = 1) => repeat(() => cap(randArr(WORDS)), count).join(' ');

const repeat = (f, times) => Array(times).fill().map(f);

const sentence = () => cap(randWord()) + ' ' + repeat(randWord, randRange(4, 6)).join(' ') + '.';

const populateFieldsRandomly = () => {
  if (!confirm("⛔ This will overwrite the fields with random data. ⛔\nAre you sure you want this?")) return;
  const metaInputs = document.getElementById("metaInputs");
  const title = randWordCap(randRange(3, 4));
  const url = `http://www.${title.split(' ').join("").toLowerCase()}.com`;
  const author = repeat(() => randArr(NAMES), 2).join(' ');
  const selectOptions = [];
  metaInputs.querySelectorAll('.emoji > option').forEach(option => selectOptions.push(option.value));
  const obj = {
    "title": title + ' | ' + sentence(),
    "description": repeat(sentence, randRange(2, 3)).join(' '),
    "keywords": repeat(() => randWordCap(randRange(1, 3)), randRange(3, 6)).join(', '),
    "author": author,
    "url": url,
    "imageUrl": url + '/banner-1200x630.jpg',
    "twitter": author.split(' ').join("").toLowerCase(),
    "emoji": randArr(selectOptions),
  };
  Object.keys(obj).map(key => populateByColumn(metaInputs, key, obj, true));
};