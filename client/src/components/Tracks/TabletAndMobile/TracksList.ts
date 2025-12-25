import { el } from "redom"

export const TracksList = (): HTMLUListElement => {
    return (
        el('ul', {
            className: 'tracks__list'
        })
    )
}