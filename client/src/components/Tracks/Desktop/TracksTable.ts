import { el } from "redom"
import { createDateIcon, createTimeIcon } from "../../SvgElements"

export const TracksTable = (): HTMLElement => {
    const dateIcon = createDateIcon()
    const timeIcon = createTimeIcon()
    return (
        el('table', {
            className: 'tracks__table'
        }, [
            el('thead', [
                el('tr', [
                    el('th', {
                        textContent: '№'
                    }),
                    el('th', {
                        textContent: 'Название'
                    }),
                    el('th', {
                        textContent: 'Альбом'
                    }),
                    el('th', [
                        dateIcon
                    ]
                    ),
                    el('th', [
                        timeIcon
                    ]),
                ])
            ]),
            el('tbody')
        ]

        )
    )
}