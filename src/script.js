const metaTagsGen = (() => {
  const APP_DATA_KEY = "meta-tags-gen";

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
  const populateForm = (elem, obj) => {
    populateByColumn(elem, "emoji", obj, true);
    populateByColumn(elem, "title", obj, true);
    populateByColumn(elem, "description", obj, true);
    populateByColumn(elem, "keywords", obj, true);
    populateByColumn(elem, "author", obj, true);
    populateByColumn(elem, "url", obj, true);
    populateByColumn(elem, "imageUrl", obj, true);
    populateByColumn(elem, "twitter", obj, true);
    populateByColumn(elem, "fbAppId", obj, true);
  };
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
    // const {emoji, title, description, keywords, author, url, siteName, imageUrl, twitter, fbAppId} = data;
    const emoji = data["emoji"];
    const title = data["title"];
    const description = data["description"];
    const keywords = data["keywords"];
    const author = data["author"];
    const url = data["url"];
    const siteName = data["siteName"];
    const imageUrl = data["imageUrl"];
    const twitter = data["twitter"];
    const fbAppId = data["fbAppId"];
    output.innerHTML = 
`<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
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

${!fbAppId ? "" : `<meta property="fb:app_id" content="${fbAppId}">\n`}
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
  const getDataByColumn = (parentElem, colName, obj) => {
    const input = parentElem.querySelector("." + colName);
    if (input) {
      const isCheckbox = input.getAttribute("type") === "checkbox";
      obj[colName] = isCheckbox ? (input.checked ? 'TRUE' : 'FALSE') : input.value;
    }
    else obj[colName] = "";
  };
  const populateByColumn = (parentElem, colName, obj, leaveBlank) => {
    if (!parentElem) return;
    var elemList = parentElem.querySelectorAll("." + colName);
    var value = obj[colName];
    value = value ? value : '';
    if (elemList) {
      var i, elem, size = elemList.length;
      for (i = 0; i < size; i++) {
        elem = elemList[i];
        if (elem.tagName === "I") {
          elem.className = colName + " " + (value === "TRUE" ? "far fa-check-square" : "far fa-square")
        }
        else if (elem.tagName === "INPUT" || elem.tagName === "TEXTAREA") {
          if (elem.getAttribute("type") === "checkbox") {
            elem.checked = value === "TRUE";
          }
          else {
            elem.value = value;
          }
        }
        else if (elem.tagName === "SELECT") {
          var options = elem.querySelectorAll("option")
            , j, optionSize = options.length, selectedIndex = -1;
          for (j = 0; j < optionSize; j++) {
            if (value === options[j].value) {
              options[j].selected = true;
              selectedIndex = j;
              break;
            }
          }
          elem.value = value;
          elem.selectedIndex = selectedIndex;
          //$(elem).val(value);
          trigger(elem, "change");
        }
        else {
          if (value && (value + "").trim() !== "") {
            value = value
              .replace(/\n/g, '<br/>')
              .replace(/\s\s/g, '&nbsp;')
            ;
          }
          else {
            value = leaveBlank ? "" : 'N/A';
          } 
          elem.innerHTML = value;
        }
      }
    }
  };
  const trigger = (elem, eventName) => {
    if (!elem) { return; }
    var event;
    if (typeof(Event) === 'function') {
      event = new Event(eventName);
    }
    else {
      event = document.createEvent("Event");
      event.initEvent(eventName, true, true);
    }
    elem.dispatchEvent(event);
  };
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