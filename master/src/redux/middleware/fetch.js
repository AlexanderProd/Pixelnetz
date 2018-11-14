let store;

export const setStore = (reduxStore) => {
  store = reduxStore;
};

const prepareConfig = (method, data) => {
  let config;
  switch (method) {
    case 'POST':
      config = {
        method: 'POST',
        body: JSON.stringify(data),
      };
      break;
    default:
      config = {
        method: 'GET',
      };
  }

  return config;
};

const fetchMiddleware = ({ baseUrl }) => () => next => async (action) => {
  if (!action.fetch) {
    next(action);
    return;
  }

  const { data, endpoint, expect, types, ...rest } = action;
  const [request, success, failure] = types;

  next({
    type: request,
    data,
    ...rest,
  });

  const { auth } = ((store && store.getState) || (() => {}))();

  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(auth && auth.token
        ? { 'x-access-token': auth.token }
        : {}
      ),
    },
    ...prepareConfig(action.fetch, data),
  });

  if (response.ok) {
    let parsedResponse;
    switch (expect) {
      case 'text':
        parsedResponse = await response.text();
        break;
      case 'raw':
        parsedResponse = response;
        break;
      default:
        parsedResponse = await response.json();
    }
    next({
      type: success,
      data,
      response: parsedResponse,
      ...rest,
    });
  } else {
    next({
      type: failure,
      data,
      response,
      ...rest,
    });
  }
};

export default fetchMiddleware;
