import '../App.css'
import { useState, useContext } from 'react'
import NavBar from '../components/NavBar'
import Table from '../components/Table'
import AddToData from '../components/AddToData'
import { DataContext } from '../useContext/DataContext'
import Alert from 'react-bootstrap/Alert';

function HomePage() {
  
  const { setCurrentPage, showAlert, setShowAlert } = useContext(DataContext);
  const [pagesDisplayed, setPagesDisplayed] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  //Sets search query to pass it as a prop to the Table component
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  //Sets the pages to be displayed and passes it as a prop to the Table component
  const handlePagesDisplayed = (event) => {
    setPagesDisplayed(event.target.value)
  }

  return (
    <div className='d-flex flex-column'>
      <NavBar></NavBar>
      
      <main className='mt-2 mt-sm-2 p-3 p-sm-3 pt-sm-2 pt-2 container-fluid' style={{ minWidth: "100px", maxWidth: '1200px' }}>
  
        {showAlert.show && <Alert className='mb-2' key='success' variant='success' onClose={() => setShowAlert({ show: false, item: '' })} dismissible>
          <span>Job from {showAlert.item} added successfully!</span>
        </Alert>}

        <div className='d-flex flex-column justify-content-between flex-lg-row'>
          <h3 className='fw-bold mb-2 mb-lg-0 mt-2 mt-sm-2' style={{whiteSpace: 'nowrap'}}>2025 Summer Job Tracker</h3>

          <div className='d-flex align-items-center align-items-lg-center mt-2 mt-sm-2 mt-sm-0'>

            <div className="me-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search company..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>
            
            <form className='me-2'>
              <select id="status" className="form-select form-control" value={pagesDisplayed} onChange={handlePagesDisplayed} aria-label="Default select example">
                <option value={5}>5 rows</option>
                <option value={10}>10 rows</option>
                <option value={20}>20 rows</option>
                <option value="all">All rows</option>
              </select>
            </form>

            <AddToData></AddToData>
          </div>
        </div>

        <div >
          <Table pagesDisplayed={pagesDisplayed} searchQuery={searchQuery}></Table>
        </div>
        

      </main>
    
    </div>
  )
}

export default HomePage
