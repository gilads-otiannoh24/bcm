import { useEffect, useState } from "react";
import api from "../../lib/axios";
import Loading from "../Loading";
import { User } from "@shared/types";

export function TopUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/users/topusers");

        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    getUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Cards Created</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.fullName}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{user.fullName}</div>
                    <div className="text-sm opacity-50">{user.email}</div>
                  </div>
                </div>
              </td>
              <td>{user.cards}</td>
              <td>
                <div
                  className={`badge ${
                    user.role === "admin" ? "badge-primary" : "badge-secondary"
                  }`}
                >
                  {user.role}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
