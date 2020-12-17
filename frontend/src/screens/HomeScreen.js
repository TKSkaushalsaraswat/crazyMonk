import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { Link, Route } from "react-router-dom";
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
        <Route
          render={({ match }) => (
            <FilterProduct
              categoryName="hoddie"
              heading="Latest Men's Hoddies"
              match={match}
            />
          )}
        />
      </div>
      <div className="px-5 py-3">
        <Route
          render={({ match }) => (
            <FilterProduct
              categoryName="cups"
              heading="Latest Coffee Mugs"
              match={match}
            />
          )}
        />
      </div>
      <div className="px-5 py-3">
        <Route
          render={({ match }) => (
            <FilterProduct
              categoryName="cases"
              heading="Latest Phone's Cases"
              match={match}
            />
          )}
        />
      </div>
      <div className="px-5 py-3">
        <Route
          render={({ match }) => (
            <FilterProduct
              categoryName="whoddies"
              heading="Latest Women's Hoddie"
              match={match}
            />
          )}
        />
      </div>
      <div className="px-5 py-3">
        <Route
          render={({ match }) => (
            <FilterProduct
              categoryName="mtshirt"
              heading="Latest Man's T-Shirts"
              match={match}
            />
          )}
        />
      </div>
      <div className="px-5 py-3">
        <Route
          render={({ match }) => (
            <FilterProduct
              categoryName="wtshirt"
              heading="Latest Women's T-Shirts"
              match={match}
            />
          )}
        />
      </div>
      <div className="px-5 py-3">
        <Route
          render={({ match }) => (
            <FilterProduct
              categoryName="pillows"
              heading="Latest Pillows & Cushion"
              match={match}
            />
          )}
        />
      </div>
    </>
  );
};

export default HomeScreen;
