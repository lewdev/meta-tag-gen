const metaTagsGen = (() => {
  const APP_DATA_KEY = "meta-tags-gen";

  const metaInputs = document.getElementById("metaInputs");
  const output = document.getElementById("output");
  const generateBtn = document.getElementById("generateBtn");
  const copyOutputBtn = document.getElementById("copyOutputBtn");
  const navbarToggleBtn = document.getElementById("navbarToggleBtn");

  let data = {};

  window.onload = () => {
    loadData(() => {
      populateForm(metaInputs, data);
      displayData();
    });
    generateBtn.onclick = () => displayData();
    copyOutputBtn.onclick = () => {
      output.select();
      document.execCommand('copy');
    };
    navbarToggleBtn.onclick = () => {
      const navbar = document.getElementById('navbarResponsive');
      navbar.classList.toggle('show');
    }
  }
  const populateForm = (elem, obj) => {
    populateByColumn(elem, "title", obj, true);
    populateByColumn(elem, "description", obj, true);
    populateByColumn(elem, "author", obj, true);
    populateByColumn(elem, "url", obj, true);
    populateByColumn(elem, "imageUrl", obj, true);
    populateByColumn(elem, "twitter", obj, true);
    populateByColumn(elem, "fbAppId", obj, true);
  };
  const displayData = () => {
    data = getFormData(metaInputs);
    saveData();
    const {title, description, author, url, imageUrl, twitter, fbAppId} = data;
    output.innerHTML = 
`<meta name="author" content="${author}">
<meta name="description" content="${description}">

<!-- Optimal Banner Sizes
facebook:   1200 x 630
open graph: 1200 x 627
twitter:    1500 x 500
pinterest:  1000 x 1500
-->

<!-- Schema.org for Google -->
<meta itemprop="name" content="${title}">
<meta itemprop="description" content="${description}">
<meta itemprop="image" content="${imageUrl}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:site" content="@${twitter}">
<meta name="twitter:creator" content="@${twitter}">
<meta name="twitter:image" content="${imageUrl}">

<!-- Open Graph general (Facebook, Pinterest)-->
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${title}">
<meta property="og:type" content="website">
<meta property="og:image" content="${imageUrl}">
${!fbAppId ? "" : `<meta property="fb:app_id" content="${fbAppId}">`}`;
    window.location = "#outputSection";
  }
  const getFormData = elem => {
    const obj = {};
    getDataByColumn(elem, "title", obj);
    getDataByColumn(elem, "description", obj);
    getDataByColumn(elem, "author", obj);
    getDataByColumn(elem, "url", obj);
    getDataByColumn(elem, "imageUrl", obj);
    getDataByColumn(elem, "twitter", obj);
    getDataByColumn(elem, "fbAppId", obj);
    return obj;
  }
  const getDataByColumn = (parentElem, colName, obj) => {
    var input = parentElem.querySelector("." + colName);
    if (input) {
      if (input.getAttribute("type") === "checkbox") {
        obj[colName] = input.checked ? 'TRUE' : 'FALSE';
      }
      else {
        obj[colName] = input.value;
      }
    }
    else {
      obj[colName] = "";
    }
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
  // const clearData = () => {
  //   window.localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
  // }
})();

