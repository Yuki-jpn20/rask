// polyfill for [].indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(item) {
    for (var i = 0; i < this.length; i++) {
      if (i in this && this[i] === item) return i;
    }
    return -1;
  };
}

function setupAutoCompleteTag(element) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/tags.json", false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
  
  if (xhr.status === 200) {
    var tags = JSON.parse(xhr.responseText);
    window.tag_list = tags.map(function(tag) {
      return tag.name;
    });
  }

  // You'll need to find a suitable replacement for textcomplete in pure JavaScript.
  // This part depends on a specific library or custom code to implement autocompletion.
  // The code below is a simplified placeholder.
  
  element.addEventListener("input", function(e) {
    var term = e.target.value;
    var matches = window.tag_list.filter(function(tag) {
      return tag.indexOf(term) >= 0;
    });
    // Implement your own autocompletion display logic here
    // You may need to create a dropdown or similar UI element for the autocompletion.
  });
}

function setupTagForm(selector) {
  function strToAry(str) {
    str = str.trim();
    if (str === '') {
      return [];
    }
    return str.split(/\s+/);
  }

  function getTags() {
    return strToAry(document.getElementById('tag-names').value);
  }

  function setTags(tagArray) {
    document.getElementById('tag-names').value = tagArray.join(' ');
    return getTags();
  }

  function addTags(tagArray) {
    var ary = getTags();
    tagArray.forEach(function(tag) {
      if (ary.indexOf(tag) === -1) {
        ary.push(tag);
      }
    });
    return setTags(ary);
  }

  function removeTag(tag) {
    var ary = getTags().filter(function(x) {
      return x !== tag.trim();
    });
    return setTags(ary);
  }

  function redisplay() {
    var currentTags = document.getElementById('current-tags');
    currentTags.innerHTML = '';
    getTags().forEach(function(tagName) {
      var tagSpan = document.createElement("span");
      tagSpan.className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
      tagSpan.innerHTML = tagName + " <span id='" + tagName + "'><button class='remove-tag' type='button'><svg class='h-5 w-5 text-white'  width='24' height='24' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z'/><line x1='18' y1='6' x2='6' y2='18' /><line x1='6' y1='6' x2='18' y2='18' /></svg></button></span>";
      currentTags.appendChild(tagSpan);
    });
  }

  document.getElementById('current-tags').addEventListener('click', function(e) {
    if (e.target.parentNode && e.target.parentNode.classList.contains('remove-tag')) {
      removeTag(e.target.parentNode.parentNode.id);
      redisplay();
    }
  });

  document.getElementById('tag-add-button').addEventListener('click', function(e) {
    var tagArray = strToAry(document.getElementById('tag-name').value);
    addTags(tagArray);
    document.getElementById('tag-name').value = '';
    redisplay();
  });

  document.getElementById('tag-name').addEventListener('keypress', function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  });

  if (document.getElementById('tag-names').value !== null) {
    redisplay();
  }

  setupAutoCompleteTag(document.getElementById('tag-name'));
}

function ready() {
  setupTagForm('#tag-form');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}
