import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import SearchFeature from "../../components/SearchFeature/SearchFeature";
import ShowError from "../../components/ShowError/ShowError";
import axios from "axios";

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMark, setFilteredMark] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [markToDeleteId, setMarkToDeleteId] = useState(null);
  const navigate = useNavigate();
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await axios.get(
          "https://cloudolt.software100.com.mm/api/v1/marks"
        );
        setMarks(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to get Mark list"); 
        console.log("error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, [dataChanged]);

  

  useEffect(() => {
    const filteredList = marks.filter((mark) =>
      mark.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mark.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mark.marks_obtained.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    // @ts-ignore
    setFilteredOltList(filteredList);
  }, [marks, searchTerm]);

  const handleDeleteClick = (id) => {
    setMarkToDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = (confirmed) => {
    setShowConfirmModal(false);
    if (confirmed) {
      setLoading(true);
      setError(null); 
      axios
        .delete(`https://cloudolt.software100.com.mm/api/v1/marks/${markToDeleteId}`)
        .then(() => {
          console.log(`Deleting OLT with ID: ${markToDeleteId}`);
          setDataChanged(!dataChanged);
          navigate("/marks");
        })
        .catch((error) => {
          setError(error.response?.data?.message || "Failed to delete Mark"); 
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("User cancelled deletion.");
    }
  };

  const handleCreateNew = () => {
    navigate("/marks/create");
  };

  if (loading) {
    return <div>Loading...........</div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <SearchFeature
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search by Student Name, Exam, Mark"
        />
        <button onClick={handleCreateNew} className="btn btn-success">
          Create New Item
        </button>
      </div>
      {error && <ShowError message={error} />} 
      <p className="lead">List of Mark</p>
      {marks.length === 0 && !loading && (
        <div className="alert alert-info">No Mark found.</div>
      )}

      <ul className="list-unstyled">
        {filteredMark.map((mark) => (
          <li key={mark.id} className="mb-3 border p-3 rounded">
            <div className="row row-cols-sm-3 align-items-center">
              <div className="col">
                <strong>Student Name:</strong> {mark.student_name}
                <br />
                <strong>Exam</strong> {mark.exam}
                <br />
                <strong>Mark Obtained:</strong> {mark.marks_obtained}
                <br />
                
              </div>
              <div className="col d-flex justify-content-end">
                <Link to={`/marks/${mark.id}`} className="btn btn-sm btn-info me-2">
                  Detail
                </Link>
                <Link to={`/marks/${mark?.id}/edit`} className="btn btn-sm btn-primary me-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(mark.id)}
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
          itemId={markToDeleteId} 
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
};

export default Marks;