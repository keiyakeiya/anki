let shelf = JSON.parse(window.localStorage.getItem('shelf')); // notebookを入れる配列、
let clickedBooKIndex = Number(JSON.parse(window.localStorage.getItem('nowBook')));//clickされたshlefのindex
let clickedNum =null;


if(shelf === null){
  shelf = [];
}

class notebook {
  constructor(index, name) {
    this.index       = index;
    this.name        = name
    this.wordList    = [];
    this.meaningList = [];
    this.dataCheck   = 'ankiBook'
  }
}

let homeInitialize = () => {
  for(let i=0; i<shelf.length; i++) {
    addNotebook(i, shelf[i].name);
  }
  if(shelf.length === 0) {
    document.querySelector('#newBook').querySelector('.bookName').querySelector('span').innerHTML = 'BOOK1';
  } else {
    document.querySelector('#newBook').querySelector('.bookName').querySelector('span').innerHTML = 'BOOK'+(shelf[shelf.length-1].index+2);
  }
};

// notebookのインスタンスを生成、shelf配列にappend
let addNewNotebook = () => {
  let newNotebook = null;
  if(shelf.length === 0) {
    newNotebook = new notebook(0, 'BOOK1');
  } else {
    newNotebook = new notebook(shelf[shelf.length-1].index +1, 'BOOK'+(shelf[shelf.length-1].index +2));
  }
  shelf.push(newNotebook);
  window.localStorage.setItem('shelf', JSON.stringify(shelf));
  addNotebook((shelf.length-1), newNotebook.name);
  document.querySelector('#newBook').querySelector('.bookName').querySelector('span').innerHTML = 'BOOK'+ (shelf[shelf.length-1].index+2);
};

let log = (index) => {
  window.localStorage.setItem('nowBook', index);
  clickedNum = index;
};

let exportJsonFunc = (i) => {
  log(i);
  exportJson();
};

let exportJson = () => {
  let exportedBook = shelf[clickedNum];
  const fileName = shelf[clickedNum].name + '.json';
  const data = JSON.stringify(exportedBook);
  const link = document.createElement('a');
  link.href = 'data:text/plain,' + encodeURIComponent(data);
  link.download = fileName;
  link.click();
};

let deleteNote = (index) => {
  if(window.confirm('Delete ' + shelf[index].name + '.')){
      shelf.splice(index, 1);
      window.localStorage.setItem('shelf', JSON.stringify(shelf));
      let notebooks = document.querySelectorAll('.notebook');
      let max = notebooks.length -2;
      for(let i =0; i <=max; i++) {
        notebooks[i].parentNode.removeChild(notebooks[i]);
      }
      homeInitialize();
   }
};
let addNotebook = (index, bookName) => {
  let newNotebook = `
  <div class="notebook">
    <div class="bookName"><a href="./test.html" onclick="log(${index})">${bookName}</a></div>
    <div class="icon"><a href="./edit.html" onclick="log(${index})"><i class="fas fa-pen"></i></a></div>
    <div class="icon"><span onclick="exportJsonFunc(${index})"><i class="fas fa-file-export"></i></span></div>
    <div class="icon" onclick="deleteNote(${index})"><i class="fas fa-trash-alt"></i></div>
  </div>`;
  document.querySelector('#newBook').insertAdjacentHTML('beforebegin',newNotebook);
};

let testInitialize = () => {
  let noteTitle = document.querySelector('#noteTitle');
  // cardUnitのタグを返す関数
  let cardUnit = (word, meaning) => {
    return `
    <div class="cardUnit">
    <div class="word">${word}</div>
    <div class="meaning">${meaning}</div>
    </div>`;
  };
  //notebookのタイトルを初期化
  noteTitle.innerHTML = shelf[clickedBooKIndex].name;
  // cardを初期化
  for(let i =0; i <shelf[clickedBooKIndex].wordList.length; i++) {
    document.querySelector('#cardContainer').insertAdjacentHTML('beforeend',cardUnit(shelf[clickedBooKIndex].wordList[i], shelf[clickedBooKIndex].meaningList[i]));
  }
};

let startSearch = () => {
  let searchInput = document.querySelector('#searchBox');
  searchInput.style.visibility = 'visible';
};

let quitSearch = () => {
  let searchInput = document.querySelector('#searchBox');
  searchInput.style.visibility = 'hidden';
};

let visible = true;

