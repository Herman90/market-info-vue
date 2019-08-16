const url = new URL('https://ciapi.cityindex.com/TradingAPI/market/searchwithouttags');

export default function searchMarket(searchParameters, session, username) {
  searchParameters = Object.assign({
      query: '',
      tagId: 0,
      searchByMarketCode: true,
      searchByMarketName: true,
      spreadProductType: true,
      cfdProductType: true,
      binaryProductType: true,
      includeOptions: true,
      maxResults: 150,
      useMobileShortName: false
  }, searchParameters);

  url.search = new URLSearchParams(searchParameters);
  return fetch(url, { headers: {
    UserName: username,
    Session: session
  }})
  .then(response => response.json())
  .then(response => response['Markets'].map(market => ({ ...market, toString: () => market.Name })));
}