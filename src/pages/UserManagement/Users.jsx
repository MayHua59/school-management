import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import SearchFeature from "../../components/SearchFeature/SearchFeature";
import ShowError from "../../components/ShowError/ShowError";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const navigate = useNavigate();
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://cloudolt.software100.com.mm/api/v1/users"
        );
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to get User list"); 
        console.log("error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [dataChanged]);

   

  useEffect(() => {
    const filteredList = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    // @ts-ignore
    setFilteredUsers(filteredList);
  }, [users, searchTerm]);

  const handleDeleteClick = (id) => {
    setUserToDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = (confirmed) => {
    setShowConfirmModal(false);
    if (confirmed) {
      setLoading(true);
      setError(null); 
      axios
        .delete(`https://cloudolt.software100.com.mm/api/v1/users/${userToDeleteId}`)
        .then(() => {
          console.log(`Deleting OLT with ID: ${userToDeleteId}`);
          setDataChanged(!dataChanged);
          navigate("/users");
        })
        .catch((error) => {
          setError(error.response?.data?.message || "Failed to delete User"); 
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("User cancelled deletion.");
    }
  };

  const handleCreateNew = () => {
    navigate("/users/create");
  };

  if (loading) {
    return <div>Loading...........</div>;
  }

  return (
    <>
    {/* <Sidebar/> */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <SearchFeature
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search by User Name, Email Address, User's Role"
        />
        <button onClick={handleCreateNew} className="btn btn-success">
          Create New User
        </button>
      </div>
      {error && <ShowError message={error} />} 
      <p className="lead">List of Users</p>
      {users.length === 0 && !loading && (
        <div className="alert alert-info">No Users found.</div>
      )}

      <ul className="list-unstyled">
        {filteredUsers.map((user) => (
          <li key={user.id} className="mb-3 border p-3 rounded">
            <div className="row row-cols-sm-3 align-items-center">
              <div className="col">
                <strong>Name:</strong> {user.name}
                <br />
                <strong>Email:</strong> {user.email}
                <br />
                <strong>Role:</strong> {user.role}
                <br />
                <strong>Password:</strong> {user.password}
              </div>
              <div className="col d-flex justify-content-end">
                <Link to={`/users/${user?.id}`} className="btn btn-sm btn-info me-2">
                  Detail
                </Link>
                <Link to={`/users/${user?.id}/edit`} className="btn btn-sm btn-primary me-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(user.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {showConfirmModal && (
        <ConfirmationModal
          itemId={userToDeleteId} 
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
};

export default Users;