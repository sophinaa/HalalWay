import React, { createContext, useContext, useState } from 'react';

const FavouritesContext = createContext();

export const useFavourites = () => useContext(FavouritesContext);

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);

  const addFavourite = id => {
    setFavourites(prev => [...new Set([...prev, id])]);
  };

  const removeFavourite = id => {
    setFavourites(prev => prev.filter(item => item !== id));
  };

  const isFavourite = id => favourites.includes(id);

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};
