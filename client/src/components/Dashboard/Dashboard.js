import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import './Dashboard.css';
import Navbar from '../Navbar/Navbar';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    let shouldRedirect = false;
    if (localStorage.getItem('userTokenTime')) {
      // Check if user holds token which is valid in accordance to time
      const data = JSON.parse(localStorage.getItem('userTokenTime'));
      if (new Date().getTime() - data.time > (1 * 60 * 60 * 1000)) {
        // It's been more than hour since you have visited dashboard
        localStorage.removeItem('userTokenTime');
        shouldRedirect = true;
      }
    } else {
      shouldRedirect = true;
    }

    this.state = {
      redirect: shouldRedirect,
      imageList: []
    }
  }

  componentDidMount() {
    if (localStorage.getItem('userTokenTime')) {
      axios.get('http://127.0.0.1:3333/api/imageList', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userTokenTime')).token
        }
      }).then(res => {
        this.setState({
          imageList: res.data
        });
      });
    }
  }

  render() {
    if (this.state.redirect) return <Redirect to="/signIn" />

    const images = this.state.imageList.map(image => {
      return (
        <div className="image col-xs-12 col-sm-12 col-md-3 col-lg-4" key={image._id}>
          <Link to={'/image/' + image.upload_title}>
            <div className="image-thumbnail">
              <img src={image.thumbnail_path} alt="image thubmnail" />
            </div>
          </Link>
          <span className="username">
            <Link to={'/api/images/' + image.upload_title}>
              {image.uploader_name}
            </Link>
          </span>
          <span className="image-title">{image.upload_title.replace(/_/g, ' ')}</span>
        </div>
      );
    });

    return (
      <React.Fragment>
        <Navbar />
        <div className="container mt-5">
          <h4>Images</h4>
          <hr className="my-4" />

          <div className="streams row">
            {images}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
