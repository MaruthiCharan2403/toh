import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader.js'; // Assuming you have a Loader component

export default function GuestUpload() {
  const [im, setIm] = useState([]);
  const [classificationResult, setClassificationResult] = useState([]);
  const [base64String, setBase64String] = useState([]);

  const handleFileChange = (e) => {
    setClassificationResult([]);
    setBase64String([]);
    setIm([]);

    for (let i = 0; i < e.target.files.length; i++) {
      const selected = e.target.files[i];
      setIm((s) => [...s, selected]);
      function convertToBase64(selected) {
        if (selected) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base = e.target.result;
            setBase64String((b) => [...b, base]);
          };
          reader.readAsDataURL(selected);
        } else {
          console.log('Error converting to base64String');
        }
      }
      convertToBase64(selected);
    }
  };

  const handleUpload = async (e) => {
    setClassificationResult([]);
    e.preventDefault();

    if (im.length > 0) {
      const formData = new FormData();
      formData.append('GuestuploadImage', im);

      for (let i = 0; i < im.length; i++) {
        const gui = `GuestuploadImage${i}`;
        formData.append(gui, im[i]);
      }

      try {
        const response = await axios.post(`http://${window.location.hostname}:4000/guestUp`, formData);
        setClassificationResult(response.data);
      } catch (error) {
        console.log('Error occurred in making request to server side from GuestUpload.js', error);
      }
    } else {
      console.error('No file selected');
    }
  };

  return (
    <div className="parentgu">
      <div className="GuestUpload container m-0 shadow-lg rounded-4 border border-black">
        <form onSubmit={handleUpload} id="form">
          <div className="row text-center mb-3">
            <h1>Upload Tire</h1>
          </div>
          <div className="image row">
            <div className="col">
              <input onChange={handleFileChange} type="file" multiple accept="image/*" name="tyre" className="image form-control" required />
            </div>
            <div className="row">
              <div className="col mt-2">
                <button type="submit" className="btn btn-dark imageSub">
                  Submit
                </button>
              </div>
              <div className="col mt-2">
                {classificationResult.length > 0 && (
                  <button className="btn btn-dark mb-2 ms-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
                    Result
                  </button>
                )}
              </div>
              <div className="col-sm-4">
                <Link to="/guest">
                  <button className="btn btn-dark back mt-2 mb-2 col">Go Back</button>
                </Link>
              </div>
            </div>

            <div className="row mb-2">
              {/* No loader */}
            </div>

            <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
                  Result
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                {classificationResult.map((item, index) => (
                  <div className="row text-center mb-4 mt-3" key={index}>
                    <p>Classification : {item.class} </p>
                    <p>Confidence : {item.confidence} </p>
                    <div id="getImg">
                      <img
                        className="enlarge"
                        style={{ width: '200px', height: 'auto', borderRadius: '10px', transition: 'width 0.3s ease' }}
                        src={base64String[index]}
                        alt="Vehicle Tire"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
