import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import Products from "../components/Products";
import { listProducts } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Pagination from "../components/Paginate";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";

const AllOffersScreen = ({ match }) => {
  const keyword = match.params.keyword;
  const cat = match.params.cat;

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);

  const { loading, error, products, pages, page } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <div className="showAllParent">
      <Meta />
      <Link to="/" className="btn btn-light my-3">
        <i className="fas fa-long-arrow-alt-left"></i> Go Back
      </Link>
      <h1 className="showAllHeading">Today All Offers</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="showAllContainer">
          <Row>
            {products
              .filter((p) => p.category === cat)
              .map((product) => (
                <Col
                  className="showAllCol"
                  key={product._id}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                >
                  <Products product={product} />
                </Col>
              ))}
          </Row>
          <Pagination
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </div>
      )}
    </div>
  );
};

export default AllOffersScreen;
