let searchFound = document.querySelector(".search__found"); //в этот список будут генерироваться элементы после поиска
//на него же я вешаю обработчик события клика, буду добавлять  по клику реппозиторий в список добавленных репозиториев
let addRepository = document.querySelector(".add__list"); //список добавленных репозиториев
let addDiv = document.querySelector(".add");

searchFound.addEventListener("click", function (event) {
  addDiv.classList.remove("add--novisible"); //если список не пуст, то див со списком должен быть виден
  addRepository.append(event.target);
});
addRepository.addEventListener("click", function (event) {
  //добавила обработчик кликов по списку добав.репозит.
  if (event.target.className === "button") {
    //если кликнули по кнопке закрыть - удаляю ближайший к кнопке li
    let elem = event.target.closest("li");
    addRepository.removeChild(elem);
    if (addRepository.childElementCount === 0) {
      // если список пуст, то нужно див снова спрятать
      addDiv.classList.add("add--novisible");
    }
  }
});

const debounce = (fn, debounceTime) => {
  //нужен дебонс, чтобы данные не отправлялись слишком часто
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};

let searchValue = document.querySelector(".search__input");
function checkValue() {
  if (searchValue.value == "") {
    searchFound.innerHTML = ""; //если поле ввода пустое - удаляем список найденного и выходим из функции
    return;
  }
  //функция для проверки того, что ввел пользователь в форму поиска
  searchRepository(searchValue.value);
}
searchValue.oninput = debounce(checkValue, 500); //на событие input запускается функция, обернута в дебонс для задержки

async function searchRepository(searchName) {
  //функция с запросом на гит
  let response = await fetch(
    "https://api.github.com/search/repositories?q=" +
      searchName +
      "&per_page=5",
    {}
  );
  let result = await response.json();
  let arraySearchedNames = result.items;
  let listElem = "";
  if (arraySearchedNames.length > 1) {
    for (let obj of arraySearchedNames) {
      listElem += `<li><span class="name">Name: </span>${obj.name}<div class = "owner">Owner: ${obj.owner.login}</div><div class = "stars">Stars: ${obj["stargazers_count"]}</div><div class="button"></div></li>`;
    }
  }
  searchFound.innerHTML = listElem;
}
