// src/context/ModalContext.tsx
import React, { createContext, ReactNode } from 'react';
import { useGetMovie } from '../hooks/useGetMovie';
import { useModal } from '../hooks/useModal';
import { IMovie } from '../types/movie';

interface TrailerContextProps {
  videoKey?: string;
  loading: boolean;
  error?: string;
  isOpen: boolean;
  viewTrailer: (movie: IMovie) => void;
  closeModal: () => void;
}

export const TrailerContext = createContext<TrailerContextProps | undefined>(undefined);

export const TrailerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { videoKey, loading, error, getMovie } = useGetMovie();
  const { isOpen, openModal, closeModal } = useModal();

  const viewTrailer = (movie: IMovie) => {
    getMovie(movie.id);
    openModal();
  };

  return (
    <TrailerContext.Provider
      value={{
        videoKey,
        loading,
        error,
        isOpen,
        viewTrailer,
        closeModal,
      }}
    >
      {children}
    </TrailerContext.Provider>
  );
};
