import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DetailCard from "../../components/DetailCard/DetailCard";
import ShowError from "../../components/ShowError/ShowError";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [userToDeleteId, setUserToDeleteId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
      const [dataChanged, setDataChanged] = useState(false);
    
  


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://cloudolt.software100.com.mm/api/v1/users/${id}`
        );
        setUser(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch User details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  
  if (loading) {
    return <div>Loading User details...</div>;
  }

   if (error) {
    return <ShowError message={error} />; 
  }

  if (!user) {
    return <div>User not found.</div>;
  }

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
        .delete(`https://cloudolt.software100.com.mm/api/v1/users/${id}`)
        .then(() => {
          console.log(`Deleting User with ID: ${userToDeleteId}`);
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


  return (
    <>
    <DetailCard
      title="User"
      item={user}
      editUrl={`/users/${id}/edit`}
      onDelete={handleDeleteClick}
      backUrl="/users"
    />
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

export default UserDetail;
