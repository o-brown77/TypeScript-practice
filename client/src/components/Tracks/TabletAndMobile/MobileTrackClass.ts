import { el } from "redom";
import { createHeartIcon, createMoreIcon } from "../../SvgElements";
import { fetchAddFavourite, fetchRemoveFavourite } from "../../../api/fetches";
import { TrackPlayProps, TrackProps } from "../../../utils/interfaces";
import { isFavourite } from "../../../utils/helpers"; // ←

export default class MobileTrack {
    constructor(
        public id: number,
        public title: string,
        public artist: string,
        public duration: number,
        public album: string
    ) { }

    getTrack(currentTrackList: TrackProps[]): HTMLElement {
        const svgHeart = createHeartIcon();
        const svgMore = createMoreIcon();

        const shouldLikeBeActive = isFavourite(this.id);

        return el("li", {
            className: "tracks__item"
        }, [
            el("button", {
                className: "tracks__btn",
                type: "button",
                onclick: async () => {
                    const { PlayTrack } = await import("../../PlayTrack");

                    const trackListForPlayer: TrackPlayProps[] = currentTrackList.map(track => ({
                        id: track.id,
                        title: track.title,
                        artist: track.artist,
                        duration: track.duration,
                        album: track.album,
                        imgPath: `/assets/images/${track.album !== 'single' && track.album !== 'none'
                                ? `albums/${track.album}`
                                : `singles/${track.title}`
                            }.webp`,
                        audioFile: `/assets/tracks/${track.title}.mp3`,
                        currentIndex: 0,
                        trackList: [],
                        isFavourite: isFavourite(track.id)
                    }));

                    trackListForPlayer.forEach((track) => {
                        track.trackList = trackListForPlayer;
                    });

                    // Находим текущий трек
                    const currentIndexInPage = trackListForPlayer.findIndex(t => t.id === this.id);

                    // Запускаем плеер
                    PlayTrack(trackListForPlayer[currentIndexInPage]);
                }
            }, [
                el("img", {
                    className: "tracks__img",
                    src: `/assets/images/${this.album !== 'single' && this.album !== 'none'
                            ? `albums/${this.album}`
                            : `singles/${this.title}`
                        }.webp`,
                    alt: "Картинка трека",
                    loading: "lazy",
                    onerror: function (this: HTMLImageElement) {
                        this.src = "/assets/images/track-placeholder.png";
                        this.classList.add("tracks__img--placeholder");
                        this.onerror = null;
                    }
                }),
                el("div", {
                    className: "tracks__description"
                }, [
                    el("span", {
                        className: "tracks__title",
                        textContent: this.title
                    }),
                    el("span", {
                        className: "tracks__artist",
                        textContent: this.artist
                    })
                ])
            ]),
            el("div", {
                className: "tracks__actions"
            }, [
                el("button", {
                    className: shouldLikeBeActive
                        ? "tracks__like tracks__like--active"
                        : "tracks__like",
                    type: "button",
                    onclick: (event: Event) => {
                        const target = event.target as HTMLElement;
                        const isRemoved = !target.classList.toggle("tracks__like--active");
                        if (isRemoved) {
                            fetchRemoveFavourite(this.id);
                        } else {
                            fetchAddFavourite(this.id);
                        }
                    },
                    ariaLabel: "Добавить в избранное"
                }, [svgHeart]),
                el("button", {
                    className: "tracks__more",
                    type: "button",
                    onclick: () => { },
                    ariaLabel: "Показать больше"
                }, [svgMore])
            ])
        ]);
    }
}