import request from './core';

export const getImage = (keyword) => {
  const query = encodeURI(keyword);

  return request.get(`/search/image`, {
    params: { query, display: 20, start: 1 },
  });
};
