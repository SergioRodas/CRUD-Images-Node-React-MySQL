import React, {Fragment, useEffect, useState} from 'react'
import './App.css'

const PORT = "http://localhost:9000/"

function App() {
  const [file, setFile] = useState(null)
  const [imageList, setImageList] = useState([])
  const [listUpdate, setListUpdate] = useState(false)

  useEffect(() => {
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

      <div className="m-5 Image-list">
        {imageList.map(image => (
          <div key={image} className="text-md-center">
            <img  src={PORT + image} alt="" className="Image"/>
          </div>
        ))}
      </div>
    </Fragment>
  )
}

export default App;
