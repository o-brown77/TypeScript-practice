import { el, mount } from "redom"
import { AuthComp } from "../../components/AuthComp"
import { MAIN_CONTAINER } from "../../utils/constants";

export const RegisterPage = (): HTMLElement => {
    if (!MAIN_CONTAINER) {
        return (
            el('main')
        );
    }
    MAIN_CONTAINER.innerHTML = ''
    const register = AuthComp('Register')

    return (
        mount(MAIN_CONTAINER, register)
    )
}