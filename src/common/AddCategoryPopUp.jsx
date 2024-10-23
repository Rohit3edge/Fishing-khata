import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Import Bootstrap Modal
import Loader from './Loader';
import { ListCategories, Addcategory } from '../store/slices/items';
import { useDispatch, useSelector } from 'react-redux';

const AddCategoryPopUp = ({ show, onClose, onCategoryAdded  }) => {
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [listCategories, setListCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    profile_id: id,
    parent_category_id: '0',
    category_name: '',
  });


  const handleCloseModal = () => {
    onClose(); // Call the function passed from the parent
};

  useEffect(() => {
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
        onCategoryAdded()
        handleCloseModal(); // Close the modal after submission
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };

  return (
    <>
      {isLoading && <Loader />}
      {/* Modal to display AddCategory form */}
      <Modal show={show} onHide={handleCloseModal} centered>
        <Modal.Header>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <div className="row">
              <div className="col-md-6">
                <label>
                  Parent Category <span className="required">*</span>
                </label>
                <select
                  name="parent_category_id"
                  className="form-control"
                  value={formData.parent_category_id}
                  onChange={handleChange}
                >
                  <option value="0">New Parent</option>
                  {renderCategoryOptions(listCategories)}
                </select>
                {errors.parent_category_id && <span className="text-danger">{errors.parent_category_id}</span>}
              </div>
              <div className="col-md-6">
                <label>
                  Category Name <span className="required">*</span>
                </label>
                <input
                  name="category_name"
                  type="text"
                  className="form-control"
                  value={formData.category_name}
                  onChange={handleChange}
                />
                {errors.category_name && <span className="text-danger">{errors.category_name}</span>}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-cancel" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="btn ripple btn-default" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddCategoryPopUp;
