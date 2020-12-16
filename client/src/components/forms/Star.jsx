import React from 'react';
import StarRatings from 'react-star-ratings';

export default function Star({ starClick, numberOfStars }) {
  return (
    <>
      <StarRatings
        changeRating={() => starClick(numberOfStars)}
        numberOfStars={numberOfStars}
        starDimension="20px"
        starSpacing="2px"
        starHoverColor="red"
        starEmptyColor="red"
      />
      <br />
    </>
  );
}
