import { CardCreator } from "../../components/Cards";

export default function CreateCardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Business Card</h1>
      <CardCreator />
    </div>
  );
}
