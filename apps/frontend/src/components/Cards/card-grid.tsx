"use client";

import {
  Eye,
  Share2,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
  CheckCircle,
} from "lucide-react";
import type { BusinessCard } from "./my-cards";
import { Link } from "react-router-dom";
import { CardPreview } from "./card-preview";

type CardGridProps = {
  cards: BusinessCard[];
  onDelete: (card: BusinessCard) => void;
  onDuplicate: (card: BusinessCard) => void;
  onShare: (cardId: string) => void;
  showCopySuccess: string | null;
};

export function CardGrid({
  cards,
  onDelete,
  onDuplicate,
  onShare,
  showCopySuccess,
}: CardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.id} className="card bg-base-100 shadow-xl">
          <figure className="relative h-48">
            <div className="w-full h-full">
              <CardPreview card={card} />
            </div>
            <div className="absolute top-2 right-2">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-sm btn-circle btn-ghost bg-base-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link to={`/cards/${card.id}`}>
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </li>
                  <li>
                    <Link to={`/cards/${card.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => onShare(card.id)}>
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </li>
                  <li>
                    <button onClick={() => onDuplicate(card)}>
                      <Copy className="h-4 w-4" />
                      Duplicate
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onDelete(card)}
                      className="text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            {card.status === "draft" && (
              <div className="absolute top-2 left-2">
                <span className="badge badge-neutral">Draft</span>
              </div>
            )}
            {card.status === "inactive" && (
              <div className="absolute top-2 left-2">
                <span className="badge badge-warning">Inactive</span>
              </div>
            )}
          </figure>
          <div className="card-body">
            <h2 className="card-title">{card.title}</h2>
            <p className="text-base-content/70">
              {card.template.charAt(0).toUpperCase() + card.template.slice(1)}{" "}
              Template
            </p>

            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1 text-base-content/70" />
                  <span className="text-sm text-base-content/70">
                    {card.views}
                  </span>
                </div>
                <div className="flex items-center">
                  <Share2 className="h-4 w-4 mr-1 text-base-content/70" />
                  <span className="text-sm text-base-content/70">
                    {card.shares}
                  </span>
                </div>
              </div>
              <span className="text-xs text-base-content/50">
                Updated {card.updatedAt}
              </span>
            </div>

            <div className="card-actions justify-between mt-4">
              <a
                href={`/cards/${card.id}/edit`}
                className="btn btn-sm btn-outline flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </a>
              <button
                className="btn btn-sm btn-primary flex-1 relative"
                onClick={() => onShare(card.id)}
              >
                {showCopySuccess === card.id ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
