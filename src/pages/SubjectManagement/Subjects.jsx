import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/subjects'; 
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SearchFeature from '../../components/SearchFeature/SearchFeature';
import ShowError from '../../components/ShowError/ShowError';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal'; 


const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSubject, setFilteredSubject] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [subToDeleteId, setSubToDeleteId] = useState(null);
  const navigate = useNavigate();
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          API_URL
        );
        setSubjects(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to get Subject list"); 
        console.log("error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [dataChanged]);

    useEffect(() => {
    const filteredList = subjects.filter((sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    // @ts-ignore
    setFilteredSubject(filteredList);
  }, [subjects, searchTerm]);
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
        .delete(`https://cloudolt.software100.com.mm/api/v1/subjects/${subToDeleteId}`)
        .then(() => {
          console.log(`Deleting Subject with ID: ${subToDeleteId}`);
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
   const handleCreateNew = () => {
    navigate("/subjects/create");
  };
   if (loading) {
    return <div>Loading...........</div>;
  }
  return (
  <div className="d-flex" style={{ minHeight: '100vh' }}>
    <div style={{ minWidth: 220 }}>
      <Sidebar />
    </div>
    <div className="flex-grow-1 p-4" style={{ background: "#f8f9fa", marginLeft: 220, minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <SearchFeature
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search by Subject Name"
        />
        <button onClick={handleCreateNew} className="btn btn-success">
          Create New Subject
        </button>
      </div>
      {error && <ShowError message={error} />}
      <p className="lead">List of Subjects</p>
      {subjects.length === 0 && !loading && (
        <div className="alert alert-info">No Subjects found.</div>
      )}

      <ul className="list-unstyled">
        {filteredSubject.map((sub) => (
          <li key={sub.id} className="mb-3 border p-3 rounded bg-white shadow-sm">
            <div className="row align-items-center">
              <div className="col">
                <strong>Name:</strong> {sub.name}
              </div>
              <div className="col-auto d-flex">
                <Link to={`/subjects/${sub.id}`} className="btn btn-sm btn-info me-2">
                  Detail
                </Link>
                <Link to={`/subjects/${sub.id}/edit`} className="btn btn-sm btn-primary me-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(sub.id)}
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
          itemId={subToDeleteId}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  </div>
)
}

export default Subjects