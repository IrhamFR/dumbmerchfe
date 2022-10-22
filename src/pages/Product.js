import { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { Container, Row, Col, InputGroup, Form, Card } from 'react-bootstrap';
import {BiSearchAlt} from 'react-icons/bi'
import { UserContext } from '../context/userContext';
import { useQuery } from 'react-query';
import Navbar from '../components/Navbar';
import ProductCard from '../components/card/ProductCard';
import imgEmpty from '../assets/empty.svg';
import Pagination from '@material-ui/lab/Pagination';

// API config
import { API } from '../config/api';

export default function Product() {
  const title = 'Beli Barang';
  document.title = 'Nutech | ' + title;

  const [dataFilter, setDataFilter] = useState([])
  
  let { data: products } = useQuery('productsCache', async () => {
    const response = await API.get('/products');
    return response.data.data;
  });

  console.log(products);


  function handleChangeLiterature(e) {
    if (!e.target.value) { 
      setDataFilter(products); 
      return;
    }
    const filter = products?.filter((item) => {
      return item.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setDataFilter(filter);
  }

  useEffect(() => {
    if (products) setDataFilter(products);
  }, [products]);

  const breakpointColumnsObj = {
    default: 6,
    1100: 4,
    700: 3,
    500: 2,
  };

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <Navbar title={title} />
      <hr/>
      <Container className="mt-5">
        <Row>
          <Col>
            <div className="text-header-product">Beli Barang</div>
          </Col>
          <InputGroup className="mb-3" style={{width:"25%"}}>
            <InputGroup.Text id="basic-addon1" style={{border:"none", backgroundColor:"#E7E7E7"}}><BiSearchAlt /></InputGroup.Text>
              <Form.Control
                placeholder="Search"
                aria-label="Search"
                aria-describedby="basic-addon1"
                style={{border:"none", backgroundColor:"#E7E7E7"}}
                onChange={handleChangeLiterature}
              />
          </InputGroup>
        </Row>
        
        <Row className="my-4">
          {products?.length !== 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {products?.map((item, index) => (
                <ProductCard item={item} key={index} />
              ))}
            </Masonry>
            // <Col md={8} style={{ width: "250px", height: "400px" }}>
            //     {products?.map((item, index) => (
            //     <ProductCard item={item} key={index} />
            //   ))}
            //  </Col>
          ) : (
            <Col>
              <div className="text-center pt-5">
                <img
                  src={imgEmpty}
                  className="img-fluid"
                  style={{ width: '40%' }}
                  alt="empty"
                />
                <div className="mt-3">No data product</div>
              </div>
            </Col>
          )}
        </Row>
          
          <Col md={{ span: 6, offset: 4 }}><Pagination count={10} className="ms-4"/></Col>
      </Container>
    </div>
  );
}
