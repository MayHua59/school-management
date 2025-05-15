import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DetailCard from "../../components/DetailCard/DetailCard";
import ShowError from "../../components/ShowError/ShowError";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [subToDeleteId, setSubToDeleteId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
      const [dataChanged, setDataChanged] = useState(false);
    
  


  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await axios.get(
          `https://cloudolt.software100.com.mm/api/v1/subjects/${id}`
        );
        setSubject(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch Subject details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  
  if (loading) {
    return <div>Loading Subject details...</div>;
  }

   if (error) {
    return <ShowError message={error} />; 
  }

  if (!subject) {
    return <div>OLT not found.</div>;
  }

   const handleDeleteClick = (id) => {
    setSubToDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = (confirmed) => {
    setShowConfirmModal(false);
    if (confirmed) {
      setLoading(true);
      setError(null); 
      axios
        .delete(`https://cloudolt.software100.com.mm/api/v1/subjects/${id}`)
        .then(() => {
          console.log(`Deleting OLT with ID: ${subToDeleteId}`);
          setDataChanged(!dataChanged);
          navigate("/subjects");
        })
        .catch((error) => {
          setError(error.response?.data?.message || "Failed to delete Subject"); 
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
      title="Subject"
      item={subject}
      editUrl={`/subjects/${id}/edit`}
      onDelete={handleDeleteClick}
      backUrl="/subjects"
    />
     {showConfirmModal && (
        <ConfirmationModal
          itemId={subToDeleteId} 
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
};

export default SubjectDetail;
