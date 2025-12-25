const MAIN_CONTAINER = document.querySelector("main .container");
const HEADER_CONTAINER = document.querySelector("header .container .header__wrapper");
const VIEWPORT_WIDTH = window.innerWidth;
const ITEM_IN_PAGE = 10; // количество треков на странице с десктопа
const MOBILE_LOAD_SIZE = 1; // количество загружаемых треков на странице с мобильного и планшета
const SEEK_STEP = 10; // шаг перемотки c клавиатуры в секундах
const PREV_SECONDS = 10; // шаг перемотки назад. Прошло 10 секунд, тогда при нажатии на кнопку назад трек заиграет с начала

export {
  MAIN_CONTAINER,
  HEADER_CONTAINER,
  VIEWPORT_WIDTH,
  ITEM_IN_PAGE,
  MOBILE_LOAD_SIZE,
  SEEK_STEP,
  PREV_SECONDS
}