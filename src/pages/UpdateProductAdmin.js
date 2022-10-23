import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "react-query";

import Navbar from "../components/Navbar";
// import NavbarAdmin from "../components/NavbarAdmin";
import CheckBox from "../components/form/CheckBox";

import dataProduct from "../fakeData/product";

import { API } from "../config/api";

export default function UpdateProductAdmin() {
  const title = "Product admin";
  document.title = "Nutech | " + title;

  let navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]); //Store all category data
  const [categoryId, setCategoryId] = useState([]); //Save the selected category id
  const [preview, setPreview] = useState(null); //For image preview
  const [product, setProduct] = useState({}); //Store product data
  const [form, setForm] = useState({
    image: "",
    name: "",
    // desc: "",
    buy: "",
    sell: "",
    qty: "",
  }); //Store product data

  // Fetching detail product data by id from database
  let { data: products, refetch } = useQuery("productCache", async () => {
    const response = await API.get("/product/" + id);
    return response.data.data;
  });

  // Fetching category data
  let { data: categoriesData, refetch: refetchCategories } = useQuery(
    "categoriesCache",
    async () => {
      const response = await API.get("/categories");
      return response.data.data;
    }
  );

  useEffect(() => {
    if (products) {
      setPreview(products.image);
      setForm({
        ...form,
        name: products.name,
        // desc: products.desc,
        buy: products.buy,
        sell: products.sell,
        qty: products.qty,
      });
      setProduct(products);
    }

    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [products]);

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

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      // Store data with FormData as object
      const formData = new FormData();
      if (form.image) {
        formData.set("image", form?.image[0], form?.image[0]?.name);
      }
      formData.set("name", form.name);
      // formData.set("desc", form.desc);
      formData.set("buy", form.buy);
      formData.set("sell", form.sell);
      formData.set("qty", form.qty);
      formData.set("categoryId", categoryId);
      console.log(categoryId);
      // Insert product data
      const response = await API.patch(
        "/product/" + product.id,
        formData,
        config
      );

      console.clear();
      console.log(products);

      if (response.data.code == 200) {
        navigate("/product-admin");
      }
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    const newCategoryId = product?.category?.map((item) => {
      return item.id;
    });

    setCategoryId(newCategoryId);
  }, [product]);

  return (
    <>
      <Navbar title={title} />
      <hr/>
      <Container className="py-5">
        <Row>
          <Col xs="12">
            <div className="text-header-category mb-4">Update Product</div>
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
                    alt="preview"
                  />
                </div>
              )}
              <input
                type="file"
                id="upload"
                name="image"
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
                value={form?.name}
                className="input-edit-category mt-2"
              />
              {/* <textarea
                placeholder="Product Desc"
                name="desc"
                onChange={handleChange}
                value={form?.desc}
                className="input-edit-category mt-4"
                style={{ height: "130px" }}
              ></textarea> */}
              <input
                type="number"
                placeholder="Harga Beli (Rp.)"
                name="buy"
                onChange={handleChange}
                value={form?.buy}
                className="input-edit-category mt-4"
              />
                <input
                  type="number"
                  placeholder="Harga Jual (Rp.)"
                  name="sell"
                  onChange={handleChange}
                  value={form?.sell}
                  className="input-edit-category mt-4"
                />
              <input
                type="number"
                placeholder="Stock"
                name="qty"
                onChange={handleChange}
                value={form?.qty}
                className="input-edit-category mt-4"
              />

              {/* <div className="card-form-input mt-4 px-2 py-1 pb-2">
                <div
                  className="text-secondary mb-1"
                  style={{ fontSize: "15px" }}
                >
                  Category
                </div>
                {product &&
                  categories?.map((item, index) => (
                    <label key={index} className="checkbox-inline me-4">
                      <CheckBox
                        categoryId={categoryId}
                        value={item?.id}
                        handleChangeCategoryId={handleChangeCategoryId}
                      />
                      <span className="ms-2">{item?.name}</span>
                    </label>
                  ))}
              </div> */}

              <div className="d-grid gap-2 mt-4">
                <Button type="submit" variant="success" size="md">
                  Save
                </Button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
