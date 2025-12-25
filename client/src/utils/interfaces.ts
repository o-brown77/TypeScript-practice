import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().min(1, 'Поле обязательно для заполнения'),
  password: z.string().min(8, 'Пароль должен содержать не менее 8 символов'),
});

export interface TrackProps {
  id: number;
  title: string;
  artist: string;
  duration: number;
  album: string;
  size_mb: number;
  encoded_audio: string;
}

export interface RenderTracksProps {
  page: number;
  ITEM_IN_PAGE: number;
  tracks: TrackProps[];
  container: HTMLTableSectionElement | HTMLElement | null;
}

export interface ResponseTrackProps extends Array<TrackProps> { }

export interface LoginProps {
  message: string;
  token: string;
}

export interface ErrorLogin {
  message: string;
}

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  paginationElement: HTMLElement;
  renderPage: (page: number) => void;
}

export interface TracksPageProps {
  isFavourites: boolean;
}

export interface TrackData {
  id: number;
  title: string;
  artist: string;
  duration: number;
  album?: string;
  imgPath: string;
  audioFile: string;
}

export interface TrackPlayProps extends TrackData {
  isFavourite: boolean;
  trackList: TrackPlayProps[];
  isShuffle?: boolean;
  isRepeat?: boolean;
}