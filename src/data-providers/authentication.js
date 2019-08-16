import store from './../store';

const apiUrls = {
  'ppe': 'https://ciapipreprod.cityindex.com/TradingAPI/',
  'live': 'https://ciapi.cityindex.com/TradingAPI/'
};

const apiEndpoints = {
  session: 'session',
  clientAccount: '/useraccount/ClientAndTradingAccount'
};

const request = (url, method, payload, customHeaders) => {
  const headers = Object.assign({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }, customHeaders || {});

  const query = {
    method: method,
    headers: headers
  };

  if (payload && method !== 'GET') {
    query['body'] = JSON.stringify(payload);
  }


  return fetch(url, query)
  .then(response => response.json());
};


export const service = {
  login: function(username, password, env) {
    const url = `${apiUrls[env]}${apiEndpoints.session}`; 

    return request(url, 'POST', {
      UserName: username,
      Password: password, 
      AppKey: 'Mercury'
    })
    .then(response => response.Session ? response.Session : Promise.reject());
  },
  getClientAccount: function() {
    const { username, session, environment } = store.state;

    const url = `${apiUrls[environment]}${apiEndpoints.clientAccount}`;


    return request(url, 'GET', {}, { username, session });
  }
};
