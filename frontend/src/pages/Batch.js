import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import axios from '../utils/api';

const Batch = () => {
  const { user } = useContext(AuthContext);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get(`/api/batches/faculty/${user?.faculty}`);
        setBatches(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError('Failed to load batches');
        setLoading(false);
      }
    };

    if (user?.faculty) {
      fetchBatches();
    } else {
      setLoading(false);
    }
  }, [user?.faculty]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user?.faculty) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Please update your profile with your faculty information to view batches.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Batches in {user.faculty}</h1>
        <p className="mt-2 text-lg text-gray-600">
          Connect with students from your batch
        </p>
      </div>

      {batches.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {batches.map(batch => (
            <div key={batch._id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{batch.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {batch.description || 'No description available'}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {batch.studentCount || 0} Students
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href={`/batch/${batch._id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                    View details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No batches found</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no batches available for your faculty yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Batch;







