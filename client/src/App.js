import React, {Fragment, useEffect, useState} from 'react'
import './App.css'
import Masonry from 'react-masonry-css'
import Modal from 'react-modal'

const PORT = "http://localhost:9000/"

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
}

function App() {
  const [file, setFile] = useState(null)
  const [imageList, setImageList] = useState([])
  const [listUpdate, setListUpdate] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)

  const [modalIsOpen, setModalIsOpen] = useState(false)

  useEffect(() => {

    Modal.setAppElement('body')

    fetch(PORT + 'images/get')
    .then(res => res.json())
    .then(res => setImageList(res))
    .catch(err => {
      console.error(err)
    })
    setListUpdate(false)
  }, [listUpdate])

  const selectedHandler = e => {
    setFile(e.target.files[0])
  }

  const sendHandler = () => {
    if(!file) {
      alert('you must be upload file')
    }

    const formData = new FormData()
    formData.append('image', file)

    fetch(PORT + 'images/post', {
      method: 'POST',
      body: formData
    })
    .then(res => res.text())
    .then(res => {
      setListUpdate(true)
      console.log(res)})
    .catch(err => {
      console.error(err)
    })

    document.getElementById('fileinput').value = null

    setFile(null)
  }

  const modalHandler = (isOpen, image) => {
    setModalIsOpen(isOpen)
    setCurrentImage(image)
  }

  const deleteHandler = () => {
    let imageID = currentImage.split('.') 
    imageID = parseInt(imageID[0])

    fetch(PORT + 'images/delete/' + imageID, {
      method: 'DELETE'
    })
      .then(res => res.text())
      .then(res=> console.log(res)) 
    
    setModalIsOpen(false, null)
    setListUpdate(true)
  }

  return (
    <Fragment>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <a href="#!" className="navbar-brand">Image App</a>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="card p-3">
          <div className="row d-flex justify-content-center">
            <div className="col-md-10 col-sm-12 my-2">
              <input id="fileinput" onChange={selectedHandler} className="form-control" type="file"/>
            </div>
            <div className="col-md-2 col-sm-4 col-5 my-2">
              <button onClick={sendHandler} type="button" className="btn btn-primary col-12">Upload</button>
            </div>
          </div>
        </div>
      </div>

      <div className="Image-container m-5">
      <Masonry
        breakpointCols={breakpointColumns}
        className="Image-grid"
        columnClassName="Image-grid-column"
      >
        {imageList.map(image => (
          <div key={image} className="card Image-container text-md-center">
            <img  src={PORT + image} alt={image} className="Image"/>
            <div className="card-body">
              <button className="btn btn-dark" onClick={() => modalHandler(true, image)}>Click to view</button>
            </div>
          </div>
        ))}
      </Masonry>
      </div>

      <Modal className="Modal" overlayClassName="Overlay" isOpen={modalIsOpen} onRequestClose={() => modalHandler(false, null)}>
        <div className="card Modal-container">
          <img className="Image-modal" src={PORT + currentImage} alt=""/>
          <div className="card-body text-center">
              <button onClick={() => deleteHandler()} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </Modal>

    </Fragment>
  )
}

export default App;
