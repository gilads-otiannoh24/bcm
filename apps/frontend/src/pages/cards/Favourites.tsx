import { Favourites } from "../../components/Cards/favourites";

const FavouritesPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Favourites</h1>
      <Favourites />
    </div>
  );
};

export default FavouritesPage;
