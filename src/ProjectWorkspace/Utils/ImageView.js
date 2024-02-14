import React from 'react';
import './ImageView.css'
import IMG2D from '../Img/MAP_VECTOR.jpg'
import IMG3D from '../Img/MAP_TERRAIN.jpg'
import IMGGEO from '../Img/MAP_GEO.jpg'

class ImageView extends React.Component {
  
    img() {
        if (this.props.text == "2D" && this.props.status == 1) {
            const img = <img src={IMG2D} style={{height: '100%'}} width="100%" height="100%" alt="cam" className="img" onLoad={() => {this.props.setIsImgLoad(true); console.log('성공')}} onError={() => {this.props.setIsImgLoad(false); console.log('실패')}}/>
            return img
        } else if (this.props.text == "3D" && this.props.status == 1) {
            const img = <img src={IMG3D} style={{height: '100%'}} width="100%" height="100%" alt="cam" className="img" onLoad={() => this.props.setIsImgLoad(true)} onError={() => this.props.setIsImgLoad(false)}/>
            return img
        } else if (this.props.text == "GEOMETRY" && this.props.status == 1) {
            const img = <img src={IMGGEO} height="100%" alt="cam" onLoad={() => this.props.setIsImgLoad(true)} onError={() => this.props.setIsImgLoad(false)}/>
            return img
        }
    }

  render() {
    const name = this.props.status ? "activeClass" : "inactiveClass";
    console.log(this.props.setIsImgLoad);
    
    return (
      <div style={{height: '100%', position: 'relative'}}>
        {this.img()}
      </div>
    );
  }
}

export default ImageView;