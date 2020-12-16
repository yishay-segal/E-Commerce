import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubs } from '../../functions/sub';

export default function SubList() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubs().then(c => {
      setSubs(c.data);
      setLoading(false);
    });
  }, []);

  const showSubs = () =>
    subs.map(s => (
      <div
        key={s._id}
        className=" col btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
      >
        <Link to={`/sub/${s.slug}`} className="w-100">
          {s.name}
        </Link>
      </div>
    ));

  return (
    <div className="container">
      <div className="row">
        {loading ? <h4 className="text-center">loading</h4> : showSubs()}
      </div>
    </div>
  );
}
