import { el, RedomElement } from "redom";
import { createRightArrowIcon, createSearchIcon } from "./SvgElements";
import { getStorageItem } from "../utils/helpers";
import { handleInputNormal, handleInputFavourites } from "./Tracks/AddTracksToContainer";
import { VIEWPORT_WIDTH } from "../utils/constants";

export const HeadPanel = (isFavourites: boolean = false): HTMLElement => {
    const searchIcon = createSearchIcon();
    const rightArrowIcon = createRightArrowIcon();
    const userName = getStorageItem('username') || 'Guest';

    const user = (width: number): HTMLElement => {
        if (width <= 900) {
            return el('button', {
                className: 'user',
                type: 'button'
            }, [
                el('div', {
                    className: 'user-info'
                }, [
                    el('div', {
                        className: 'user-avatar'
                    }, [
                        el('span', {
                            className: 'user-char',
                            textContent: userName[0].toUpperCase()
                        })
                    ]),
                    el('p', {
                        className: 'user-name',
                        textContent: userName
                    })
                ]),
            ])
        }
        return el('button', {
            className: 'head-panel__user user',
            type: 'button'
        }, [
            el('div', {
                className: 'user-info'
            }, [
                el('div', {
                    className: 'user-avatar'
                }, [
                    el('span', {
                        className: 'user-char',
                        textContent: userName[0].toUpperCase()
                    })
                ]),
                el('p', {
                    className: 'user-name',
                    textContent: userName
                })
            ]),
            rightArrowIcon
        ])
    }

    if (VIEWPORT_WIDTH <= 900) {
        return (
            user(VIEWPORT_WIDTH)
        )
    } else {
        return el('section', {
            className: 'head-panel'
        }, [
            el('h2', {
                class: 'visually-hidden',
                textContent: 'Верхняя панель с строкой поиска и кнопкой профиля пользователя'
            }),
            el('form', {
                className: 'head-panel__search'
            }, [
                el('label', {
                    className: 'head-panel__search-label',
                    htmlFor: 'search-input'
                }, [
                    searchIcon,
                    el('input', {
                        className: 'head-panel__search-input',
                        type: 'text',
                        placeholder: 'Что будем искать?',
                        id: 'search-input',
                        oninput: isFavourites ? handleInputFavourites : handleInputNormal
                    })
                ])
            ]),
            user(VIEWPORT_WIDTH)
        ]);
    }
};