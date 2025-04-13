"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Filter, Grid, List, X, CreditCard } from "lucide-react";
import { CardGrid } from "./card-grid";
import { CardList } from "./card-list";
import { ConfirmModal } from "./confirm-modal";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import useCriticalErrorStore from "../../stores/criticalErrorStore";
import Loading from "../Loading";
import { useAuth } from "../../context/AuthContext";
import { ServerSettings } from "../Settings/settings-page";

// Define card types
export type CardTemplate =
  | "professional"
  | "creative"
  | "minimal"
  | "bold"
  | "elegant";

export type BusinessCard = {
  id: string;
  title: string;
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  template: CardTemplate;
  color: string;
  status: "active" | "inactive" | "draft";
  createdAt: string;
  updatedAt: string;
  views: number;
  shares: number;
  preview: string;
};

export function MyCards() {
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [cardToDelete, setCardToDelete] = useState<BusinessCard | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const naviagate = useNavigate();
  const setCrtitcaError = useCriticalErrorStore(
    (state) => state.setCriticalError
  );
  const setError = useCriticalErrorStore((state) => state.setError);

  const { getUserSettings, setCardDisplayMode } = useAuth();

  useEffect(() => {
    const getCards = async () => {
      try {
        setLoading(true);
        const response = await api.get("/businesscards/me");

        if (response.data.success) {
          setCards(response.data.data);
        }
      } catch (err: any) {
        if (err.status === 401) {
          return naviagate("/unauthorized");
        } else {
          setCrtitcaError(true);
          setError(new Error(err.response.data.message ?? "Error"));
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    getCards();
  }, []);

  useEffect(() => {
    const getPrefferedViewMode = async () => {
      try {
        setLoading(true);
        const response = await getUserSettings();

        const userSettings = response.data.data as ServerSettings;

        if (response.data.success) {
          setCardDisplayMode(userSettings.cardLayout);
          setViewMode(userSettings.cardLayout);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    getPrefferedViewMode();
  }, []);

  // Filter cards based on search term and filters
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || card.status === statusFilter;
    const matchesTemplate =
      templateFilter === "all" || card.template === templateFilter;

    return matchesSearch && matchesStatus && matchesTemplate;
  });

  // Handle card deletion
  const handleDeleteCard = (card: BusinessCard) => {
    setCardToDelete(card);
    setIsDeleteModalOpen(true);
  };

  // Confirm card deletion
  const confirmDeleteCard = () => {
    if (cardToDelete) {
      setCards(cards.filter((card) => card.id !== cardToDelete.id));
      setIsDeleteModalOpen(false);
      setCardToDelete(null);
    }
  };

  // Handle card duplication
  const handleDuplicateCard = (card: BusinessCard) => {
    const newCard: BusinessCard = {
      ...card,
      id: `card-${Date.now()}`,
      title: `Copy of ${card.title}`,
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      views: 0,
      shares: 0,
    };

    setCards([...cards, newCard]);
  };

  // Handle card sharing
  const handleShareCard = (cardId: string) => {
    const shareUrl = `${import.meta.env.BASE_URL}/share/${cardId}`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowCopySuccess(cardId);
      setTimeout(() => setShowCopySuccess(null), 2000);
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTemplateFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <a href="/cards/create" className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create New Card
        </a>

        <div className="flex items-center gap-2">
          <button
            className={`btn btn-sm ${
              viewMode === "grid" ? "btn-active" : "btn-ghost"
            }`}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            className={`btn btn-sm ${
              viewMode === "list" ? "btn-active" : "btn-ghost"
            }`}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-base-100 p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex flex-grow items-start h-fit">
            <Search className="absolute left-3 top-1/2 z-[2] transform -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              placeholder="Search cards..."
              className="input input-bordered pl-12 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 z-[2] transform -translate-y-1/2"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4 text-base-content/50" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 flex-1 items-start">
            <select
              className="select select-bordered"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>

            <select
              className="select select-bordered"
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
            >
              <option value="all">All Templates</option>
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
              <option value="minimal">Minimal</option>
              <option value="bold">Bold</option>
              <option value="elegant">Elegant</option>
            </select>

            <button className="btn btn-outline btn-sm" onClick={resetFilters}>
              <Filter className="h-4 w-4 mr-1" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Cards Display */}
      {filteredCards.length === 0 ? (
        loading ? (
          <div className="flex justify-center items-center py-8 h-fit">
            <Loading />
          </div>
        ) : (
          <div className="bg-base-100 p-8 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-base-200 p-4 rounded-full">
                <CreditCard className="h-8 w-8 text-base-content/50" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">No cards found</h3>
            <p className="text-base-content/70 mb-6">
              {cards.length === 0
                ? "You haven't created any business cards yet."
                : "No cards match your current filters."}
            </p>
            {cards.length === 0 ? (
              <a href="/cards/create" className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Card
              </a>
            ) : (
              <button className="btn btn-outline" onClick={resetFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Reset Filters
              </button>
            )}
          </div>
        )
      ) : viewMode === "grid" ? (
        <CardGrid
          cards={filteredCards}
          onDelete={handleDeleteCard}
          onDuplicate={handleDuplicateCard}
          onShare={handleShareCard}
          showCopySuccess={showCopySuccess}
        />
      ) : (
        <CardList
          cards={filteredCards}
          onDelete={handleDeleteCard}
          onDuplicate={handleDuplicateCard}
          onShare={handleShareCard}
          showCopySuccess={showCopySuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && cardToDelete && (
        <ConfirmModal
          title="Delete Business Card"
          message={`Are you sure you want to delete "${cardToDelete.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="btn-error"
          onConfirm={confirmDeleteCard}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
