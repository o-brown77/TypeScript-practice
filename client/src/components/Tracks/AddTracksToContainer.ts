import { el, setChildren } from "redom";
import { fetchGetFavourites, fetchTracks } from "../../api/fetches";
import { buildPaginationButtons, renderDesktopTracksPage } from "../PaginationAndRender";
import { TrackProps, TracksPageProps } from "../../utils/interfaces";
import { VIEWPORT_WIDTH, ITEM_IN_PAGE, MOBILE_LOAD_SIZE } from "../../utils/constants";
import { setCache, getStorageItem } from "../../utils/helpers";
import MobileTrack from "./TabletAndMobile/MobileTrackClass";
import { areTracksArraysEqual } from "../../utils/helpers";

let currentPage = 1;
const paginationElement = el("div", { class: "pagination" });
let tracks: TrackProps[] = [];
let filteredTracks = [] as TrackProps[];

let mobileObserver: IntersectionObserver | null = null;

function handleSearch(event: Event, isFavourites: boolean) {
    if (event.target instanceof HTMLInputElement) {
        if (tracks.length === 0) return;
        const inputValue = event.target.value.toLowerCase();
        filteredTracks = tracks.filter(track =>
            track.title.toLowerCase().includes(inputValue)
        );

        if (VIEWPORT_WIDTH < 1100) {
            const ul = document.querySelector("ul");
            if (ul) {
                renderMobileTracks(filteredTracks, ul);
            }
        } else {
            const tbody = document.querySelector("tbody");
            if (tbody) {
                currentPage = 1;
                renderDesktopTracksPage({
                    page: currentPage,
                    ITEM_IN_PAGE,
                    tracks: filteredTracks,
                    container: tbody,
                });
                updatePagination(isFavourites);
            }
        }
    }
}

export const handleInputNormal = (event: Event) => handleSearch(event, false);
export const handleInputFavourites = (event: Event) => handleSearch(event, true);

function updatePagination(isFavourites: boolean) {
    const section = document.querySelector(".tracks");
    const tbody = document.querySelector("tbody");
    if (!section || !tbody) return;

    const totalPages = Math.ceil(filteredTracks.length / ITEM_IN_PAGE);
    if (totalPages <= 1) {
        if (paginationElement.isConnected) {
            paginationElement.remove();
        }
        return;
    }

    setChildren(paginationElement, buildPaginationButtons({
        totalPages,
        currentPage,
        paginationElement,
        renderPage: (page: number) => {
            currentPage = page;
            renderDesktopTracksPage({
                page,
                ITEM_IN_PAGE,
                tracks: filteredTracks,
                container: tbody
            });
            updatePagination(isFavourites);
        }
    }));
    
    if (!paginationElement.isConnected) {
        section.appendChild(paginationElement);
    }
}

function renderMobileTracks(tracks: TrackProps[], container: HTMLElement) {
    if (mobileObserver) {
        mobileObserver.disconnect();
        mobileObserver = null;
    }

    setChildren(container, []);
    const initialTracks = tracks.slice(0, MOBILE_LOAD_SIZE);
    const initialElements = initialTracks.map((track) => {
        const music = new MobileTrack(track.id, track.title, track.artist, track.duration, track.album);
        return music.getTrack(tracks); // играет те, что в списке из сервера, а не те, что прогрузились
    });
    initialElements.forEach(el => container.appendChild(el));

    if (tracks.length > MOBILE_LOAD_SIZE) {
        addLazyLoadingObserver(container, tracks, MOBILE_LOAD_SIZE);
    }
}