let meaningVisible = () => {
  let eye = document.querySelector('#eyeIcon');
  let meanings = document.querySelectorAll('.meaning');
  if(visible) {
    eye.innerHTML = '<i class="fas fa-eye-slash"></i>';
    visible = !visible;
    for(let i=0; i<meanings.length; i++) {
      meanings[i].style.color = 'rgba(0, 0, 0, 0)';
    }
  } else {
    eye.innerHTML = '<i class="fas fa-eye"></i>';
    visible = !visible;
    for(let i=0; i<meanings.length; i++) {
      meanings[i].style.color = 'inherit';
    }
  }
};

// 編集ページを初期化。
// 引数でnotebookが入っているshelfのindexを受け取る
let editInitialize = () => {
  let noteTitle = document.querySelector('#noteTitle');
  //notebookのタイトルを初期化
  noteTitle.innerHTML = shelf[clickedBooKIndex].name;
  // cardを初期化
  for(let i =0; i <shelf[clickedBooKIndex].wordList.length; i++) {
    addNewWord(shelf[clickedBooKIndex].wordList[i], shelf[clickedBooKIndex].meaningList[i]);
  }
};

let trashCard = (index) => {
  let wordList    = [];
  let meaningList = [];
  let elems = document.querySelectorAll('.cardUnit');
  const max = elems.length;
  for(let i=0; i<max; i++) {
    if(i !== index) {
      wordList.push(document.querySelector('.word').value);
      meaningList.push(document.querySelector('.meaning').value);
    }
    elems[i].parentNode.removeChild(elems[i]);
  }
  for(let i=0; i<wordList.length; i++) {
    addNewWord(wordList[i], meaningList[i]);
  }
};

let addNewWord = (word='', meaning='') => {
  // cardUnitのタグを返す関数
  let cardUnit = (word, meaning) => {
    return `
    <div class="cardUnit">
      <input type="text" class="word" value="${word}">
      <input type="text" class="meaning"value="${meaning}">
      <div class="cardDelete"><i class="fas fa-times"></i></div>
    </div>`;
  };
  document.querySelector('#cardContainer').insertAdjacentHTML('beforeend',cardUnit(word, meaning));
  let cardunitelms = document.querySelectorAll('.cardUnit');
  cardunitelms[cardunitelms.length-1].querySelector('.cardDelete').addEventListener("click", () => trashCard(cardunitelms.length-1),false);
};

let saveNotebook = () => {
  let notebookNum = clickedBooKIndex;
  let inputWord    = document.querySelectorAll('.word');
  let inputMeaning = document.querySelectorAll('.meaning');
  shelf[notebookNum].wordList.length    = 0;
  shelf[notebookNum].meaningList.length = 0;
  for(let i =0; i<inputWord.length;i++) {
    shelf[notebookNum].wordList[i]    = inputWord[i].value;
    shelf[notebookNum].meaningList[i] = inputMeaning[i].value;
  }
  window.localStorage.setItem('shelf', JSON.stringify(shelf));
  tellSave();
};

let tellSave = () => {
  let elem = document.querySelector('#tellSave');
  elem.style.visibility = 'visible';
  elem.style.opacity = 0.9;
  elem.style.top = '15px';
  setTimeout( () => {elem.style.opacity=0; elem.style.top=0;}, 1250);
  setTimeout( () => {elem.style.visibility = 'hidden';}, 1750);
};

let shiftSDetect = (e) => {
  if((e.key === 'S'||e.key === 's') && e.shiftKey){
    saveNotebook();
  }
};

// import
let importJson = () => {
  document.querySelector('#import').addEventListener("change", (e) => {
    let importedBook = null;
    let result = e.target.files[0];
    if(getExt(result.name) !== 'json') {
      alert('Error: Invalid Format.');
      document.querySelector('#import').value = '';
    } else {
      let reader = new FileReader();
      reader.readAsText(result);
      reader.addEventListener("load", () => {
        importedBook = JSON.parse(reader.result);
        if(importedBook.dataCheck !== 'ankiBook') {
          alert('Error: Invalid Format.');
        } else {
          // importedBook.name = importedBook.name + '↓';
          importedBook.index = shelf.length;
          shelf.push(importedBook);
          window.localStorage.setItem('shelf', JSON.stringify(shelf));
          window.location.href = './index.html';
        }
        document.querySelector('#import').value = '';
      },false);
    }
  },false);
};

let getExt = (name) => {
  let pos = name.lastIndexOf('.');
  if (pos === -1) return '';
  return name.slice(pos+1);
};
