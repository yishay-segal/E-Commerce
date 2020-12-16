import React from 'react';
import { Drawer, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import laptop from '../../images/laptop.png';

export default function SideDrawer() {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector(state => ({ ...state }));

  const imageStyle = {
    width: '100%',
    height: '50%',
    objectFit: 'contain',
  };

  console.log('cart', cart);
  return (
    <Drawer
      className="text-center"
      title={`Cart / ${cart.length} Product`}
      onClose={() =>
        dispatch({
          type: 'SET_VISIBLE',
          payload: false,
        })
      }
      visible={drawer}
    >
      {cart.map((p, i) => (
        <div key={p._id} className="row">
          <div className="col">
            {p.images[0] ? (
              <>
                <img src={p.images[0].url} style={imageStyle} alt="product" />
                <p className="text-center bg-secondary text-light">
                  {p.title} x {p.count}{' '}
                </p>
              </>
            ) : (
              <>
                <img src={laptop} style={imageStyle} alt="product" />
                <p className="text-center bg-secondary text-light">
                  {p.title} x {p.count}{' '}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
      <Link to="/cart">
        <button
          onClick={() =>
            dispatch({
              type: 'SET_VISIBLE',
              payload: false,
            })
          }
          className="text-center btn btn-primary btn-rasied btn-block"
        >
          Go To Cart
        </button>
      </Link>
    </Drawer>
  );
}
