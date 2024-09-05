import React, { useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';  
import { DataContext } from '../useContext/DataContext';
import axios from 'axios';


const AddToData = () => {
    const { Data, setData, setShowAlert } = useContext(DataContext);

    

    const [formData, setFormData] = useState({
        company: '',
        status: 'pending',
        date: '',
        link: '',
        id: ''
    });

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    //Uses axios to submit/POST data into our database
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newFormData = {
            ...formData,
            id: uuidv4()
        };
        setData([...Data, newFormData]);
        try {
            await axios.post('https://jobtracker-io.onrender.com/jobs', newFormData);
          } catch (error) {
            console.error('Error sending data:', error);
        }
        setShowAlert({show: true, item: newFormData.company});
        setFormData({
            company: '',
            status: 'pending',
            date: '',
            link: '', 
            id: ''
        });
        
    };

    return (
        <>
            <button style={{ width: '125px', whiteSpace: 'nowrap' }} type="button" className="btn btn-primary mt-sm-0" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">
                Add New Job
            </button>

            <div className="modal" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add new job</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body pt-0">
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="company" className="col-form-label">Company:</label>
                                <input type="text" className="form-control" id="company" value={formData.company} onChange={handleInputChange} required/>

                                <label htmlFor="status" className="col-form-label">Status:</label>
                                <select id="status" className="form-select form-control" value={formData.status} onChange={handleInputChange} aria-label="Default select example">
                                    <option value="pending">Pending</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="waitlisted">WaitListed</option>
                                </select>

                                <label htmlFor="date" className="col-form-label">Date:</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    id="date"  
                                    value={formData.date} 
                                    onChange={handleInputChange}  
                                    min="2020-01-01"
                                    max="2030-12-31"
                                />

                                <label htmlFor="link" className="col-form-label">Link:</label>
                                <textarea className="form-control" id="link" value={formData.link} onChange={handleInputChange}></textarea>
                                
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Add</button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default AddToData;
