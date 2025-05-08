"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Trash2,
  Edit,
  Plus,
  Eye,
  MoreHorizontal,
  Download,
  X,
} from "lucide-react";
import { ConfirmModal } from "../../components/Admin/confirm-modal";
import { Link } from "react-router-dom";
import api from "../../lib/axios";
import useToastStore from "../../hooks/useToast";
import { BusinessCard } from "@shared/types";
import Loading from "../../components/Loading";
import { CardPreview } from "../../components/Cards";
import { downloadPdf } from "../../lib/pdf-generator.util";

export default function CardsPage() {
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<BusinessCard | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToastStore();

  useEffect(() => {
    const getCards = async () => {
      try {
        const response = await api.get("/businesscards");

        if (response.data.success) {
          setCards(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch cards");
      } finally {
        setIsLoading(false);
      }
    };
    getCards();
  }, []);

  // Filter cards based on search term and filters
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.owner?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTemplate =
      templateFilter === "all" || card.template === templateFilter;
    const matchesStatus =
      statusFilter === "all" || card.status === statusFilter;
    return matchesSearch && matchesTemplate && matchesStatus;
  });

  // Pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle select all cards
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCards([]);
    } else {
      setSelectedCards(currentCards.map((card) => card.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  // Handle select individual card
  const handleSelectCard = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  // Handle card delete
  const handleDeleteCard = (card: BusinessCard) => {
    setCardToDelete(card);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!cardToDelete) return;

    try {
      const response = await api.delete(`/businesscards/${cardToDelete.id}`);

      if (response.data.success) {
        setCards(cards.filter((card) => card.id !== cardToDelete.id));
        setSelectedCards(selectedCards.filter((id) => id !== cardToDelete.id));
        toast.success("Card deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting card");
    } finally {
      setIsDeleteModalOpen(false);
      setCardToDelete(null);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!selectedCards.length) return;
    try {
      const response = await api.post(`/businesscards/deletebulk`, {
        ids: selectedCards,
      });

      if (response.data.success) {
        setCards(cards.filter((card) => !selectedCards.includes(card.id)));
        toast.success("Cards deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting cards");
    } finally {
      setSelectedCards([]);
      setIsAllSelected(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setTemplateFilter("all");
    setStatusFilter("all");
  };

  const getSelectedCardsDataSetForExport = (): BusinessCard[] | [] => {
    if (!selectedCards) return [];
    return selectedCards.map((id) => {
      let user = cards.find((user) => user.id === id) as BusinessCard;

      const keysToRemove = ["_id", "__v", "id"];
      const userToExport = Object.keys(user).reduce((acc, key) => {
        if (!keysToRemove.includes(key)) {
          // @ts-ignore
          acc[key] = user[key as keyof BusinessCard];
        }
        return acc;
      }, {});

      return userToExport;
    }) as BusinessCard[];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Business Card Management</h1>
        <Link to="/cards/create" className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Card
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-base-100 p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow h-fit">
            <Search className="absolute z-[1] left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              placeholder="Search cards or owners..."
              className="input input-bordered pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute z[1] right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4 text-base-content/50" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
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

            <button className="btn btn-outline btn-sm" onClick={resetFilters}>
              <Filter className="h-4 w-4 mr-1" />
              Reset
            </button>
          </div>
        </div>

        {/* Selected cards actions */}
        {selectedCards.length > 0 && (
          <div className="flex items-center justify-between mt-4 p-2 bg-base-200 rounded-lg">
            <span className="text-sm">
              {selectedCards.length} card{selectedCards.length !== 1 && "s"}{" "}
              selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  downloadPdf(
                    getSelectedCardsDataSetForExport(),
                    "bcm-admin-cards-download.pdf",
                    "BCM Cards"
                  )
                }
                className="btn btn-sm btn-outline"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cards Table */}
      <div className="bg-base-100 rounded-lg shadow-md overflow-x-auto">
        {isLoading ? (
          <>
            <div className="flex items-center justify-center h-full py-12">
              <Loading />
            </div>
          </>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Card</th>
                  <th>Owner</th>
                  <th>Template</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Shares</th>
                  <th>Created</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCards.map((card) => (
                  <tr key={card.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedCards.includes(card.id)}
                        onChange={() => handleSelectCard(card.id)}
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-9 rounded-md overflow-hidden">
                          <CardPreview card={card} />
                        </div>
                        <div>
                          <div className="font-bold">{card.title}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="bg-primary text-neutral-content rounded-full w-10">
                            <span className="text-xl h-full flex font-bold items-center justify-center">
                              {card.owner?.fullName?.[0]?.toUpperCase() || "B"}
                            </span>
                          </div>
                        </div>
                        <span>{card.owner?.fullName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="badge badge-ghost">{card.template}</div>
                    </td>
                    <td>
                      <div
                        className={`badge ${
                          card.status === "active"
                            ? "badge-success"
                            : card.status === "inactive"
                            ? "badge-warning"
                            : "badge-ghost"
                        }`}
                      >
                        {card.status}
                      </div>
                    </td>
                    <td>{card.views}</td>
                    <td>{card.shares}</td>
                    <td>{card.createdAt}</td>
                    <td>{card.updatedAt}</td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-ghost btn-xs"
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
                            <button onClick={() => handleDeleteCard(card)}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}

                {currentCards.length === 0 && (
                  <tr>
                    <td
                      className="text-center text-base font-bold"
                      colSpan={10}
                    >
                      No cards found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
              <span className="text-sm">
                Showing {indexOfFirstCard + 1} to{" "}
                {indexOfLastCard > filteredCards.length
                  ? filteredCards.length
                  : indexOfLastCard}{" "}
                of {filteredCards.length} cards
              </span>
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`join-item btn btn-sm ${
                      currentPage === i + 1 ? "btn-active" : ""
                    }`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="join-item btn btn-sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && cardToDelete && (
        <ConfirmModal
          title="Delete Business Card"
          message={`Are you sure you want to delete the business card "${cardToDelete.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="btn-error"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
