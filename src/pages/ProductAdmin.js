import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import ShowMoreText from 'react-show-more-text';
import rupiahFormat from 'rupiah-format';
import { useQuery, useMutation } from 'react-query';

import Navbar from '../components/Navbar';
// import NavbarAdmin from '../components/NavbarAdmin';
import DeleteData from '../components/modal/DeleteData';
import AddProduct from '../components/modal/AddProduct';
import imgEmpty from '../assets/empty.svg';

import { API } from '../config/api';

export default function ProductAdmin() {
  let navigate = useNavigate();

  const title = 'Product admin';
  document.title = 'Nutech | ' + title;

  const [idProduct, setIdProduct] = useState(null);
  const [addProduct, setAddProduct] = useState(null);

  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [shows, setShows] = useState(false);
  const addClose = () => setShows(false);
  const addShow = () => setShows(true);

  let { data: products, refetch } = useQuery('productsCache', async () => {
    const response = await API.get('/products');
    return response.data.data;
  });

  const handleProduct = () => {
    setIdProduct();
    addShow();
    // navigate('/add-product/');
  };

  const handleUpdate = (id) => {
    navigate('/update-product/' + id);
  };

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  const deleteById = useMutation(async (id) => {
    try {
      await API.delete(`/product/${id}`);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (confirmDelete) {
      handleClose();
      deleteById.mutate(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  return (
    <>
      <Navbar title={title} />
      {/* <NavbarAdmin title={title} /> */}
      <hr/>
      <Container className="py-5">
        <Row>
          <Col xs="6">
            <div className="text-header-product mb-4">List Barang</div>
          </Col>
          <Col xs="6" className="text-end">
            <Button
              onClick={addProduct}
              className="btn-dark"
              style={{ width: '100px' }}
              onClick={() => {
                handleProduct();
              }}
              className="btn-sm btn-danger"
              style={{ width: '135px' }}
            >
              Add
            </Button>
          </Col>
          <Col xs="12">
            {products?.length !== 0 ? (
              <Table striped hover size="lg" variant="dark">
                <thead>
                  <tr>
                    <th width="1%" className="text-center">
                      No
                    </th>
                    <th className='dflex text-center'>Foto Barang</th>
                    <th className='dflex text-center'>Nama Barang</th>
                    {/* <th>Product Desc</th> */}
                    <th className='dflex text-center'>Harga Beli</th>
                    <th className='dflex text-center'>Harga Jual</th>
                    <th className='dflex text-center'>Qty</th>
                    <th className='dflex text-center'>Pilihan</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle text-center">{index + 1}</td>
                      <td className="align-middle">
                        <img
                          src={item.image}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                          }}
                          alt={item.name}
                        />
                      </td>
                      <td className="align-middle">{item.name}</td>
                      <td className="align-middle dflex text-center">
                        {rupiahFormat.convert(item.sell)}
                      </td>
                      <td className="align-middle dflex text-center">
                        {rupiahFormat.convert(item.buy)}
                      </td>
                      <td className="align-middle dflex text-center">{item.qty}</td>
                      <td className="align-middle dflex text-center">
                        <Button
                          onClick={() => {
                            handleUpdate(item.id);
                          }}
                          className="btn-sm btn-success me-2"
                          style={{ width: '135px' }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            handleDelete(item.id);
                          }}
                          className="btn-sm btn-danger"
                          style={{ width: '135px' }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center pt-5">
                <img
                  src={imgEmpty}
                  className="img-fluid"
                  style={{ width: '40%' }}
                  alt="empty"
                />
                <div className="mt-3">No data product</div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <AddProduct
        // setAddProduct={setAddProduct}
        show={shows}
        addClose={addClose}
      />
      <DeleteData
        setConfirmDelete={setConfirmDelete}
        show={show}
        handleClose={handleClose}
      />
    </>
  );
}
