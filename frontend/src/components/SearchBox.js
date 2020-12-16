import React, { useState } from "react";
import { Form } from "react-bootstrap";

const SearchBox = ({ history }) => {
  const [keyword, setKeyeword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push("/");
    }
  };

  return (
    <Form className="form" onSubmit={submitHandler} inline>
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyeword(e.target.value)}
        placeholder="Search Products...."
        className="mr-sm-2 ml-sm-5 form-controll"
      ></Form.Control>
      <button type="submit" className="p-2 nav-btn">
        <i className="fas fa-search nav-icon"></i>
      </button>
    </Form>
  );
};

export default SearchBox;
