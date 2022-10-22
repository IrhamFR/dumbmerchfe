import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useMutation } from "react-query";
import { API } from "../../config/api";

export default function AddProductAdmin({ show, addClose, setAddProduct }) {

    const addProduct = () => {
        setAddProduct(true)
    }

    let navigate = useNavigate();

  const [categories, setCategories] = useState([]); //Store all category data
  const [categoryId, setCategoryId] = useState([]); //Save the selected category id
  const [preview, setPreview] = useState(null); //For image preview
  const [form, setForm] = useState({
    image: "",
    name: "",
    // desc: "",
    buy: "",
    sell: "",
    qty: "",
  }); //Store product data

  // Fetching category data
  const getCategories = async () => {
    try {
      const response = await API.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // For handle if category selected
  const handleChangeCategoryId = (e) => {
    const id = e.target.value;
    const checked = e.target.checked;

    if (checked) {
      // Save category id if checked
      setCategoryId([...categoryId, parseInt(id)]);
    } else {
      // Delete category id from variable if unchecked
      let newCategoryId = categoryId.filter((categoryIdItem) => {
        return categoryIdItem != id;
      });
      setCategoryId(newCategoryId);
    }
  };

  // Handle change data on form
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const [message, setMessage] = useState(null);

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      // Store data with FormData as object
      const formData = new FormData();
      formData.set("image", form?.image[0], form?.image[0].name);
      formData.set("name", form.name);
      // formData.set("desc", form.desc);
      formData.set("buy", form.buy);
      formData.set("sell", form.sell);
      formData.set("qty", form.qty);
      formData.set("categoryId", categoryId);

      // Insert product data
      const response = await API.post("/product", formData, config);
      console.log("response.data.data");
      console.log(response.data.data);

      if (response.data.code == 200) {
        navigate("/product-admin");
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          File harus format PNG dengan size 100kb
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  });

  useEffect(() => {
    getCategories();
  }, []);

    return (
        <Modal show={show} onHide={addClose} centered>
            <Modal.Body className="bg-secondary">
                <Row>
                    <Col xs="12">
                        <div className="text-header-category mb-4">Tambah Barang</div>
                    </Col>
                    <Col xs="12">
                        <form onSubmit={(e) => handleSubmit.mutate(e)}>
                        {preview && (
                            <div>
                            <img
                                src={preview}
                                style={{
                                maxWidth: "150px",
                                maxHeight: "150px",
                                objectFit: "cover",
                                }}
                                alt={preview}
                            />
                            </div>
                        )}
                        <input
                            type="file"
                            id="upload"
                            name="image"
                            accept="image"
                            hidden
                            onChange={handleChange}
                        />
                        <label for="upload" className="label-file-add-product">
                            Upload file
                        </label>
                        <input
                            type="text"
                            placeholder="Nama Barang"
                            name="name"
                            onChange={handleChange}
                            className="input-edit-category mt-4"
                        />
                        {/* <textarea
                            placeholder="Product Desc"
                            name="desc"
                            onChange={handleChange}
                            className="input-edit-category mt-4"
                            style={{ height: "130px" }}
                        ></textarea> */}
                        <input
                            type="number"
                            placeholder="Harga Beli (Rp.)"
                            name="buy"
                            onChange={handleChange}
                            className="input-edit-category mt-4"
                        />
                        <input
                            type="number"
                            placeholder="Harga Jual (Rp.)"
                            name="sell"
                            onChange={handleChange}
                            className="input-edit-category mt-4"
                        />
                        <input
                            type="number"
                            placeholder="Stock"
                            name="qty"
                            onChange={handleChange}
                            className="input-edit-category mt-4"
                        />

                        <div className="card-form-input mt-4 px-2 py-1 pb-2">
                            <div
                            className="text-secondary mb-1"
                            style={{ fontSize: "15px" }}
                            >
                            Kategori
                            </div>
                            {categories.map((item, index) => (
                            <label className="checkbox-inline me-4" key={index}>
                                <input
                                type="checkbox"
                                value={item.id}
                                onClick={handleChangeCategoryId}
                                />{" "}
                                {item.name}
                            </label>
                            ))}
                        </div>

                        <div className="d-grid gap-2 mt-4">
                            <Button onClick={addClose} type="submit" variant="success" size="md">
                            Add
                            </Button>
                        </div>
                        </form>
                    </Col>
                </Row>
                {/* <div style={{fontSize: '20px', fontWeight: '900'}}>
                    Delete Data
                </div>
                <div style={{fontSize: '16px', fontWeight: '500'}} className="mt-2">
                    Are you sure you want to delete this data?
                </div>
                <div className="text-end mt-5">
                    <Button onClick={handleDelete} size="sm" className="btn-success me-2" style={{width: '135px'}}>Yes</Button>
                    <Button onClick={handleClose} size="sm" className="btn-danger" style={{width: '135px'}}>No</Button>
                </div> */}
            </Modal.Body>
        </Modal>
    )
}
