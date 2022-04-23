import request from './core';

export const getImage = (query) => {
  return request.get(`/search/image`, {
    params: { query, display: 20, start: 1 },
  });
};
