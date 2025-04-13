import { useParams } from "react-router-dom";
import { CardEditor } from "../../components/Cards";

export default function EditCardPage() {
  const { id } = useParams();

  if (!id) {
    return <div>No Id found</div>;
  }
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Business Card</h1>
      <CardEditor cardId={id} />
    </div>
  );
}
