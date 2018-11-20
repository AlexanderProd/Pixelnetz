let store;

export const setStore = (reduxStore) => {
  store = reduxStore;
};

const prepareConfig = (action, data) => {
  let config;
  switch (action.fetch) {
    case 'POST-MULTIPART':
      config = {
        method: 'POST',
        body: data,
        'Content-Type': action.mimeType,
      };
      break;
    case 'POST':
      config = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      break;
    default:
      config = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const { headers, ...config } = prepareConfig(action, data);

  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      ...(auth && auth.token
        ? { 'x-access-token': auth.token }
        : {}
      ),
      ...headers,
    },
    ...config,
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
      response: await response.json(),
      ...rest,
    });
  }
};

export default fetchMiddleware;
