import React, { useState } from 'react';
import { Card, Tabs, Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Laptop from '../../images/laptop.png';
import ProductListItems from './ProductListItems';
import StarRatings from 'react-star-ratings';
import RatingModal from '../modal/RatingModal';
import { showAverage } from '../../functions/rating';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist } from '../../functions/user';
import { toast } from 'react-toastify';

const { TabPane } = Tabs;

// this is children component of Product page
const SingleProduct = ({ product, onStarClick, star }) => {
  const { title, images, description, _id } = product;
  const [tooltip, setTooltip] = useState('Click to add');

  // redux
  const { user, cart } = useSelector(state => ({ ...state }));
  const dispatch = useDispatch();
  //router
  const history = useHistory();

  const handleAddToCart = () => {
    // create cart array
    let cart = [];
    if (window) {
      // if cart is in local storage Get it
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }
      // push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      // remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);

      // save to local storage
      console.log('unique', unique);
      localStorage.setItem('cart', JSON.stringify(unique));
      setTooltip('Added');

      // add to redux state
      dispatch({
        type: 'ADD_TO_CART',
        payload: unique,
      });
      dispatch({
        type: 'SET_VISIBLE',
        payload: true,
      });
    }
  };

  const handleAddToWishlist = e => {
    e.preventDefault();
    addToWishlist(product._id, user.token).then(res => {
      console.log('Added to wishlist', res.data);
      toast.success('Added to wishlist');
      history.push('/user/wishlist');
    });
  };

  return (
    <>
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images &&
              images.map(i => (
                <div key={i.public_id}>
                  <img src={i.url} alt="Computer photos" />
                </div>
              ))}
          </Carousel>
        ) : (
          <Card
            cover={<img alt="computer" src={Laptop} className="mb-3" />}
          ></Card>
        )}

        <Tabs type="card">
          <TabPane tab="Description" key="1$l;">
            {description && description}
          </TabPane>
          <TabPane tab="More" key="2#$1.">
            Call use on xxx xxxx xxxx to learn more about this product
          </TabPane>
        </Tabs>
      </div>

      <div className="col-md-5">
        <h1 className="bg-info p-3">{title}</h1>

        {product && product.ratings && product.ratings.length ? (
          showAverage(product)
        ) : (
          <div className="text-center pt-1 pb-3">No rating yet</div>
        )}

        <Card
          actions={[
            <Tooltip title={tooltip}>
              <a onClick={handleAddToCart}>
                <ShoppingCartOutlined className="text-danger" />
                <br /> Add to Cart
              </a>
              ,
            </Tooltip>,
            <a onClick={handleAddToWishlist}>
              <HeartOutlined />
              <br />
              Add to wishlist
            </a>,
            <RatingModal>
              <StarRatings
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
