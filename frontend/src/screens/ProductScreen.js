import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactImageMagnify from "react-image-magnify";
import { Row, Col, ListGroup, Card, Button, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import {
  listProductDetails,
  createProductReviewAction,
} from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import Meta from "../components/Meta";

const ProductScreen = ({ match, history }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [phoneName, setPhoneName] = useState("");
  const [size, setSize] = useState("XL");

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productCreateReview = useSelector((state) => state.productCreateReview);
  const {
    error: errorProductReview,
    success: successProductReview,
  } = productCreateReview;

  useEffect(() => {
    if (successProductReview) {
      alert("Review Submitted!");
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match, successProductReview]);

  const addToCartHandler = () => {
    if (product.category === "cases") {
      history.push(
        `/cart/${match.params.id}?phone:${phoneName.trim()}?qty=${qty}`
      );
    } else {
      history.push(`/cart/${match.params.id}?size:${size}?qty=${qty}`);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReviewAction(match.params.id, {
        rating,
        comment,
      })
    );
  };

  return (
    <div className="product-screen_container">
      <Link to="/" className="btn btn-light my-3">
        <i className="fas fa-long-arrow-alt-left"></i> Go Back
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <ReactImageMagnify
                {...{
                  smallImage: {
                    src: `${product.image}`,
                    isFluidWidth: true,
                    alt: product.name,
                  },
                  largeImage: {
                    src: `${product.image}`,
                    width: 1200,
                    height: 1200,
                    alt: product.name,
                  },
                  enlargedImageContainerDimensions: {
                    width: "70%",
                    height: "80%",
                  },
                  enlargedImageContainerClassName: "largImage",
                }}
              />
              {/* <Image src={product.image} alt={product.name} fluid /> */}
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3 className="product-name">{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={` ${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ₹{product.price}</ListGroup.Item>
                {product.category === "cases" && (
                  <ListGroup.Item>
                    <Form.Group controlId="phonename">
                      <Row>
                        <Form.Control
                          row="3"
                          required
                          placeholder="Enter Phone Name"
                          value={phoneName}
                          onChange={(e) => setPhoneName(e.target.value)}
                        ></Form.Control>
                      </Row>
                    </Form.Group>
                  </ListGroup.Item>
                )}
                {(product.category === "hoodie" ||
                  product.category === "whoodies" ||
                  product.category === "mtshirt" ||
                  product.category === "wtshirt") && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Size:</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={size || ""}
                          onChange={(e) => {
                            setSize(e.target.value);
                          }}
                        >
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XLL">XLL</option>
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  Description : {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>₹{product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out Of Stock"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => {
                              setQty(e.target.value);
                            }}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block orange-btn"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      <i className="fas fa-shopping-cart"></i> Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="py-5 reviews-class">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Label>Rating</Form.Label>
                      <Form.Group controlId="rating">
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button className="blue-btn" type="submit">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6} className="py-5">
              <h2 className="px-2">Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              {product.reviews.map((review) => (
                <Card className="reviewCard" key={review._id}>
                  <ListGroup.Item className="reviewCardItem">
                    <p>Date: {review.createdAt.substring(0, 10)}</p>
                    <h4 className="reviewName">{review.name}</h4>
                    <Rating className="rating" value={review.rating} />
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                </Card>
              ))}
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ProductScreen;
