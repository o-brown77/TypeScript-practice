import { el } from "redom"
import { createUserCheckIcon, createCloseIcon, createErrorIcon } from "../components/SvgElements"

export const modalAfterRegister = (): HTMLElement => {
    const checkIcon = createUserCheckIcon()
    const closeIcon = createCloseIcon()

    document.body.classList.add('modal-after-register-body')

    const modal = el('div', {
        className: 'modal modal-after-register'
    }, [
        checkIcon,
        el('div', {
            className: 'modal-after-register__description'
        }, [
            el('h3', {
                className: 'modal-after-register__title',
                textContent: 'Вы успешно зарегистрировались!'
            }),
            el('p', {
                className: 'modal-after-register__text',
                textContent: 'Теперь вы можете войти в свой аккаунт'
            })
        ]),
        el('button', {
            className: 'modal-after-register__close',
            type: 'button',
            onclick: () => {
                const modalElement = document.querySelector('.modal-after-register') as HTMLElement;
                modalElement.remove();
                document.body.classList.remove('modal-after-register-body')
            }
        }, [
            closeIcon
        ])
    ])

    setTimeout(() => {
        const handler = (e: MouseEvent) => {
            if (!document.querySelector('.modal-after-register')?.contains(e.target as Node)) {
                modal.remove();
                document.body.classList.remove('modal-after-register-body');
                document.removeEventListener('click', handler);
            }
        };
        document.addEventListener('click', handler);
    }, 0);

    return modal
}

export const modalErrorPlayTrack = (errorCode: string): HTMLElement => {
    const errorIcon = createErrorIcon();

    document.body.classList.add('modal-error-play-track-body');

    const modal = el('div', {
        className: 'modal modal-error-play-track'
    }, [
        el('div', {
            className: 'modal-error-play-track__container'
        }, [
            el('div', {
                className: 'modal-error-play-track__header'
            }, [
                el('div', {
                    className: 'modal-error-play-track__icon'
                }, [errorIcon]),
                el('h2', {
                    className: 'modal-error-play-track__title',
                    textContent: 'Ошибка воспроизведения'
                })
            ]),
            el('div', {
                className: 'modal-error-play-track__body'
            }, [
                el('p', {
                    className: 'modal-error-play-track__text',
                    textContent: 'Не удается воспроизвести выбранный трек. Это может быть связано с проблемой сетевого подключения, повреждением файла или неподдерживаемым аудиоформатом.'
                }),
                el('div', {
                    className: 'modal-error-play-track__details'
                }, [
                    el('span', {
                        className: 'modal-error-play-track__error-code',
                        textContent: `Error Code: ${errorCode}`
                    })
                ])
            ]),
            el('div', {
                className: 'modal-error-play-track__footer'
            }, [
                el('button', {
                    className: 'modal-error-play-track__close',
                    textContent: 'Закрыть',
                    onclick: () => {
                        modal.remove();
                        document.body.classList.remove('modal-error-play-track-body');
                    }
                })
            ])
        ])
    ]);

    setTimeout(() => {
        const handler = (e: MouseEvent) => {
            if (!document.querySelector('.modal-error-play-track__container')?.contains(e.target as Node)) {
                modal.remove();
                document.body.classList.remove('modal-error-play-track-body');
                document.removeEventListener('click', handler);
            }
        };
        document.addEventListener('click', handler);
    }, 0);

    return modal;
};
