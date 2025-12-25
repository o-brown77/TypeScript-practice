import { el, setChildren } from "redom";
import { PaginationProps, RenderTracksProps } from "../utils/interfaces";
import Track from "./Tracks/Desktop/TrackDesktopClass";

export function renderDesktopTracksPage({ page, ITEM_IN_PAGE, tracks, container }: RenderTracksProps) {
    const start = (page - 1) * ITEM_IN_PAGE;
    const end = start + ITEM_IN_PAGE;
    const slicedTracks = tracks.slice(start, end); // ← эти 10 шт.

    const trackRows = slicedTracks.map((track, index) => {
        const trackInstance = new Track(
            track.id,
            track.title,
            track.artist,
            track.duration,
            track.album
        );
        return trackInstance.getTrack(index, slicedTracks);
    });

    if (!container) {
        return
    }

    setChildren(container, trackRows);
}


export function buildPaginationButtons({ totalPages, currentPage, paginationElement, renderPage }: PaginationProps): HTMLElement[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1).map(i =>
        el("button", {
            className: currentPage === i
                ? "pagination__btn pagination__btn--active"
                : "pagination__btn",
            onclick: () => {
                const newPage = i;
                renderPage(newPage);
                const updatedPaginationProps: PaginationProps = {
                    totalPages,
                    currentPage: newPage,
                    paginationElement,
                    renderPage
                };
                setChildren(paginationElement, buildPaginationButtons(updatedPaginationProps));  // <<< Используем обновлённые пропы
            }
        }, i.toString())
    );
}