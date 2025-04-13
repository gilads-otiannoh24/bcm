import { Plus } from "lucide-react";
import React from "react";

const MyCards: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Business Cards</h1>
        <button className="btn btn-primary" onClick={() => {}}>
          <Plus className="w-4 h-4" /> Add Card
        </button>
      </div>
    </div>
  );
};

export default MyCards;
