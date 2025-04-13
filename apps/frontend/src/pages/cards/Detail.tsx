import { useParams } from "react-router-dom";
import { CardDetail } from "../../components/Cards";

export default function CardDetailPage() {
  const { id } = useParams();

  if (!id) {
    return <div>No Id found</div>;
  }
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Business Card Details</h1>
      <CardDetail cardId={id} />
    </div>
  );
}
