import { el, mount } from "redom"
import { AuthComp } from "../../components/AuthComp"
import { MAIN_CONTAINER } from "../../utils/constants";

export const LoginPage = (): HTMLElement => {
    if (!MAIN_CONTAINER) {
        return (
            el('main')
        );
    }
    MAIN_CONTAINER.innerHTML = ''
    const login = AuthComp('Login')

    return (
        mount(MAIN_CONTAINER, login)
    )
}