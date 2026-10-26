import { useReducer, useEffect, useState, useCallback, useMemo } from "react";
import useFetchPhotos from "../hooks/useFetchPhotos";
import {
  favouritesReducer,
  getInitialFavourites,
  STORAGE_KEY,
} from "../reducers/favouritesReducer";
import SearchBar from "./SearchBar";
import PhotoCard from "./PhotoCard";

function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [query, setQuery] = useState("");
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    [],
    getInitialFavourites
  );

  // Save favourites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites]);

  // Stable function reference so memoised children don't re-render needlessly
  const handleSearch = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleToggleFavourite = useCallback((id) => {
    dispatch({ type: "TOGGLE_FAVOURITE", payload: id });
  }, []);

  // Only recompute the filtered list when photos or query change
  const filteredPhotos = useMemo(() => {
    const term = query.trim().toLowerCase();
    return photos.filter((photo) => photo.author.toLowerCase().includes(term));
  }, [photos, query]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-lg bg-red-100 p-4 text-center text-red-700">
        Failed to load photos: {error}
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <SearchBar value={query} onChange={handleSearch} />
      </div>

      {filteredPhotos.length === 0 ? (
        <p className="py-10 text-center text-gray-500">No photos found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isFavourite={favourites.includes(photo.id)}
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;