import { ErrorLogin, TrackProps } from "./interfaces";

function areTracksArraysEqual(a: TrackProps[], b: TrackProps[]): boolean {
    if (a.length !== b.length) return false;

    return a.every((track, index) => {
        const other = b[index];
        return (
            track.id === other.id &&
            track.title === other.title &&
            track.artist === other.artist &&
            track.album === other.album &&
            track.duration === other.duration &&
            track.size_mb === other.size_mb &&
            track.encoded_audio === other.encoded_audio
        );
    });
}

const getStorageItem = (item: string): string | null => localStorage.getItem(item);
const setStorageItem = (name: string, item: string): void => localStorage.setItem(name, item);
const removeStrorageItem = (name: string): void => localStorage.removeItem(name);
const TOKEN = (): string | null => {
    const token = sessionStorage.getItem("token")
    return token
}

const setCache = (name: string, item: string | TrackProps[]): void => {
    const valueToStore = Array.isArray(item) ? JSON.stringify(item) : item;
    localStorage.setItem(name, valueToStore);
}

// Форматирует секунды в MM:SS (например, 1:30)
function formatSeconds(seconds: number): string {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Переводит API-формат 2.43 → 2 минуты 43 секунды → 163 секунды
function parseApiDuration(apiValue: number): number {
    const minutes = Math.floor(apiValue);
    const seconds = Math.round((apiValue - minutes) * 100); // 0.43 → 43
    return minutes * 60 + seconds;
}

function isErrorLogin(error: unknown): error is ErrorLogin {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as any).message === 'string'
    );
}

function getFavouriteIds(): number[] {
    try {
        const favourites = localStorage.getItem('favourites');
        if (!favourites) return [];
        const tracks = JSON.parse(favourites);
        if (!Array.isArray(tracks)) return [];
        return tracks.map((track: any) => Number(track.id)).filter(id => !isNaN(id));
    } catch (e) {
        console.error('Error reading favourites from localStorage', e);
        return [];
    }
}

function isFavourite(id: number): boolean {
    return getFavouriteIds().includes(id);
}

export {
    areTracksArraysEqual,
    TOKEN,
    getStorageItem,
    setStorageItem,
    removeStrorageItem,
    setCache,
    formatSeconds,
    parseApiDuration,
    isErrorLogin,
    isFavourite
}