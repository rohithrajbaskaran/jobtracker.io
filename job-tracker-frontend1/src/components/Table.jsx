import React, { useContext, useState } from 'react';
import { DataContext } from '../useContext/DataContext';
import axios from 'axios';
import { format } from 'date-fns';

const Table = ({searchQuery, pagesDisplayed}) => {
    const { Data, setData, currentPage, setCurrentPage, showAlert, setShowAlert } = useContext(DataContext);
    
    const itemsPerPage = pagesDisplayed === 'all' ? Data.length : pagesDisplayed;

    const [isAscendingS, setIsAscendingS] = useState(true);
    const [isAscendingC, setIsAscendingC] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState(null);


    //Gets the item to be edited and updates it into editFormData
    const handleEdit = (item) => {
        const formattedDate = item.date ? format(new Date(item.date), 'yyyy-MM-dd') : '';
        setEditFormData({
            ...item,
            date: formattedDate
        });
        setIsEditing(true);
    };

    //Once being edited, changes the previoud values in editFormData
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    //Submits/PUT the edited editFormData into the backend and updates the Data global state
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setShowAlert({show: true, item: editFormData.company});
        try {
            const response = await axios.put(`https://jobtracker-io.onrender.com/jobs/${editFormData.id}`, editFormData);
            const updatedItem = response.data; 
            const updatedData = Data.map(item => item.id === updatedItem.id ? updatedItem : item);
            setData(updatedData); 
            setIsEditing(false);  
        } catch (error) {
            console.error('Error updating job:', error);
        }
    };

    //Axios to remove/DELETE data from database
    const handleRemove = async (id) => {
        try {
            await axios.delete(`https://jobtracker-io.onrender.com/jobs/${id}`);
            const updatedItems = Data.filter(item => item.id !== id);
            setData(updatedItems);
        } catch (error) {
          console.error('Error deleting job:', error);
        }
    };

    //Filters outs the Data according to the searching item from searchQuery
    const filteredData = Data.filter(item => item.company && item.company.toLowerCase().includes(searchQuery));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    //Moves back to the previous page
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    //Moves forward to the next page
    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    //Sorts the list according to the status in alphabetically ascending and descending
    const handleSortStatus = () => {
        const sortedJobs = [...Data].sort((a, b) => {
            if (isAscendingS) {
                return a.status.localeCompare(b.status);
            } else {
                return b.status.localeCompare(a.status);
            }
        });
        setData(sortedJobs);
        setIsAscendingS(!isAscendingS);
    };

    //Sorts the list according to the company name in alphabetically ascending and descending
    const handleSortCompany = () => {
        const sortedJobs = [...Data].sort((a, b) => {
            if (isAscendingC) {
                return a.company.localeCompare(b.company);
            } else {
                return b.company.localeCompare(a.company);
            }
        });
        setData(sortedJobs);
        setIsAscendingC(!isAscendingC);
    };

    return (
        <>
            <div style={{ minHeigh: '500px' }} className='table-responsive-md'>
                <table className="table table-striped table-center ms-0 mt-3 mt-lg-4">
                    <thead className='table-light'>
                        <tr className='align-middle'>
                            <th className='p-2 ps-0 px-lg-2 p-lg-3' scope="col"></th>
                            <th onClick={handleSortCompany} className='p-2 ps-0 px-lg-2 p-lg-3' scope="col">Company <i className={`bi ${isAscendingC ? 'bi-sort-alpha-down-alt' : 'bi-sort-alpha-down'}`}></i></th>
                            <th onClick={handleSortStatus} className='p-2 ps-0 px-lg-2 p-lg-3' scope="col">Status <i className={`bi ${isAscendingS ? 'bi-sort-alpha-down-alt' : 'bi-sort-alpha-down'}`}></i></th>
                            <th className='p-2 ps-0 px-lg-2 p-lg-3' scope="col">Application Deadline</th>
                            <th className='p-2 ps-0 px-lg-2 p-lg-3' scope="col">Edit/Remove</th>
                            <th className='p-2 ps-3 px-lg-2 p-lg-3' scope="col">Link</th>
                        </tr>
                    </thead>

                    <tbody>
                    {currentData.map((item, index) => (
                        <tr key={indexOfFirstItem + index} className="align-middle">
                            <th scope="row">{indexOfFirstItem + index + 1}</th>
                            <td className='p-2 ps-0 px-lg-2 p-lg-3'>{item.company}</td>
                            <td className='p-2 ps-0 px-lg-2 p-lg-3'>
                                <span className={`badge rounded-pill ${item.status === 'accepted' ? 'text-bg-success' : (item.status === 'rejected' ? 'text-bg-danger' : (item.status === 'waitlisted' ? 'text-bg-warning' : 'text-bg-secondary'))}`}>{item.status}</span>
                            </td>
                            <td className='p-2 ps-0 px-lg-2 p-lg-3'>{item.date ? (format(new Date(item.date), 'yyyy-MM-dd')) : 'Not provided'}</td> 
                            <td className='p-0 ps-lg-0'>
                                <div className='p-2 ps-0 px-lg-2 p-lg-3 d-flex flex-lg-row flex-column align-middle'>
                                    <button type="button" className="btn btn-outline-primary btn-sm me-lg-2 mb-1 mb-lg-0" onClick={() => handleEdit(item)}>Edit</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemove(item.id)}>Remove</button>
                                </div>
                            </td>
                            <td className='p-2 ps-3 px-lg-2 p-lg-3'>
                                <a href={item.link} target='_blank' style={{ textDecoration: "none" }}>{item.link}&nbsp; { item.link && (<i class="bi bi-arrow-up-right-square"></i>) }</a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Editing mode switched on to edit previous items on a modal */}
            {isEditing && (
                <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="editModal" aria-hidden="true" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModal">Edit Item</h5>
                            <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleEditSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="company" className="form-label">Company</label>
                                    <input type="text" className="form-control" id="company" name="company" value={editFormData.company} onChange={handleEditChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="status" className="form-label">Status</label>
                                    <select className="form-select" id="status" name="status" value={editFormData.status} onChange={handleEditChange}>
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="waitlisted">Waitlisted</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="date" className="form-label">Application Deadline</label>
                                    <input type="date" className="form-control" id="date" name="date" value={editFormData.date} onChange={handleEditChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="link" className="form-label">Link</label>
                                    <textarea className="form-control" id="link" name="link" value={editFormData.link} onChange={handleEditChange}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>            
            )}

            {/* Displayes the pages and the current page */}
            <div style={{ visibility: Data.length > itemsPerPage ? 'visible' : 'hidden' }} className="d-flex justify-content-between align-items-center mt-0 mt-lg-2">
                <button
                    className="btn btn-outline-secondary"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    <i className="bi bi-skip-start-fill"></i>
                </button>
                <span>Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}</span>
                <button
                    className="btn btn-outline-secondary"
                    onClick={handleNextPage}
                    disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                >
                    <i className="bi bi-skip-end-fill"></i>
                </button>
            </div>
        </>
    );
};

export default Table;
