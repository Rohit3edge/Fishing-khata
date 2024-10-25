import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { ListCategories} from '../store/slices/items';
import Navbarside from "./Navbarside";
import Loader from "../common/Loader"
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from './AdminLayout';

const Categories = () => {

    const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?.data?.id; 
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);
  const [listCategories, setListCategories] = useState([]);

  React.useEffect(() => {
    setIsLoading(true);
    dispatch(ListCategories({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListCategories(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const renderCategories = (categories) => {
    return (
      <>
        {!categories?.length ? (
          <h2 className="text-center">Categories not found</h2>
        ) : (
          categories.map((category) => (
            <li key={category.id}>
              {category.category_name}&nbsp;
              [<a href="#" className="link">Edit</a>]
              {category.children && category.children.length > 0 && (
                <ul className="sub-categories">
                  {renderCategories(category.children)}
                </ul>
              )}
            </li>
          ))
        )}
      </>
    );
  };
  

  return (
    <AdminLayout>
      {isLoading && <Loader />}
        <div className="row content-body">
                <div className="container-fluid">
                    <div className="page-header">
                        <div>
                            <h2 className="main-content-title tx-24 mg-b-5">Categories</h2>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Item</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Category List</li>
                            </ol>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className="btn ripple btn-default" onClick={()=>navigate("/addcategory")}>Add Category</button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <div className="card custom-card">
                                        <div className="card-body">
                                            
                                            <div className="listgroup-example2">
                                                <ul className="list-group">
                                                    {renderCategories(listCategories) }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
            </div>
          </AdminLayout>
  )
}


export default Categories