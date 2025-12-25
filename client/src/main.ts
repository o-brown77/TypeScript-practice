import { renderMainApp } from "./api/auth";
import { TOKEN } from "./utils/helpers";
import { RegisterPage } from "./view/pages/RegisterPage";

window.onload = () => {
    const token = TOKEN()
    if (token) {
        renderMainApp()
    } else {
        document.body.classList.add('auth')
        RegisterPage()
    }
}