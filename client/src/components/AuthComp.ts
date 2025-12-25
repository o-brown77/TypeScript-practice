import { el } from "redom";
import { LoginPage } from "../view/pages/LoginPage";
import { RegisterPage } from "../view/pages/RegisterPage";
import { login, register } from "../api/auth";

export const AuthComp = (context: 'Register' | 'Login'): HTMLElement => {
    const lowerCaseContext = context.toLowerCase();

    return (
        el('section', {
            className: lowerCaseContext,
        }, [
            el('form', {
                className: `${lowerCaseContext}__form`,
                action: '#',
            }, [
                el('legend', {
                    textContent: lowerCaseContext === 'register' ? 'Регистрация' : 'Войти',
                    className: `${lowerCaseContext}__heading`
                }),
                el('div', {
                    className: 'custom-input',
                }, [
                    el('input', {
                        className: 'custom-input__field',
                        type: 'text',
                        id: 'name'
                    }),
                    el('label', {
                        className: 'custom-input__label',
                        htmlFor: 'name',
                        textContent: 'Имя'
                    }),
                    el('span', {
                        className: 'custom-input__error',
                        textContent: ''
                    })
                ]),
                el('div', {
                    className: 'custom-input',
                }, [
                    el('input', {
                        className: 'custom-input__field',
                        type: 'password',
                        id: 'password'
                    }),
                    el('label', {
                        className: 'custom-input__label',
                        htmlFor: 'password',
                        textContent: 'Пароль'
                    }),
                    el('span', {
                        className: 'custom-input__error',
                        textContent: ''
                    })
                ]),
                el('button', {
                    className: `${lowerCaseContext}__btn`,
                    type: 'submit',
                    textContent: lowerCaseContext === 'register' ? 'Зарегистрироваться' : 'Войти',

                    onclick: (event: Event) => {
                        if (lowerCaseContext === 'register') {
                            register(event)
                        } else {
                            login(event)
                        }
                    }
                })
            ]),
            el('div', {
                className: `${lowerCaseContext}__description`,
            }, [
                el('span', {
                    className: `${lowerCaseContext}__text`,
                    textContent: lowerCaseContext === 'register' ? 'Уже есть аккаунт? ' : 'Еще нет аккаунта? '
                }),
                el('button', {
                    className: `${lowerCaseContext}__link`,
                    type: 'button',
                    textContent: lowerCaseContext === 'register' ? 'Войти' : 'Регистрация',
                    onclick: () => {
                        if (lowerCaseContext == 'register') {
                            LoginPage()
                            return
                        } else {
                            RegisterPage()
                        }
                    }
                })
            ]),
        ]));
};
