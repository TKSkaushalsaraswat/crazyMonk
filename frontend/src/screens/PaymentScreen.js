import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../actions/cartActions";
import CheckOutSteps from "../components/CheckOutSteps";
import FormComponent from "../components/FormComponent";

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);

  const { shippingAddress } = cart;

  if (!shippingAddress) {
    history.push("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("Stripe");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };
  return (
    <FormComponent>
      <CheckOutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Control
              as="select"
              value={paymentMethod || ""}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
              }}
            >
              <option value="Stripe">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="COD">COD</option>
            </Form.Control>
          </Col>
        </Form.Group>

        <Button type="submite" className="blue-btn">
          Continue
        </Button>
      </Form>
    </FormComponent>
  );
};

export default PaymentScreen;
