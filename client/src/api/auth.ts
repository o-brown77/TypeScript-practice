import { fetchLogin, fetchRegister } from "./fetches";
import { MAIN_CONTAINER } from "../utils/constants";
import { isErrorLogin, setStorageItem } from "../utils/helpers";
import { UserSchema } from "../utils/interfaces";
import { LoginPage } from "../view/pages/LoginPage";
import { MainFrame } from "../view/pages/MainFrame";
import { TracksPage } from "../view/pages/TracksPage";
import { modalAfterRegister, modalErrorPlayTrack } from "../utils/modals";
import { el, mount } from "redom";

const validateAndClearErrors = (nameInput: HTMLInputElement, passwordInput: HTMLInputElement) => {
    const nameDiv = nameInput?.parentElement as HTMLElement;
    const passwordDiv = passwordInput?.parentElement as HTMLElement;

    const allCustomInputs = document.querySelectorAll('.custom-input');
    allCustomInputs.forEach(div => {
        div.classList.remove('custom-input--error');
        const errorSpan = div.querySelector('.custom-input__error') as HTMLElement;
        if (errorSpan) errorSpan.textContent = '';
    });

    const nameValue = nameInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    const validData = { name: nameValue, password: passwordValue };
    const validation = UserSchema.safeParse(validData);

    if (!validation.success) {
        validation.error.issues.forEach(issue => {
            const field = issue.path[0] as string;
            let targetDiv: HTMLElement | null = null;
            let errorSpan: HTMLElement | null = null;

            if (field === 'name') {
                targetDiv = nameDiv;
            } else if (field === 'password') {
                targetDiv = passwordDiv;
            }

            if (targetDiv) {
                targetDiv.classList.add('custom-input--error');
                errorSpan = targetDiv.querySelector('.custom-input__error') as HTMLElement;
                if (errorSpan) {
                    errorSpan.textContent = issue.message;
                }
            }
        });
        throw new Error('Validation failed');
    }

    return { nameValue, passwordValue };
};

export const renderMainApp = () => {
    if (MAIN_CONTAINER) {
        MAIN_CONTAINER.innerHTML = '';
    }
    document.body.className = '';
    MainFrame();
    TracksPage({ isFavourites: false });
};

export const register = async (event: Event) => {
    event.preventDefault();

    const nameInput = document.getElementById('name') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    try {
        validateAndClearErrors(nameInput, passwordInput);

        await fetchRegister(nameInput.value.trim(), passwordInput.value.trim())
        setStorageItem('username', nameInput.value.trim())

        LoginPage()
        if (MAIN_CONTAINER) {
            mount(MAIN_CONTAINER, modalAfterRegister())
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
};

export const login = async (event: Event) => {
    event.preventDefault();

    const nameInput = document.getElementById('name') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    try {
        validateAndClearErrors(nameInput, passwordInput);
        const data = await fetchLogin(nameInput.value.trim(), passwordInput.value.trim());

        sessionStorage.setItem('token', data.token)
        setStorageItem('username', nameInput.value.trim())

        renderMainApp();

    } catch (error) {
        if (isErrorLogin(error)) {
            if (error.message == '{"message":"произошла ошибка при авторизации - неверные данные"}' && !document.querySelector('.login__error')) {
                const par = el('p', {
                    className: 'login__error',
                    textContent: 'Произошла ошибка при авторизации - неверные данные'
                })
                passwordInput.parentElement?.after(par)
            }
        }
    }
};