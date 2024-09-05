import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const DataContext = createContext();

export const DataContextProvider = ({children}) => {
    const [Data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAlert, setShowAlert] = useState({show: false, item: ''});

    //Uses axios to fetch/GET all data from the database
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('https://jobtracker-io.onrender.com/');
                setData(response.data);
            } catch (error) {
                setError('Error loading jobs: ' + error.message);
            }
        }
        fetchJobs();
    }, []);

    

    return (
        <DataContext.Provider value={{Data, setData, currentPage, setCurrentPage, showAlert, setShowAlert}}>
            {children}
        </DataContext.Provider>
    )
}

//{id: 1, company: 'abc', status: 'accepted', date: '24 August 2024', notes: 'Bleh'}, {id: 2, company: 'abc', status: 'rejected', date: '24 August 2024', notes: 'Bleh'}, {id: 3, company: 'abc', status: 'waitlisted', date: '24 August 2024', notes: 'Bleh'}, {id: 4, company: 'abc', status: 'pending', date: '24 August 2024', notes: 'Bleh'}
