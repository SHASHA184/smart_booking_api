import React, { useState, useEffect } from 'react';
import { getData } from '../api/api';
import { Property } from '../types/api';

const DataComponent: React.FC = () => {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData<Property[]>('/properties/');
        setData(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please make sure the backend API is running properly.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return (
    <div className="error-message">
      <h2>Error</h2>
      <p>{error}</p>
      <p>The backend service should be running automatically as part of docker-compose.</p>
      <p>Check the docker logs for more information:</p>
      <code>docker-compose logs app</code>
    </div>
  );

  return (
    <div>
      <h2>Properties</h2>
      {data.length === 0 ? (
        <p>No properties found</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.id} className="property-card">
              <h3>{item.name}</h3>
              {item.description && <p className="description">{item.description}</p>}
              <div className="property-details">
                <div className="detail">
                  <strong>Price:</strong> ${item.price}/night
                </div>
                <div className="detail">
                  <strong>Rooms:</strong> {item.rooms}
                </div>
                {item.location && (
                  <div className="detail">
                    <strong>Location:</strong> {item.location}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DataComponent; 