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


const TimeTables = () => {
  const [timetables, setTimeTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTimeTable, setFilteredTimeTable] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [timeTableToDeleteId, setTimeTableToDeleteId] = useState(null);
  const navigate = useNavigate();
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    const fetchTimeTables = async () => {
      try {
        const response = await axios.get(
          "https://cloudolt.software100.com.mm/api/v1/timetables"
        );
        setTimeTables(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to get TimeTable list"); 
        console.log("error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeTables();
  }, [dataChanged]);

    useEffect(() => {
    const filteredList = timetables.filter((timetable) => 
        timetable.date.toLowerCase().includes(searchTerm.toLowerCase()) || 
        timetable.period.toString().includes(searchTerm.toLowerCase()) || 
        timetable.subjects.some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    // @ts-ignore
    setFilteredSubject(filteredList);
  }, [timetables, searchTerm]);
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
        .delete(`https://cloudolt.software100.com.mm/api/v1/timetables/${timeTableToDeleteId}`)
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
   const handleCreateNew = () => {
    navigate("/timetables/create");
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
          placeholder="Search by date, period, or subject"
        />
        <button onClick={handleCreateNew} className="btn btn-success">
          Create New TimeTable
        </button>
      </div>
      {error && <ShowError message={error} />}
      <p className="lead">List of TimeTables</p>
      {timetables.length === 0 && !loading && (
        <div className="alert alert-info">No TimeTable found.</div>
      )}

      <ul className="list-unstyled">
        {filteredTimeTable.map((timetable) => (
          <li key={timetable.id} className="mb-3 border p-3 rounded bg-white shadow-sm">
            <div className="row align-items-center">
              <div className="col">
                <strong>Time Table {timetable.id}</strong> {timetable.id}
                <br />
                <strong>Date:</strong> {timetable.date}
                <br />
                <strong>Period:</strong> {timetable.period}
                <br />
              </div>
              <div className="col-auto d-flex">
                <Link to={`/timetables/${timetable.id}`} className="btn btn-sm btn-info me-2">
                  Detail
                </Link>
                <Link to={`/timetables/${timetable.id}/edit`} className="btn btn-sm btn-primary me-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(timetable.id)}
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
          itemId={timeTableToDeleteId}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  </div>
)
}

export default TimeTables