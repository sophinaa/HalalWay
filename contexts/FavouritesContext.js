import React, { createContext, useContext, useState } from 'react';

const defaultValue = {
  favourites: [],
  addFavourite: () => {},
  removeFavourite: () => {},
  isFavourite: () => false,
};

const FavouritesContext = createContext(defaultValue);

export const useFavourites = () => useContext(FavouritesContext);

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);

  const addFavourite = id => {
    if (!id) return;
    setFavourites(prev => [...new Set([...prev, id])]);
  };

  const removeFavourite = id => {
    if (!id) return;
    setFavourites(prev => prev.filter(item => item !== id));
  };

  const isFavourite = id => {
    if (!id || !Array.isArray(favourites)) {
      return false;
    }
    return favourites.includes(id);
  };

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export default FavouritesContext;
