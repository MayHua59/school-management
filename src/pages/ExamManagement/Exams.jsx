import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

// const API_URL = 'http://localhost:5000/api/subjects'; 
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SearchFeature from '../../components/SearchFeature/SearchFeature';
import ShowError from '../../components/ShowError/ShowError';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal'; 

// const exams = {
//     name: "",
//     date: Date,
//     subjects: "",

// }


const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExam, setFilteredExam] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [examToDeleteId, setExamToDeleteId] = useState(null);
  const navigate = useNavigate();
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          "https://cloudolt.software100.com.mm/api/v1/exams"
        );
        setExams(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to get Exam list"); 
        console.log("error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [dataChanged]);

    useEffect(() => {
    const filteredList = exams.filter((exam) => 
        exam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        exam.date.toString().includes(searchTerm.toLowerCase()) || 
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // @ts-ignore
    setFilteredSubject(filteredList);
  }, [exams, searchTerm]);
  const handleDeleteClick = (id) => {
    setExamToDeleteId(id);
    setShowConfirmModal(true);
  };

   const handleConfirmDelete = (confirmed) => {
    setShowConfirmModal(false);
    if (confirmed) {
      setLoading(true);
      setError(null); 
      axios
        .delete(`https://cloudolt.software100.com.mm/api/v1/exams/${examToDeleteId}`)
        .then(() => {
          console.log(`Deleting TimeTable with ID: ${examToDeleteId}`);
          setDataChanged(!dataChanged);
          navigate("/exams");
        })
        .catch((error) => {
          setError(error.response?.data?.message || "Failed to delete Exam"); 
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("User cancelled deletion.");
    }
  };
   const handleCreateNew = () => {
    navigate("/exams/create");
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
          placeholder="Search by exam name, date, or subject"
        />
        <button onClick={handleCreateNew} className="btn btn-success">
          Create New Exam
        </button>
      </div>
      {error && <ShowError message={error} />}
      <p className="lead">List of Exams</p>
      {exams.length === 0 && !loading && (
        <div className="alert alert-info">No Exam found.</div>
      )}

      <ul className="list-unstyled">
        {filteredExam.map((exam) => (
          <li key={exam.id} className="mb-3 border p-3 rounded bg-white shadow-sm">
            <div className="row align-items-center">
              <div className="col">
                <strong>Time Table Name {exam.name}</strong> {exam.name}
                <br />
                <strong>Date:</strong> {exam.date}
                <br />
                <strong>Subject:</strong> {exam.subject}
                <br />
              </div>
              <div className="col-auto d-flex">
                <Link to={`/exams/${exam.id}`} className="btn btn-sm btn-info me-2">
                  Detail
                </Link>
                <Link to={`/exams/${exam.id}/edit`} className="btn btn-sm btn-primary me-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(exam.id)}
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
          itemId={examToDeleteId}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  </div>
)
}

export default Exams