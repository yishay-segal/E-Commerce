import React, { useState, useEffect } from 'react';
import UserNav from '../../components/nav/UserNav';
import { getWishlist, removeWishlist } from '../../functions/user';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useSelector(state => ({ ...state }));

  const loadWishlist = () =>
    getWishlist(user.token).then(res => {
      setWishlist(res.data.wishlist);
    });

  const handleRemove = productId =>
    removeWishlist(productId, user.token).then(res => {
      loadWishlist();
    });

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="colu-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Wishlist</h4>

          {wishlist.map(p => (
            <div className="alert alert-secondary" key={p._id}>
              <Link to={`/product/${p.slug}`}>{p.title}</Link>
              <span
                className="btn btn-sm float-right"
                onClick={() => handleRemove(p._id)}
              >
                <DeleteOutlined className="text-danger" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
