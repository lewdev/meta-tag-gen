const metaTagsGen = (() => {
  const APP_DATA_KEY = "meta-tags-gen";

  const FIELDS = [
    "emoji",
    "title",
    "description",
    "keywords",
    "author",
    "url",
    "imageUrl",
    "twitter",
    "fbAppId",
  ];
  const metaInputs = document.getElementById("metaInputs");
  const output = document.getElementById("output");
  const generateBtn = document.getElementById("generateBtn");
  const genTwitterPostBtn = document.getElementById("genTwitterPostBtn");
  const genFacebookPostBtn = document.getElementById("genFacebookPostBtn");
  const copyOutputBtn = document.getElementById("copyOutputBtn");
  const navbarToggleBtn = document.getElementById("navbarToggleBtn");
  const navbar = document.getElementById('navbarResponsive');

  let data = {};

  window.onload = () => {
    populateEmojiDropdown();
    loadData(() => {
      populateForm(metaInputs, data);
      initCharCounter("title", 70);
      initCharCounter("description", 160);
      initCharCounter("keywords", 160);
    });
    generateBtn.onclick = () => genMetaTags();
    genTwitterPostBtn.onclick = () => genTwitterPost();
    genFacebookPostBtn.onclick = () => genFacebookPost();
    copyOutputBtn.onclick = () => {
      output.select();
      document.execCommand('copy');
    };
    // navbarToggleBtn.onclick = () => navbar.classList.toggle('show');

    const OPEN_CLASS = 'show';
    const addOffClick = (e, cb) => {
      const offClick = evt => {
        if (e !== evt) {
          cb()
          document.removeEventListener('click', offClick)
        }
      }
      document.addEventListener('click', offClick)
    };
    const handleClick = (e) => {
      const toggleMenu = () => navbar.classList.toggle(OPEN_CLASS)
      e.stopPropagation()
      if (!navbar.classList.contains(OPEN_CLASS)) {
        toggleMenu()
        addOffClick(e, toggleMenu)
      }
    };
    navbarToggleBtn.onclick = handleClick;

  };
  const populateEmojiDropdown = () => {
    const select = metaInputs.querySelector(`.emoji`);
    select.innerHTML = emojis.map(e => `<option value="${e.emoji}">${e.emoji} ${e.name}</option>`).join("");
  };
  const updateCharCount = (name, maxSize) => {
    const input = metaInputs.querySelector(`.${name}`);
    const elem = metaInputs.querySelector(`.${name}-char-count`);
    const diff = maxSize - input.value.length;
    elem.innerHTML = `${diff < 0 ? `<span class="text-danger">${diff}</span>` : diff} of ${maxSize} chars left`;
  };
  const initCharCounter = (name, maxSize) => {
    const input = metaInputs.querySelector(`.${name}`);
    input.onblur = input.onkeyup = input.onchange = input.onload = () => updateCharCount(name, maxSize);
    updateCharCount(name, maxSize);
  };
  const populateForm = (elem, obj) => FIELDS.forEach(field => populateByColumn(elem, field, obj, true));
  const extractHostname = url => {
    //find & remove protocol (http, ftp, etc.) and get hostname
    let hostname = url.split('/')[url.indexOf("//") > -1 ? 2 : 0];
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    return hostname.split('?')[0];
  };
  const genTwitterPost = () => {
    data = getFormData(metaInputs);
    saveData();
    const {emoji, title, description, url, hashtags} = data;
    output.innerHTML = 
`${emoji} ${title}
${description}
🏷️ ${hashtags}
${url}
`;
    window.location = "#outputSection";
  };
  const genFacebookPost = () => {
    data = getFormData(metaInputs);
    saveData();
    const {emoji, title, description, url, twitter, hashtags} = data;
    output.innerHTML = 
`${emoji} ${title}
${description}
🏷️ ${hashtags}
👍 Follow me @${twitter}
${url}
`;
    window.location = "#outputSection";
  };
  const genMetaTags = () => {
    data = getFormData(metaInputs);
    saveData();
    const {emoji, title, description, keywords, author, url, siteName, imageUrl, twitter, fbAppId} = data;
    output.innerHTML = 
`<meta charset="utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>

<title>${title}</title>
${!author ? "" : `<meta name="author" content="${author}">`}
${!description ? "" : `<meta name="description" content="${description}">`}
${!keywords ? "" : `<meta name="keywords" content="${keywords}">`}

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${emoji} ${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:site" content="@${twitter}">
<meta name="twitter:creator" content="@${twitter}">
<meta name="twitter:image" content="${imageUrl}">

<!-- Open Graph general (Facebook, Pinterest)-->
<meta property="og:title" content="${emoji} ${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${siteName}">
<meta property="og:type" content="website">
<meta property="og:image" content="${imageUrl}">
${!fbAppId ? "" : `\n<meta property="fb:app_id" content="${fbAppId}">\n`}
<!-- Emoji SVG favicon -->
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>">

<!-- https://realfavicongenerator.net -->

<!-- CSS -->
`;
    window.location = "#outputSection";
  };
  const getFormData = elem => {
    const obj = {};
    getDataByColumn(elem, "emoji", obj);
    getDataByColumn(elem, "title", obj);
    getDataByColumn(elem, "description", obj);
    getDataByColumn(elem, "keywords", obj);
    getDataByColumn(elem, "author", obj);
    getDataByColumn(elem, "url", obj);
    getDataByColumn(elem, "imageUrl", obj);
    getDataByColumn(elem, "twitter", obj);
    getDataByColumn(elem, "fbAppId", obj);
    if (obj.url) obj.siteName = extractHostname(obj.url);
    if (obj.keywords) obj.hashtags = obj.keywords.trim().split(',').map(a => '#' + a.replace(/[^\d\w_]/g, '')).join(" ");
    return obj;
  }
  const loadData = callback => {
    const localData = window.localStorage.getItem(APP_DATA_KEY);
    if (localData) {
      const parsedData = JSON.parse(localData);
      if (parsedData) {
        data = parsedData;
        if (callback) callback();
      }
    }
  };
  const saveData = () => {
    window.localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
  };
})();