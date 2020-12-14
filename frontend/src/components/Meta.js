import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
    </>
  );
};

Meta.defaultProps = {
  title: "Welcome to CodeMonk",
  description: "We sell the best product for cheap",
  keywords: "electronins, buy electronics, cheap electronics",
};

export default Meta;
