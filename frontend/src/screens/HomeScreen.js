import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";
import FilterProduct from "../components/FilterProduct";

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

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
        <FilterProduct categoryName="hoddie" heading="Latest Men's Hoddies" />
      </div>
      <div className="px-5 py-3">
        <FilterProduct categoryName="cups" heading="Latest Cups" />
      </div>
      <div className="px-5 py-3">
        <FilterProduct categoryName="cases" heading="Latest Phone's Cases" />
      </div>
      <div className="px-5 py-3">
        <FilterProduct
          categoryName="whoddies"
          heading="Latest Women's Hoddie"
        />
      </div>
      <div className="px-5 py-3">
        <FilterProduct categoryName="mtshirt" heading="Latest Man's T-Shirts" />
      </div>
      <div className="px-5 py-3">
        <FilterProduct
          categoryName="wtshirt"
          heading="Latest Women's T-Shirts"
        />
      </div>
      <div className="px-5 py-3">
        <FilterProduct categoryName="pillows" heading="Pillows Cover" />
      </div>
    </>
  );
};

export default HomeScreen;
