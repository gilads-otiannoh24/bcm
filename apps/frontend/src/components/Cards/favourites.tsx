"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Grid, List, X, CreditCard } from "lucide-react";
import { CardGrid } from "./card-grid";
import { CardList } from "./card-list";
import { ConfirmModal } from "./confirm-modal";
import api from "../../lib/axios";
import useCriticalErrorStore from "../../stores/criticalErrorStore";
import Loading from "../Loading";
import { useAuth } from "../../context/AuthContext";
import { ServerSettings } from "../Settings/settings-page";
import { BusinessCard, FavouriteCard } from "@shared/types";
import useToastStore from "../../hooks/useToast";

// Define card types
export type CardTemplate =
  | "professional"
  | "creative"
  | "minimal"
  | "bold"
  | "elegant";

export function Favourites() {
  const [cards, setCards] = useState<FavouriteCard[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [cardToDelete, setCardToDelete] = useState<BusinessCard | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setCrtitcaError = useCriticalErrorStore(
    (state) => state.setCriticalError
  );
  const setError = useCriticalErrorStore((state) => state.setError);

  const {
    getUserSettings,
    setCardDisplayMode,
    user,
    checkAuth,
    loading: authLoading,
  } = useAuth();
  const { toast } = useToastStore();

  useEffect(() => {
    const checkAuthStatus = async () => {
      await checkAuth();
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const getCards = async () => {
      try {
        const response = await api.get("/favourites/me");

        if (response.data.success) {
          setCards(response.data.favourites);
        }
      } catch (err: any) {
        if (err.status !== 401) {
          setCrtitcaError(true);
          setError(new Error(err.response.data.message ?? "Error"));
          toast.error("An error occured while fetching your favourites");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      const cardsJson = localStorage.getItem("favourites");

      if (cardsJson) {
        const c = JSON.parse(cardsJson) as BusinessCard[];

        setCards(c.map((cd) => ({ user: {}, card: cd })) as FavouriteCard[]);
        return;
      }

      setCards([]);
      return;
    } else {
      setCards([]);
      getCards();
    }
  }, [user]);

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
  const filteredCards = cards.filter((c) => {
    const card = c.card;
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
  const confirmDeleteCard = async () => {
    if (cardToDelete) {
      try {
        const res = await api.delete(`businesscards/${cardToDelete.id}`);

        if (res.data.success) {
          toast.success("Card deleted successfully!");
          setCards(cards.filter((card) => card.card.id !== cardToDelete.id));
        }
      } catch (error: any) {
        if (error.status === 404) {
          toast.error("Card not found!");
        }
        console.error(error);
      } finally {
        setIsDeleteModalOpen(false);
        setCardToDelete(null);
      }
    }
  };

  // Handle card duplication
  const handleDuplicateCard = async (card: BusinessCard) => {
    try {
      const res = await api.get(`/businesscards/${card.id}/duplicate`);

      if (res.status === 201) {
        setCards([...cards, res.data.data as FavouriteCard]);
        toast.success("Card duplicated successfully!");
      }
    } catch (error: any) {
      if (error.status === 404) {
        toast.error("Card to be duplicated not found!");
      }
    }
  };

  const handleFavouriteCard = () => {};

  const handleRemoveFromFavourites = async (card: BusinessCard) => {
    if (user) {
      try {
        const res = await api.delete(`favourites/${card.id}`);

        if (res.data.success) {
          setCards(cards.filter((c) => c.card.id !== card.id));
          toast.success("Card removed from favourites!");
        }
      } catch (error: any) {
        if (error.status === 404) {
          toast.error("Card not found!");
        }
      }
    } else {
      let favsR = localStorage.getItem("favourites");

      if (favsR) {
        let favs = JSON.parse(favsR) as BusinessCard[];
        favs = favs.filter((c) => c.id !== card.id);
        localStorage.setItem("favourites", JSON.stringify(favs));
        setCards(cards.filter((c) => c.card.id !== card.id));
        toast.success("Card removed from favourites!");
      }
    }
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
        <div></div>

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
      {loading || authLoading ? (
        <div className="flex justify-center items-center py-8 h-fit">
          <Loading />
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="bg-base-100 p-8 rounded-lg shadow-md text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-base-200 p-4 rounded-full">
              <CreditCard className="h-8 w-8 text-base-content/50" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">No cards found</h3>
          <p className="text-base-content/70 mb-6">
            {cards.length === 0
              ? "You have no favourite business cards yet."
              : "No cards match your current filters."}
          </p>
          <button className="btn btn-outline" onClick={resetFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Reset Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <CardGrid
          cards={filteredCards.map((c) => c.card)}
          onDelete={handleDeleteCard}
          onDuplicate={handleDuplicateCard}
          onShare={handleShareCard}
          showCopySuccess={showCopySuccess}
          onFavourite={handleFavouriteCard}
          onRemoveFromFavourite={handleRemoveFromFavourites}
        />
      ) : (
        <CardList
          cards={filteredCards.map((c) => c.card)}
          onDelete={handleDeleteCard}
          onDuplicate={handleDuplicateCard}
          onShare={handleShareCard}
          showCopySuccess={showCopySuccess}
          onFavourite={handleFavouriteCard}
          onRemoveFromFavourite={handleRemoveFromFavourites}
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
