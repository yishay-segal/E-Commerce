import React, { useEffect, useState } from 'react';

import { Menu, Badge } from 'antd';
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Search from '../../components/forms/Search';

const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState('home');

  let dispatch = useDispatch();
  let { user, cart } = useSelector(state => ({ ...state }));

  let history = useHistory();

  const handleClick = e => {
    setCurrent(e.key);
  };
  // console.log('current ', current);
  // setCurrent(page);

  // useEffect(() => {
  //   setCurrent(page);
  // }, []);

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: 'LOGOUT',
      payload: null,
    });
    history.push('/login');
  };

  return (
    <Menu
      // defaultSelectedKeys={[current]}
      onClick={handleClick}
      selectedKeys={current}
      mode="horizontal"
    >
      <Item key="home" icon={<AppstoreOutlined />}>
        <Link to="/">Home</Link>
      </Item>

      <Item key="shop" icon={<ShoppingOutlined />}>
        <Link to="/shop">Shop</Link>
      </Item>

      <Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link to="/cart">
          <Badge count={cart.length} offset={[9, 0]}>
            Cart
          </Badge>
        </Link>
      </Item>

      {!user && (
        <Item className="float-right" key="register" icon={<UserAddOutlined />}>
          <Link to="/register">Register</Link>
        </Item>
      )}

      {!user && (
        <Item className="float-right" key="login" icon={<UserOutlined />}>
          <Link to="/login">Login</Link>
        </Item>
      )}

      {user && (
        <SubMenu
          icon={<SettingOutlined />}
          title={user.email && user.email.split('@')[0]}
          className="float-right"
        >
          {user && user.role === 'subscriber' && (
            <Item>
              <Link to="/user/history">Dashboard</Link>
            </Item>
          )}
          {user && user.role === 'admin' && (
            <Item>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Item>
          )}
          <Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Item>
        </SubMenu>
      )}

      <span className="float-right p-1">
        <Search />
      </span>
    </Menu>
  );
};

export default Header;
