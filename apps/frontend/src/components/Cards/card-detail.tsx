"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Share2,
  Trash2,
  Eye,
  CheckCircle,
} from "lucide-react";
import { CardPreview } from "./card-preview";
import { ConfirmModal } from "./confirm-modal";
import api from "../../lib/axios";
import useToastStore from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { BusinessCard } from "@shared/types";
import { useAuth } from "../../context/AuthContext";

type CardDetailProps = {
  cardId: string;
};

export function CardDetail({ cardId }: CardDetailProps) {
  // State for card data
  const [card, setCard] = useState<BusinessCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const { toast } = useToastStore();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch card data
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await api.get(`/businesscards/${cardId}`);

        if (response.data.success) {
          setCard(response.data.data);
        } else {
          setCard(null);
        }
      } catch (err: any) {
        if (err.status === 404) {
          setCard(null);
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [cardId]);

  // Handle delete
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await api.delete(`businesscards/${cardId}`);

      if (res.data.success) {
        toast.success("Card deleted successfully!");
        return navigate("/cards");
      }
    } catch (error: any) {
      if (error.status === 404) {
        toast.error("Card not found!");
      }
      console.error(error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // Handle share
  const handleShare = () => {
    // In a real app, this would generate a sharing link or open a share dialog
    const shareUrl = `https://bsm.com/share/${cardId}`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="bg-base-100 p-8 rounded-lg shadow-xl text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-base-200 p-4 rounded-full">
            <Eye className="h-8 w-8 text-base-content/50" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Card not found</h3>
        <p className="text-base-content/70 mb-6">
          The business card you're looking for doesn't exist or has been
          deleted.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => (user ? navigate("/cards") : navigate("/browse"))}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {user ? "My" : ""} Cards
        </button>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg shadow-xl">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="btn btn-ghost btn-sm mr-4"
            onClick={() => (user ? navigate("/cards") : navigate("/browse"))}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h2 className="text-xl font-bold">{card.title}</h2>
        </div>
        <div className="flex gap-2">
          {user && user.role === "admin" && (
            <a
              href={`/cards/${card.id}/edit`}
              className="btn btn-outline btn-sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </a>
          )}
          <button className="btn btn-primary btn-sm" onClick={handleShare}>
            {showCopySuccess ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Card Preview */}
          <div className="flex-1">
            <h3 className="font-medium mb-3">Card Preview</h3>
            <div className="border rounded-lg p-4 bg-base-200">
              <div className="aspect-video max-w-md mx-auto">
                <CardPreview card={card} />
              </div>
            </div>

            {/* Card Actions */}
            <div className="mt-6 flex flex-wrap gap-2">
              {user && user.role === "admin" && (
                <a href={`/cards/${card.id}/edit`} className="btn btn-outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Card
                </a>
              )}

              <button className="btn btn-primary" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Card
              </button>

              {user && user.role === "admin" && (
                <button className="btn btn-error" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Card Details */}
          <div className="flex-1">
            <div className="space-y-6">
              {/* Card Status */}
              <div className="flex items-center">
                <span className="mr-2">Status:</span>
                <span
                  className={`badge ${
                    card.status === "active"
                      ? "badge-success"
                      : card.status === "inactive"
                      ? "badge-warning"
                      : "badge-ghost"
                  }`}
                >
                  {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                </span>
              </div>

              {/* Card Stats */}
              <div>
                <h3 className="font-medium mb-3">Card Statistics</h3>
                <div className="stats stats-vertical shadow w-full">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <Eye className="h-6 w-6" />
                    </div>
                    <div className="stat-title">Views</div>
                    <div className="stat-value">{card.views}</div>
                    <div className="stat-desc">Since creation</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <Share2 className="h-6 w-6" />
                    </div>
                    <div className="stat-title">Shares</div>
                    <div className="stat-value">{card.shares}</div>
                    <div className="stat-desc">Since creation</div>
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div>
                <h3 className="font-medium mb-3">Card Information</h3>
                <div className="overflow-x-auto">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td className="font-medium">Template</td>
                        <td>
                          {card.template.charAt(0).toUpperCase() +
                            card.template.slice(1)}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium">Name</td>
                        <td>{card.name}</td>
                      </tr>
                      <tr>
                        <td className="font-medium">Job Title</td>
                        <td>{card.jobTitle}</td>
                      </tr>
                      <tr>
                        <td className="font-medium">Company</td>
                        <td>{card.company}</td>
                      </tr>
                      <tr>
                        <td className="font-medium">Email</td>
                        <td>{card.email}</td>
                      </tr>
                      <tr>
                        <td className="font-medium">Phone</td>
                        <td>{card.phone}</td>
                      </tr>
                      {card.website && (
                        <tr>
                          <td className="font-medium">Website</td>
                          <td>{card.website}</td>
                        </tr>
                      )}
                      {card.address && (
                        <tr>
                          <td className="font-medium">Address</td>
                          <td>{card.address}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="font-medium">Created</td>
                        <td>{card.createdAt}</td>
                      </tr>
                      <tr>
                        <td className="font-medium">Last Updated</td>
                        <td>{card.updatedAt}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ConfirmModal
          title="Delete Business Card"
          message={`Are you sure you want to delete "${card.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="btn-error"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          loading={isDeleting}
        />
      )}
    </div>
  );
}
