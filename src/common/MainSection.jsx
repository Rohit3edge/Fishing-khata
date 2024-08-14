import React from 'react'

const MainSection = ({ selectedNav }) => {
  return (
    <div>
        <div class="col-md-10">
         <div className="row content-body">
                <div className="container-fluid">
                    <div className="page-header">
                        <div>
                            <h2 className="main-content-title tx-24 mg-b-5">{ selectedNav }</h2>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active" aria-current="page">{ selectedNav }</li>
                            </ol>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="card custom-card">
                                <div className="card-body">
                                    Graphs and Charts
                                </div>
                            </div>    
                        </div>
                        
                    </div>
                </div>
            </div>
    </div>
    </div>
  )
}

export default MainSection


      {/* <div className="drop-user" id="usermenu">
        <ul className="user-p">
          <li className="user-text">
            <NavLink to="/profile">
              <FaBuromobelexperte className="user-icon-style-mod" />
              My Profile
            </NavLink>
          </li>
          <li className="user-text">
            <Link to="/login" onClick={signOut}>
              <MdOutlineLogout className="user-icon-style-mod" />
              Logout
            </Link>
          </li>
        </ul>
      </div> */}