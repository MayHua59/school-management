import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DetailCard from "../../components/DetailCard/DetailCard";
import ShowError from "../../components/ShowError/ShowError";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const TimeTableDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeTable, setTimeTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [timeTableToDeleteId, setTimeTableToDeleteId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
      const [dataChanged, setDataChanged] = useState(false);
    
  


  useEffect(() => {
    const fetchTimeTable = async () => {
      try {
        const response = await axios.get(
          `https://cloudolt.software100.com.mm/api/v1/timetables/${id}`
        );
        setTimeTable(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch TimeTable details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTimeTable();
  }, [id]);

  
  if (loading) {
    return <div>Loading TimeTable details...</div>;
  }

   if (error) {
    return <ShowError message={error} />; 
  }

  if (!timeTable) {
    return <div>TimeTable not found.</div>;
  }

   const handleDeleteClick = (id) => {
    setTimeTableToDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = (confirmed) => {
    setShowConfirmModal(false);
    if (confirmed) {
      setLoading(true);
      setError(null); 
      axios
        .delete(`https://cloudolt.software100.com.mm/api/v1/timetables/${id}`)
        .then(() => {
          console.log(`Deleting TimeTable with ID: ${timeTableToDeleteId}`);
          setDataChanged(!dataChanged);
          navigate("/timetables");
        })
        .catch((error) => {
          setError(error.response?.data?.message || "Failed to delete TimeTable"); 
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
      item={timeTable}
      editUrl={`/timetables/${id}/edit`}
      onDelete={handleDeleteClick}
      backUrl="/timetables"
    />
     {showConfirmModal && (
        <ConfirmationModal
          itemId={timeTableToDeleteId} 
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
};

export default TimeTableDetail;
