import { MyCards } from "../../components/Cards";

export default function CardsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Business Cards</h1>
      <MyCards />
    </div>
  );
}
