const book = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    submitForm = document.getElementById("inputBook").reset();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// input data
function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const bookIsCompleted = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    bookIsCompleted
  );
  book.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
// end input data

//   input html
function listBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textBookYear = document.createElement("p");
  textBookYear.innerText = `Tahun: ${bookObject.year}`;

  const deletButton = document.createElement("button");
  deletButton.innerHTML = "Hapus Buku";
  deletButton.setAttribute("id", "btnDelet");
  deletButton.addEventListener("click", function () {
    deletTaskFromCompleted(bookObject.id);
  });

  const finishButton = document.createElement("button");
  finishButton.innerHTML = "Sudah Selesai Baca";
  finishButton.setAttribute("id", "btnFinish");
  finishButton.addEventListener("click", function () {
    addTaskToCompleted(bookObject.id);
  });

  const undoButton = document.createElement("button");
  undoButton.innerHTML = "Belum Selesai Baca";
  undoButton.setAttribute("id", "btnUndo");
  undoButton.addEventListener("click", function () {
    undoTaskFromCompleted(bookObject.id);
  });

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");

  const container = document.createElement("div");
  container.classList.add("book_shelf");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isCompleted == true) {
    textContainer.append(
      textTitle,
      textAuthor,
      textBookYear,
      deletButton,
      undoButton
    );
    console.log(bookObject.isCompleted);
  } else {
    textContainer.append(
      textTitle,
      textAuthor,
      textBookYear,
      deletButton,
      finishButton
    );
  }

  return container;
}
//  end input html

// mencari id buku
function findBook(bookId) {
  for (const bookItem of book) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}
// end mencari id buku

// fungsi finish
function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
// end fungsi finish

// fungsi Delet
function deletTaskFromCompleted(bookId) {
  const bookTarget = findbookIndex(bookId);

  if (bookTarget === -1) return;

  book.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findbookIndex(bookId) {
  for (const index in book) {
    if (book[index].id === bookId) {
      return index;
    }
  }

  return -1;
}
// End fungsi Delet

//  fungsi Undo
function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
// end fungsi undo

// fungsi save data
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(book);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
  alert("Data berhasil Disimpan");
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const books of data) {
      book.push(books);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
// end save data

// fungsi search
const search = () =>{
  const searchBox = document.getElementById('searchBookTitle').value.toUpperCase();
  const bookList = document.getElementById('bookList');
  const buku = document.querySelectorAll('.inner');
  const judulBuku = document.getElementsByTagName('h3')

  for(var i=0; i< judulBuku.length; i++){
    let match = buku[i].getElementsByTagName('h3')[0];

    if(match){
      let textValue = match.textContent || match.innerHTML

      if(textValue.toUpperCase().indexOf(searchBox) > -1){
        buku[i].style.display="";
      }else{
        buku[i].style.display="none"; 
      }
    }
  }
}
// end fungsi sarch


// render
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completeBookshelfList");
  completedBookList.innerHTML = "";

  for (const bookItem of book) {
    const bookElement = listBook(bookItem);
    if (!bookItem.isCompleted) uncompletedBookList.append(bookElement);
    else completedBookList.append(bookElement);
  }
});
// end render
