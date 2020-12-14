import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "react-bootstrap";
import Products from "../components/Products";
import { listProducts } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Pagination from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";
import Slider from "react-slick";

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <button id="next" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z" />
      </svg>
    </button>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <button id="prev" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M15.61 7.41L14.2 6l-6 6 6 6 1.41-1.41L11.03 12l4.58-4.59z" />
      </svg>
    </button>
  );
}

const HomeScreen = ({ match }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);

  const { loading, error, products, pages, page } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mx-5 my-3">
          Go Back
        </Link>
      )}
      <div className="px-5 py-3">
        <h1 className="px-3">Latest Men's Hpddies</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Slider {...settings}>
              {products
                .filter((p) => p.category === "hoddie")
                .map((product) => (
                  <Col className="product-class" key={product._id}>
                    <Products product={product} />
                  </Col>
                ))}
            </Slider>
            {/* <Pagination
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ""}
            /> */}
          </>
        )}
      </div>
      <div className="px-5 py-3">
        <h1 className="px-3">Latest Cups</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Slider {...settings}>
              {products
                .filter((p) => p.category === "cups")
                .map((product) => (
                  <Col className="product-class" key={product._id}>
                    <Products product={product} />
                  </Col>
                ))}
            </Slider>
          </>
        )}
      </div>
      <div className="px-5 py-3">
        <h1 className="px-3">Latest Phone's Cases</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Slider {...settings}>
              {products
                .filter((p) => p.category === "cases")
                // .filter((p) => p.category === "whoddies")
                .map((product) => (
                  <Col className="product-class" key={product._id}>
                    <Products product={product} />
                  </Col>
                ))}
            </Slider>
          </>
        )}
      </div>
      <div className="px-5 py-3">
        <h1 className="px-3">Latest Women's Hoddie</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Slider {...settings}>
              {products
                .filter((p) => p.category === "whoddies")
                .map((product) => (
                  <Col className="product-class" key={product._id}>
                    <Products product={product} />
                  </Col>
                ))}
            </Slider>
          </>
        )}
      </div>
      <div className="px-5 py-3">
        <h1 className="px-3">Latest Man's T-Shirts</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Slider {...settings}>
              {products
                .filter((p) => p.category === "mtshirt")
                .map((product) => (
                  <Col className="product-class" key={product._id}>
                    <Products product={product} />
                  </Col>
                ))}
            </Slider>
          </>
        )}
      </div>
      <div className="px-5 py-3">
        <h1 className="px-3">Pillows Cover</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Slider {...settings}>
              {products
                .filter((p) => p.category === "pillows")
                .map((product) => (
                  <Col className="product-class" key={product._id}>
                    <Products product={product} />
                  </Col>
                ))}
            </Slider>
          </>
        )}
      </div>
    </>
  );
};

export default HomeScreen;
