import React from 'react';
import Header from './components/header/Header';
import './App.css';
import "antd/dist/antd.css"

export default (props) => {
  return (
    <div className="layout" >
      <Header />
      <div className="container">
      { props.children }
      </div>
    </div> 
  );
};
