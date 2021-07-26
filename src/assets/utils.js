
const getDataByColumn = (parentElem, colName, obj) => {
  const input = parentElem.querySelector("." + colName);
  if (input) {
    const isCheckbox = input.getAttribute("type") === "checkbox";
    obj[colName] = isCheckbox ? (input.checked ? 'TRUE' : 'FALSE') : input.value;
  }
  else obj[colName] = "";
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
        trigger(elem, "change");
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