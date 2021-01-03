import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderById, payOrder, deliverOrder } from "../actions/orderAction";
import axios from "axios";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import { listProducts } from "../actions/productActions";
import StripeCheckout from "react-stripe-checkout";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

toast.configure();

const OrderScreen = ({ match, history }) => {
  const [sdkReady, setSdkReady] = useState(false);

  const orderId = match.params.id;
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { products, pageNumber } = productList;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { success: deliverSuccess, loading: deliverLoading } = orderDeliver;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading) {
    const addDecimals = (num) => {
      return Math.round((num * 100) / 100).toFixed(2);
    };

    // Calculate price
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, cur) => acc + cur.price * cur.qty, 0)
    );
  }

  const successPaymentHandle = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  async function handleToken(token, addresses) {
    const response = await axios.post("/api/checkout", {
      token,
      order,
    });
    const { status } = response.data;
    // console.log("Response:", response);
    if (status === "success") {
      console.log(response);
      dispatch(payOrder(orderId, response));
      toast("Success! Check email for details", { type: "success" });
    } else {
      toast("Something went wrong", { type: "error" });
    }
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    dispatch(listProducts("", pageNumber));

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || successPay || deliverSuccess) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderById(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      }
    } else {
      setSdkReady(true);
    }
  }, [
    dispatch,
    orderId,
    successPay,
    order,
    deliverSuccess,
    history,
    userInfo,
    pageNumber,
  ]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1 className="mt-5">Order {orderId}</h1>
      <Row className="mb-5">
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>Shipping</h4>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              <div>
                {order.isDelivered ? (
                  <Message variant="success">
                    Paid on {order.deliveredAt}
                  </Message>
                ) : (
                  <Message variant="danger">Not Delivered</Message>
                )}
              </div>
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Payment Method</h4>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              <div>
                {order.isPaid ? (
                  <Message variant="success">Paid on {order.paidAt}</Message>
                ) : (
                  <Message variant="danger">Not Paid</Message>
                )}
              </div>
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Order Items</h4>
              {order.orderItems.length === 0 ? (
                <span> Your cart is empty</span>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        {products
                          .filter(
                            (product) =>
                              (product.category === "hoodie" ||
                                product.category === "whoodies" ||
                                product.category === "mtshirt" ||
                                product.category === "wtshirt") &&
                              product._id === item.product
                          )
                          .map((_, i) => (
                            <Col key={i}>Size: {item.size}</Col>
                          ))}
                        {products
                          .filter(
                            (product) =>
                              product.category === "cases" &&
                              product._id === item.product
                          )
                          .map((_, i) => (
                            <Col key={i}>PhoneName: {item.phoneName}</Col>
                          ))}
                        <Col md={4}>
                          {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && order.paymentMethod === "PayPal" && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandle}
                    />
                  )}
                </ListGroup.Item>
              )}
              {!order.isPaid && order.paymentMethod === "Stripe" && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <StripeCheckout
                      stripeKey="pk_test_51HzEE9Kd1h1wYKmqYKxXswQSlULXFYC2Fpra2KbNamMGQpymoVhxbrpB0OcYiRcy5E0JJC1KSWBKB9XwsjgSmBOv00KguJhKcQ"
                      token={handleToken}
                      amount={order.totalPrice * 100}
                      currency="INR"
                      description="CodeMonk Order"
                      name={`Order ID ${order._id}`}
                      label={`Click To Pay ₹${order.totalPrice} `}
                      billingAddress
                      shippingAddress
                      image="https://i.ibb.co/r03QpCT/59.png"
                    >
                      <Button className="btn btn-block yellow-btn">
                        Click To Pay ₹{order.totalPrice}
                      </Button>
                    </StripeCheckout>
                  )}
                </ListGroup.Item>
              )}
              {deliverLoading && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDeliverd && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
