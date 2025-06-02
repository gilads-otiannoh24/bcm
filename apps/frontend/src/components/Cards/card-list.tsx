"use client";

import {
  Eye,
  Share2,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  Heart,
  HeartOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CardPreview } from "./card-preview";
import { BusinessCard } from "@shared/types";
import { useAuth } from "../../context/AuthContext";

type CardListProps = {
  cards: BusinessCard[];
  onDelete: (card: BusinessCard) => void;
  onDuplicate: (card: BusinessCard) => void;
  onFavourite: (card: BusinessCard) => void;
  onRemoveFromFavourite?: (card: BusinessCard) => void;
  onShare: (cardId: string) => void;
  showCopySuccess: string | null;
};

export function CardList({
  cards,
  onDelete,
  onDuplicate,
  onFavourite,
  onShare,
  showCopySuccess,
  onRemoveFromFavourite,
}: CardListProps) {
  const { user } = useAuth();
  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="card card-side bg-base-100 shadow-xl transform duration-200 hover:scale-102"
        >
          <figure className="w-32 md:w-48 h-full">
            <div className="w-full h-full">
              <CardPreview card={card} />
            </div>
          </figure>
          <div className="card-body p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div>
                <h2 className="card-title">{card.title}</h2>
                <p className="text-base-content/70">
                  {card.template.charAt(0).toUpperCase() +
                    card.template.slice(1)}{" "}
                  Template
                </p>
              </div>
              <div className="flex items-center gap-2">
                {card.status === "draft" && (
                  <span className="badge badge-neutral">Draft</span>
                )}
                {card.status === "inactive" && (
                  <span className="badge badge-warning">Inactive</span>
                )}
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1 text-base-content/70" />
                  <span className="text-sm text-base-content/70 mr-2">
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
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 gap-2">
              <span className="text-xs text-base-content/50">
                Updated {card.updatedAt}
              </span>

              <div className="flex gap-2">
                <Link to={`/cards/${card.id}`} className="btn btn-sm btn-ghost">
                  <Eye className="h-4 w-4" />
                  <span className="hidden md:inline ml-1">View</span>
                </Link>
                {user &&
                  (user.role === "admin" || user.id === card.owner?.id) && (
                    <>
                      <Link
                        to={`/cards/${card.id}/edit`}
                        className="btn btn-sm btn-outline"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="hidden md:inline ml-1">Edit</span>
                      </Link>
                    </>
                  )}

                <button
                  className="btn btn-sm btn-primary relative"
                  onClick={() => onShare(card.id)}
                >
                  {showCopySuccess === card.id ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span className="hidden md:inline ml-1">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      <span className="hidden md:inline ml-1">Share</span>
                    </>
                  )}
                </button>

                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-sm btn-ghost"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    {window.location.pathname !== "/favourites" && (
                      <li>
                        <button onClick={() => onFavourite(card)}>
                          <Heart className="h-4 w-4" />
                          Add to favourites
                        </button>
                      </li>
                    )}

                    {window.location.pathname === "/favourites" && (
                      <li>
                        <button
                          onClick={() => {
                            onRemoveFromFavourite
                              ? onRemoveFromFavourite(card)
                              : null;
                          }}
                        >
                          <HeartOff className="h-4 w-4" />
                          Remove from favourites
                        </button>
                      </li>
                    )}

                    {user &&
                      (user.role === "admin" || user.id === card.owner?.id) && (
                        <>
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
                        </>
                      )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
