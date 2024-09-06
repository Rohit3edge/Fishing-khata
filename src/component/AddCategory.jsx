import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { ListCategories, Addcategory } from '../store/slices/items';
import { useDispatch, useSelector } from 'react-redux';
const AddCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);
  const [listCategories, setListCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    profile_id: id,
    parent_category_id: '0',
    category_name: '',
  });

  React.useEffect(() => {
    setIsLoading(true);
    dispatch(ListCategories({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListCategories(data?.data);
        console.log(data.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const renderCategoryOptions = (categories, level = 0) => {
    return categories.map((category) => (
      <React.Fragment key={category.id}>
        <option value={category.id}>
          {'\u00A0'.repeat(level * 4)} {category.category_name}
        </option>
        {category.children && category.children.length > 0 && renderCategoryOptions(category.children, level + 1)}
      </React.Fragment>
    ));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    console.log(formData);
    e.preventDefault();
    const newErrors = {};
    if (!formData.parent_category_id) {
      newErrors.parent_category_id = 'Parent Category is required';
    }
    if (!formData.category_name.trim()) {
      newErrors.category_name = 'Category Name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    dispatch(Addcategory(formData))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setFormData({
          profile_id: id,
          parent_category_id: '0',
          category_name: '',
        });
        navigate('/categories');
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };

  return (
    <div>
      <div class="row" style={{ marginLeft: '0', marginRight: '0' }}>
        <Navbarside />
        {isLoading && <Loader />}
        <div className="col-md-10">
          <div className="row top-header">
            <div className="col-md-7">
              <div className="company-name">{Name}</div>
            </div>
            <div className="col-md-5">
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-default" onClick={() => navigate('/ledger')}>
                  Ledger
                </button>
                <button type="submit" className="btn btn-default" onClick={() => navigate('/invoice')}>
                  Sale
                </button>
                <button type="submit" className="btn btn-default">
                  Purchase
                </button>
              </div>
            </div>
          </div>
          <div className="row content-body">
            <div className="container">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Category</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Items</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Add Category
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={handleSubmit}>
                    Save
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-md-8">
                  <div className="card custom-card">
                    <div className="card-body">
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-6">
                            <label>
                              Parent Category <span className="required">*</span>
                            </label>
                            <select name="parent_category_id" className="form-control" value={formData.parent_category_id} onChange={handleChange}>
                              {renderCategoryOptions(listCategories)}
                            </select>
                            {errors.parent_category_id && <span className="text-danger">{errors.parent_category_id}</span>}
                          </div>
                          <div className="col-md-6">
                            <label>
                              Category Name <span className="required">*</span>
                            </label>
                            <input name="category_name" type="text" className="form-control" value={formData.category_name} onChange={handleChange} />
                            {errors.category_name && <span className="text-danger">{errors.category_name}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddCategory;
