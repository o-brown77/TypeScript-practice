import { el } from "redom";
import { createAudioCompNavIcon, createMusicNoteIcon } from "./SvgElements";
import { TracksPage } from "../view/pages/TracksPage";
import { MAIN_CONTAINER, VIEWPORT_WIDTH } from "../utils/constants";

export const NavigationMenu = (): HTMLElement => {
    const musicNoteIcon1 = createMusicNoteIcon();
    const musicNoteIcon2 = createMusicNoteIcon();
    const audioCompIcon = createAudioCompNavIcon();

    // --- Удаление ТОЛЬКО контента страницы ---
    const removePreviousContent = () => {
        if (!MAIN_CONTAINER) return;

        const tracksPage = MAIN_CONTAINER.querySelector('.tracks');
        const favouritesPage = MAIN_CONTAINER.querySelector('.favourites'); // исправил с .is-favourites

        if (tracksPage) tracksPage.remove();
        if (favouritesPage) favouritesPage.remove();
    };

    // --- Активация кнопки ---
    const setActiveLink = (button: HTMLElement) => {
        document.querySelectorAll('.nav__link').forEach(link => {
            (link as HTMLElement).classList.remove('nav__link--active');
        });
        button.classList.add('nav__link--active');
    };

    // --- Сохраняем ссылку на кнопку "Аудиокомпозиции", чтобы активировать её по умолчанию ---
    let audioCompButton: HTMLElement | null = null;

    // --- Создание кнопки ---
    const createNavButton = (
        text: string,
        isFavourites: boolean,
        icon: SVGElement | null = null,
        makeActive = false  // ← новый параметр: сделать активной сразу
    ) => {
        const button = el('button', {
            className: 'nav__link',
            type: 'button',
            onclick: (event: Event) => {
                const target = event.target as HTMLElement;
                const btn = target.closest('.nav__link');

                if (!btn || !MAIN_CONTAINER) return;

                removePreviousContent();
                TracksPage({ isFavourites });
                setActiveLink(btn as HTMLElement);
            }
        }, [
            icon ? icon : null,
            el('span', {
                className: 'nav__link-text',
                textContent: text
            })
        ].filter(Boolean)) as HTMLElement;

        // Запоминаем кнопку "Аудиокомпозиции"
        if (text === 'Аудиокомпозиции') {
            audioCompButton = button;
        }

        // Если нужно — сразу ставим активный класс
        if (makeActive) {
            button.classList.add('nav__link--active');
        }

        return button;
    };

    // --- Рендерим меню в зависимости от VIEWPORT_WIDTH ---
    let menu: HTMLElement;

    if (VIEWPORT_WIDTH <= 900) {
        menu = el('div', { className: 'nav__menu' }, [
            createNavButton('Аудиокомпозиции', false, audioCompIcon, true),  // ← активна
            createNavButton('Избранное', true, null, false)
        ]);
    } else {
        menu = el('nav', { className: 'nav__menu' }, [
            createNavButton('Избранное', true, musicNoteIcon1, false),
            createNavButton('Аудиокомпозиции', false, musicNoteIcon2, true) // ← активна
        ]);
    }

    // --- Инициализация: сразу активируем "Аудиокомпозиции" ---
    // И запускаем её страницу при первом открытии
    setTimeout(() => {
        if (audioCompButton && !document.querySelector('.tracks') && !document.querySelector('.favourites')) {
            TracksPage({ isFavourites: false });
            setActiveLink(audioCompButton);
        }
    }, 0);

    return menu;
};
