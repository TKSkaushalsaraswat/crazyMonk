import React from "react";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import { Col, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import Products from "./Products";
import Loader from "./Loader";
import Message from "./Message";

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <button id="next" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
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
        width="28"
        height="28"
        viewBox="0 0 24 24"
      >
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M15.61 7.41L14.2 6l-6 6 6 6 1.41-1.41L11.03 12l4.58-4.59z" />
      </svg>
    </button>
  );
}

const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    See all offers
  </Tooltip>
);

function ShowMore(props) {
  const { onClick } = props;
  return (
    <>
      <OverlayTrigger
        placement="top"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
      >
        <button id="showMore" onClick={onClick}>
          <i className="far fa-arrow-alt-circle-right fa-3x arrow-ic"></i>
        </button>
      </OverlayTrigger>
    </>
  );
}

const FilterProduct = ({ categoryName, heading = "Latest Products" }) => {
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

  const productList = useSelector((state) => state.productList);

  const { loading, error, products } = productList;

  return (
    <>
      <h1 className="px-3 py-1">{heading}</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Slider className="slider-bg" {...settings}>
            {products
              .filter((p) => p.category === categoryName)
              .map((product) => (
                <Col className="product-class" key={product._id}>
                  <Products product={product} />
                </Col>
              ))
              .filter((_, i) => i < 7)}
            <Card className="my-2 p-3 card-class rounded" id="show-class">
              <ShowMore />
            </Card>
          </Slider>
          {/* <Pagination
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ""}
            /> */}
        </>
      )}
    </>
  );
};

export default FilterProduct;