function addLazyLoadingObserver(container: HTMLElement, allTracks: TrackProps[], nextIndex: number) {
    const lastItem = container.lastElementChild as HTMLElement;
    if (!lastItem) return;

    mobileObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (nextIndex < allTracks.length) {
                    const nextTrack = allTracks[nextIndex];
                    const music = new MobileTrack(nextTrack.id, nextTrack.title, nextTrack.artist, nextTrack.duration, nextTrack.album);
                    const nextElement = music.getTrack(allTracks);
                    container.appendChild(nextElement);

                    if (nextIndex + 1 < allTracks.length) {
                        mobileObserver!.disconnect();
                        addLazyLoadingObserver(container, allTracks, nextIndex + 1);
                    } else {
                        mobileObserver!.disconnect();
                        mobileObserver = null;
                    }
                }
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px 100px 0px',
        threshold: 0.1
    });

    mobileObserver.observe(lastItem);
}
// Функция инициализации для десктопной версии (с пагинацией, для viewport > 1100)
function initializeDesktop(container: HTMLElement, isFavourites: boolean) {
    const cacheKey = isFavourites ? 'favourites' : 'tracks';
    const cachedTracksData = getStorageItem(cacheKey);

    const fetchPromise = isFavourites ? fetchGetFavourites() : fetchTracks();

    fetchPromise
        .then((fetchedTracks) => {
            const serverTracks = fetchedTracks;

            if (cachedTracksData) {
                try {
                    const cachedTracks = JSON.parse(cachedTracksData) as TrackProps[];

                    const isCacheValid = areTracksArraysEqual(serverTracks, cachedTracks);

                    if (isCacheValid) {
                        console.log(`Кэш "${cacheKey}" валиден и совпадает с сервером`);
                    } else {
                        console.warn(`Кэш "${cacheKey}" устарел или повреждён. Обновляем.`);
                        setCache(cacheKey, serverTracks);
                    }

                    // Всегда используем данные с сервера (или свежие)
                    tracks = serverTracks;
                    filteredTracks = tracks;
                } catch (e) {
                    console.error(`Ошибка парсинга кэша "${cacheKey}":`, e);
                    tracks = serverTracks;
                    filteredTracks = tracks;
                    setCache(cacheKey, tracks); // Восстанавливаем кэш
                }
            } else {
                console.log(`Кэш "${cacheKey}" отсутствует. Используем данные с сервера.`);
                tracks = serverTracks;
                filteredTracks = tracks;
                setCache(cacheKey, tracks);
            }

            renderDesktopTracksPage({
                page: currentPage,
                ITEM_IN_PAGE,
                tracks: filteredTracks,
                container
            });
            updatePagination(isFavourites);
        })
        .catch((error) => {
            // На случай, если сервер не отвечает — используем кэш
            if (cachedTracksData) {
                console.warn(`Сервер недоступен. Используем кэш "${cacheKey}".`);
                try {
                    tracks = JSON.parse(cachedTracksData) as TrackProps[];
                    filteredTracks = tracks;
                    renderDesktopTracksPage({
                        page: currentPage,
                        ITEM_IN_PAGE,
                        tracks: filteredTracks,
                        container
                    });
                    updatePagination(isFavourites);
                    return;
                } catch (e) {
                    console.error("Кэш тоже нерабочий. Что за день такой, куда разрабы смотрят?");
                }
            }
            console.error("Fetch error:", error);
        });
}

// Функция инициализации для мобильной версии (все треки без пагинации, для viewport <= 1100)
function initializeMobile(container: HTMLElement, isFavourites: boolean) {
    const cacheKey = isFavourites ? 'favourites' : 'tracks';
    const cachedTracksData = getStorageItem(cacheKey);

    const fetchPromise = isFavourites ? fetchGetFavourites() : fetchTracks();

    fetchPromise
        .then((fetchedTracks) => {
            const serverTracks = fetchedTracks;

            if (cachedTracksData) {
                try {
                    const cachedTracks = JSON.parse(cachedTracksData) as TrackProps[];

                    const isCacheValid = areTracksArraysEqual(serverTracks, cachedTracks);

                    if (isCacheValid) {
                        console.log(`Кэш "${cacheKey}" валиден и совпадает с сервером (мобильная версия)`);
                    } else {
                        console.warn(`Кэш "${cacheKey}" устарел или повреждён. Обновляем. (мобильная версия)`);
                        setCache(cacheKey, serverTracks);
                    }

                    // Всегда используем свежие данные
                    tracks = serverTracks;
                    filteredTracks = tracks;
                } catch (e) {
                    console.error(`Ошибка парсинга кэша "${cacheKey}" (мобильная):`, e);
                    tracks = serverTracks;
                    filteredTracks = tracks;
                    setCache(cacheKey, tracks); // Восстанавливаем
                }
            } else {
                console.log(`Кэш "${cacheKey}" отсутствует (мобильная). Используем данные с сервера.`);
                tracks = serverTracks;
                filteredTracks = tracks;
                setCache(cacheKey, tracks);
            }

            renderMobileTracks(filteredTracks, container);
        })
        .catch((error) => {
            // На случай, если сервер не отвечает — используем кэш
            if (cachedTracksData) {
                console.warn(`Сервер недоступен. Используем кэш "${cacheKey}" (мобильная).`);
                try {
                    tracks = JSON.parse(cachedTracksData) as TrackProps[];
                    filteredTracks = tracks;
                    renderMobileTracks(filteredTracks, container);
                    return;
                } catch (e) {
                    console.error("Кэш тоже битый (мобильная).");
                }
            }
            console.error("Fetch error (mobile):", error);
        });
}


export function AddTracksToContainer({ isFavourites }: TracksPageProps) {
    const section = document.querySelector(".tracks");
    if (!section) return;

    if (VIEWPORT_WIDTH > 1100) {
        const tbody = document.querySelector("tbody");
        if (tbody) {
            initializeDesktop(tbody, isFavourites);
        }
    } else {
        const ul = document.querySelector("ul");
        if (ul) {
            initializeMobile(ul, isFavourites);
        }
    }
}