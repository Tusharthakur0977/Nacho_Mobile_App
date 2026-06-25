export const BASE_URL = 'https://evolution35.myshopify.com/';
export const FILTER_API = 'https://httpsevolution35app.com/api/filter';
export const FEED_API = 'https://httpsevolution35app.com/api/store-feed';
export const HOME_FILTER_API =
  'https://httpsevolution35app.com/api/filter-data';
//evolution35.chainpulse.tech/send-data
export const WAVER_API = 'https://httpsevolution35app.com/send-data';
export const GET_FEED_API = 'https://httpsevolution35app.com/api/feeds';
export const GET_ADMIN_FEED_API =
  'https://httpsevolution35app.com/api/admin-feeds';
export const DELETE_FEED_API =
  'https://httpsevolution35app.com/api/delete-feed';
export const SHOPIFY_ACCESS_TOKEN = 'bb63a3a920babcdfaacebbf13be5f796';
export const getApiUrl = (endpoint: string) => `${BASE_URL}${endpoint}`;
export const CHECKOUT_URL =
  'https://evolution35.com/cart/c/Z2NwLWFzaWEtc291dGhlYXN0MTowMUpKM1FSWUUwTTZKVlJES1haWVZCOUNWOQ?key=kMBlggyb9UejZWXUHep4sZ_JBaD_cUy-fmeUI_z09UzkAuEdite3acmUiySS_2w3qIl5sBa7AdEyhUU_bKfKbdII3crnANkYbPzupUFt1-nTmOLOqLbUsb6C231CaDV8D5qizAQtbFLLdRIiiwLfNw%3D%3D';

export const FetchProductsApi = getApiUrl('admin/api/2024-10/graphql.json');
export const FetchProductDetailApi = getApiUrl(
  'admin/api/2024-10/graphql.json',
);

export const FetchCollectionDataApi = getApiUrl(
  'admin/api/2024-10/graphql.json',
);

export const loginAPi = getApiUrl('api/2024-10/graphql.json');

export const UpdateProfileApi = getApiUrl('admin/api/2024-10/graphql.json');
export const DeleteCustomereApi = getApiUrl('admin/api/2024-10/graphql.json');

export const registerProfileURL = getApiUrl('api/2024-10/graphql.json');

export const fetchMyBookingApi = getApiUrl('api/2024-10/graphql.json');

export const fetchAddToCartApi = getApiUrl('api/2024-10/graphql.json');

export const fetchGetCartApi = getApiUrl('api/2024-10/graphql.json');

export const fetchUpdateCartApi = getApiUrl('api/2024-10/graphql.json');

export const fetchRemoveCartItemApi = getApiUrl('api/2024-10/graphql.json');

export const fetchCustomerRecoverApi = getApiUrl('api/2024-10/graphql.json');

export const fetchItineraryMetaobjectApi = getApiUrl(
  'admin/api/2024-10/graphql.json',
);

export const fetchWaiverFormDataApi = getApiUrl('send-data');

export const addCustomerAddresApi = getApiUrl('api/2024-10/graphql.json');

export const updateCustomerAddresApi = getApiUrl('api/2024-10/graphql.json');
