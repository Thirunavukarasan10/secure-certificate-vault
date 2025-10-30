import API from '../lib/api.js';

// GET /api/users/me
export const getMyProfile = async () => {
  const { data } = await API.get('/users/me');
  return data;
};

// PUT /api/users/me
export const updateMyProfile = async (payload) => {
  const { data } = await API.put('/users/me', payload);
  return data;
};

export default { getMyProfile, updateMyProfile };


