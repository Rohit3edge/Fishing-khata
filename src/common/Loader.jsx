import React from "react";

const Loader = ({isLogin}) => {
  return (
    <div className="loader-container" style={ isLogin ?{width:"100%",left:"0"}:{}}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;