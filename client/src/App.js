import React, {Fragment, useEffect, useState} from 'react'

function App() {
  const [file, setFile] = useState(null)
  const [imageList, setImageList] = useState([])
  const [listUpdate, setListUpdate] = useState(false)

  useEffect(() => {
    fetch('http://localhost:9000/images/get')
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

    fetch('http://localhost:9000/images/post', {
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
          <div className="row">
            <div className="col-10">
              <input id="fileinput" onChange={selectedHandler} className="form-control" type="file"/>
            </div>
            <div className="col-2">
              <button onClick={sendHandler} type="button" className="btn btn-primary col-12">Upload</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-3" style={{display: "flex"}}>
        {imageList.map(image => (
          <div key={image} className="card m-2">
            <img  src={'http://localhost:9000/' + image} alt="" className="card-img-top" style={{height: "200px", width: "150px"}}/>
          </div>
        ))}
      </div>
    </Fragment>
  )
}

export default App;
