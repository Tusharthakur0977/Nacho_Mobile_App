import axios from 'axios';
import {Node} from '../../Redux/Slices/HomeScreen/type';
import {cleanPayload} from '../Helpers';
import {
  addCustomerAddresApi,
  DELETE_FEED_API,
  DeleteCustomereApi,
  FEED_API,
  fetchAddToCartApi,
  FetchCollectionDataApi,
  fetchCustomerRecoverApi,
  fetchGetCartApi,
  fetchItineraryMetaobjectApi,
  fetchMyBookingApi,
  FetchProductsApi,
  fetchRemoveCartItemApi,
  fetchUpdateCartApi,
  FILTER_API,
  GET_ADMIN_FEED_API,
  GET_FEED_API,
  loginAPi,
  registerProfileURL,
  SHOPIFY_ACCESS_TOKEN,
  updateCustomerAddresApi,
  UpdateProfileApi,
  WAVER_API,
} from './Urls';

export const fetchHomeScreenData = async () => {
  const query = `
  query CustomCollectionList {
  collections(first: 250) {
    nodes {
      id
      handle
      title    
      description
      image {            
            originalSrc            
        }
    }
  }
}
  `;

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: fetchMyBookingApi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query,
    }),
  };

  try {
    const response = await axios(config);
    const collections: Node[] = response?.data?.data?.collections?.nodes || [];

    // 1. Define the criteria (e.g., a list of known countries)
    const countryList = [
      'thailand',
      'china',
      'italy',
      'peru',
      'hawaii',
      'israel',
      'switzerland',
      'greece',
      'galápagos islands',
    ];

    // We can use the collection handles for easier, case-insensitive comparison.
    const countryHandles = countryList.map(name =>
      name.toLowerCase().replace(/\s/g, '-'),
    ); // 'galápagos islands' -> 'galapagos-islands'

    // Define keywords for Suggested Tours (beyond countries)
    const suggestedTourHandles = [
      'flight-and-land-packages',
      'no-flights',
      'most-bought',
      'most-bought-package',
      'all-travel-packages',
    ];

    const otherHandles = [
      'self-drive',
      'spring-break',
      '7-wonders-of-the-world',
      'beach-getaways',
      'historical-archaeological-tours',
      'snorkeling-scuba-diving',
      'group-travel-tours',
      'optional-tours',
      'trekking-hiking',
      'pilgrimage-religious-tours',
    ];

    // Initialize the result lists
    const countries: Node[] = [];
    const suggestedTours: Node[] = [];
    const others: Node[] = [];

    collections.forEach(collection => {
      const handle = collection.handle.toLowerCase();

      // Check for Countries
      if (countryHandles.includes(handle)) {
        countries.push(collection);
      } else if (otherHandles.includes(handle)) {
        others.push(collection);
      }
    });

    return {
      countries,
      suggestedTours,
      others,
    };
  } catch (error: any) {
    console.error('Error fetching Home screen data:', error);
    throw error;
  }
};

// Function to fetch products
export const fetchProducts = async (
  first: number = 50, // Reduced from 250 to 50 for faster loading
  after: string | null = null,
  handle: string = 'flight-and-land-packages',
) => {
  // Optimize the query to request only the fields we need
  const query = `
query collectionByHandle($handle: String!, $first: Int!, $after: String) {
  collectionByHandle(handle: $handle) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          status
          images(first: 1) {
            edges {
              node {
                altText
                url
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                presentmentPrices(first: 1) {
                  edges {
                    node {
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          countryMetafield: metafield(namespace:"custom", key:"country") {
            id
            namespace
            key
            value
          }
          durationMetafield: metafield(namespace:"custom", key:"duration_of_days") {
            id
            namespace
            key
            value
          }
          yearMetafield: metafield(namespace:"custom", key:"filter_of_year") {
            id
            namespace
            key
            value
          }
          eventsMetafield: metafield(namespace:"custom", key:"special_events") {
            id
            namespace
            key
            value
          }
          selfDriveMetafield: metafield(namespace:"custom", key:"filter_self_drive") {
              id
              namespace
              key
              value
          }
          tourFeatureMetafield: metafield(namespace:"custom", key:"tour_features") {
            id
            namespace
            key
            value
          }
          bestSellerMetafield: metafield(namespace:"custom", key:"bestseller_badge") {
            id
            namespace
            key
            value
          }
          multiplebestSellerMetafield: metafield(namespace:"custom", key:"multiple_bestseller_badge") {
            id
            namespace
            key
            value
          }
          citiesMetafield: metafield(namespace:"custom", key:"filter_for_cities") {
            id
            namespace
            key
            value
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
`;

  const variables = {
    first,
    after,
    handle,
  };

  const config = {
    method: 'post',
    url: FetchProductsApi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Access-Token': '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',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query,
      variables,
    }),
    // Add timeout to prevent long-running requests
    timeout: 10000, // 10 seconds timeout
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching products:', error);
    // Return empty data structure instead of throwing to prevent app crashes
    return {data: {collectionByHandle: {products: {edges: []}}}};
  }
};

// Function to fetch product details
export const fetchProductDetails = async (productId: any) => {
  const data = JSON.stringify({
    query: `query GetProductDetails($productId: ID!) {
      product(id: $productId) {
        id
        title
        tags
        images(first: 100) {
          edges {
            node {
              altText
              url
            }
          }
        }
           countryMetafield: metafield(namespace:"custom", key:"country") {
                id
                namespace
                key
                value
            }
        variants(first: 20) {
          edges {
            node {
              id
              title
              sku
              presentmentPrices(first: 10) {
                edges {
                  node {
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
        metafields(first: 100) {
          edges {
            node {
              key
              value
            }
          }
        }
      }
    }`,
    variables: {productId: productId},
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: FetchProductsApi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Access-Token': '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',
      'Content-Type': 'application/json',
    },
    data: data,
  };

  try {
    const response = await axios.request(config);

    return response.data;
  } catch (error: any) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

// Function to fetch Data for Explore page
export const fetchCollectionsData = async (
  first = 12,
  after: null | string = null,
  namespace = 'custom',
  key = 'duration_of_days',
) => {
  // Optimize the query to request only the fields we need
  const query = `
  query GetProducts($first: Int!, $after: String, $namespace: String!, $key: String!) {
  products(first: $first, after: $after) {
    edges {
      node {
        id
        title
        images(first: 1) {
          edges {
            node {
              altText
              url
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              title
              presentmentPrices(first: 1) {
                    edges {
                        node {
                            price {
                                amount
                                currencyCode
                            }
                        }
                    }
                }    
            }
          }
        }
        metafield(namespace: $namespace, key: $key) {
          key
          value
        }
          countryMetafield: metafield(namespace:"custom", key:"country") {
                id
                namespace
                key
                value
            }
            durationMetafield: metafield(namespace:"custom", key:"duration_of_days") {
                id
                namespace
                key
                value
            }
            yearMetafield: metafield(namespace:"custom", key:"filter_of_year") {
                id
                namespace
                key
                value
            }
            eventsMetafield: metafield(namespace:"custom", key:"special_events") {
                id
                namespace
                key
                value
            }
            selfDriveMetafield: metafield(namespace:"custom", key:"filter_self_drive") {
                id
                namespace
                key
                value
            }
             tourFeatureMetafield: metafield(namespace:"custom", key:"tour_features") {
                id
                namespace
                key
                value
            }
             bestSellerMetafield: metafield(namespace:"custom", key:"bestseller_badge") {
                id
                namespace
                key
                value
            }
           multiplebestSellerMetafield: metafield(namespace:"custom", key:"multiple_bestseller_badge") {
                id
                namespace
                key
                value
            }

      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

`;

  const variables = {
    first,
    after,
    namespace,
    key,
  };

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: FetchCollectionDataApi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Access-Token': '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',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query,
      variables,
    }),
    // Add timeout to prevent long-running requests
    timeout: 10000, // 10 seconds timeout
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching collection data:', error);
    // Return empty data structure instead of throwing to prevent app crashes
    return {data: {products: {edges: []}}};
  }
};

export const fetchItineraryData = async (first = 10, type = 'itinerary') => {
  const data = JSON.stringify({
    query: `query GetMetaobjects($type: String!, $first: Int!) {
  metaobjects(type: $type, first: $first) {
    edges {
      node {
        id
        type
        handle
        fields {
          key
          value
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
    }
  }
}`,
    variables: {
      type,
      first,
    },
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: FetchProductsApi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Access-Token': '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',
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching itinerary data:', error);
    console.error('Error Login User', error);
    throw error;
  }
};

export const fetchAccommodationsIds = async (
  first = 250,
  after = null,
  namespace = 'custom',
  key = 'duration_of_days',
) => {
  const data = JSON.stringify({
    query: `query GetMetaobjects($type: String!, $first: Int!) {
  metaobjects(type: $type, first: $first) {
    edges {
      node {
        id
        type
        handle
        fields {
          key
          value
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
    }
  }
}`,
    variables: {
      type: 'accommodations',
      first,
      after,
      namespace,
      key,
    },
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: FetchProductsApi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Access-Token': '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',
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching itinerary data:', error);
    console.error('Error Login User', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  const mutation = `
    mutation LoginCustomer($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email,
      password,
    },
  };

  const config = {
    method: 'POST',
    url: loginAPi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query: mutation,
      variables,
    }),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching itinerary data:', error);
    console.error('Error Login User', error);
    throw error;
  }
};

export const logoutUser = async (token: string) => {
  const mutation = `
   mutation LogoutCustomer($customerAccessToken: String!) {
  customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
    deletedAccessToken
    userErrors {
      field
      message
    }
  }
}
  `;

  const variables = {
    customerAccessToken: token,
  };

  const config = {
    method: 'POST',
    url: loginAPi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query: mutation,
      variables,
    }),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('Error Login User', error);
    throw error;
  }
};

export const fetchProfileData = async (email: string) => {
  const query = `
  query GetCustomerByEmail($email: String!) {
  customers(first: 1, query: $email) {
    edges {
      node {
        id
        firstName
        lastName
        email
        phone
        createdAt
        updatedAt
        note
        verifiedEmail
        validEmailAddress
        tags
        lifetimeDuration
        defaultAddress {
          id
          formattedArea
          address1
          address2
          city
          province
          country
          zip
        }
      addresses {
          id
          address1
          address2
          city
          province
          country
          zip
        }
        image {
        src
        }
      }
    }
  }
}
  `;

  const variables = {
    email,
  };

  const config = {
    method: 'post',
    url: FetchProductsApi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Access-Token': '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',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query,
      variables,
    }),
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const updateProfileData = async (
  id: string,
  inputFields: Record<string, any>,
) => {
  const query = `
    mutation UpdateCustomer($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
          phone
          updatedAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const cleanedFields = cleanPayload(inputFields);

  const variables = {
    input: {
      id,
      ...cleanedFields,
    },
  };

  const config = {
    method: 'POST',
    url: UpdateProfileApi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Access-Token': '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',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query,
      variables,
    }),
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error('Error updating customer profile:', error);
    throw error;
  }
};

export const registerUserApi = async (inputFields: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  acceptsMarketing: boolean;
}) => {
  const query = `
   mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
    }
    customerUserErrors {
      field
      message
      code
    }
  }
}
  `;

  const variables = {
    input: inputFields,
  };

  const config = {
    method: 'POST',
    url: registerProfileURL,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query,
      variables,
    }),
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error('Error updating customer profile:', error);
    throw error;
  }
};

export const deleteCustomer = async (id: string) => {
  const query = `
     mutation DeleteCustomer($id: ID!) {
      customerDelete(input: { id: $id }) {
        deletedCustomerId
        shop {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    id,
  };

  const config = {
    method: 'POST',
    url: DeleteCustomereApi,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': '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',
    },
    data: JSON.stringify({
      query,
      variables,
    }),
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting customer:', error?.response?.data || error);
    throw error;
  }
};

export const fetchMyBookings = async (customerAccessToken: any) => {
  const query = `
  query GetCustomerOrders($customerAccessToken: String!) {
  customer(customerAccessToken: $customerAccessToken) {
    orders(first: 10) {
      edges {
        node {
          id
          name
          orderNumber
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                variant {
                  title
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
}

  `;

  const variables = {
    customerAccessToken,
  };

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: fetchMyBookingApi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query,
      variables,
    }),
  };

  try {
    const response = await axios(config);

    return response.data.data.customer.orders.edges;
  } catch (error: any) {
    console.error('Error fetching customer bookings:', error);
    throw error;
  }
};

export const fetchFilterProducts = async () => {
  const data = JSON.stringify({
    collection: 'flight-and-land-packages',
    filter: 'country=Chile;duration_of_days=8 Days, 7 Nights',
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: FILTER_API,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    const result = response.data;

    // Remove duplicate durations
    if (result?.durations && Array.isArray(result.durations)) {
      result.durations = [
        ...new Set(result.durations.map((d: string) => d.trim())),
      ];
    }

    return result;
  } catch (error: any) {
    console.error('Error fetching filter products:', error);
  }
};

export const createCart = async () => {
  const url = fetchAddToCartApi;
  const headers = {
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    query: `
     mutation CreateCart($input: CartInput) {
  cartCreate(input: $input) {
    cart {
      id
      checkoutUrl
      lines(first: 10) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
                title
              }
            }
            quantity
            attributes {
              key
              value
            }
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
    `,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error:', error.message);
  }
};

export const updateCartWithCustomer = async (
  cartId: string,
  customerAccessToken: string,
) => {
  const url = fetchAddToCartApi;
  const headers = {
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    query: `
      mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
        cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
          cart {
            id
            checkoutUrl
            buyerIdentity {
              email
              customer {
                id
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      cartId: cartId,
      buyerIdentity: {
        customerAccessToken: customerAccessToken,
      },
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Cart updated with customer identity:', data);
    return data;
  } catch (error: any) {
    console.error('Error updating cart:', error.message);
  }
};

export const addToCart = async (
  cartId: string,
  merchandiseId: string,
  quantity = 1,
  customDates?: string | null,
  roomOccupancy?: string | null,
  rooms?: string | null,
  optionalTourIDs?: string[],
) => {
  const url = fetchAddToCartApi;
  const headers = {
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  };

  const attributes = [];

  if (customDates) {
    attributes.push({
      key: 'Tour dates',
      value: customDates,
    });
  }

  if (rooms) {
    attributes.push({
      key: 'Room Occupancy',
      value: rooms,
    });
  }

  if (roomOccupancy) {
    attributes.push({
      key: 'Room',
      value: roomOccupancy,
    });
  }

  const optionalLines =
    optionalTourIDs?.map(id => ({
      merchandiseId: id,
      quantity: 1,
    })) || [];

  const body = JSON.stringify({
    query: `
      mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines(first: 10) {
              edges {
                node {
                  id
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                  quantity
                  attributes {
                    key
                    value
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      cartId,
      lines: [
        {
          merchandiseId,
          quantity,
          ...(attributes.length > 0 && {attributes}),
        },
        ...optionalLines,
      ],
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error:', error.message);
  }
};

export const getCart = async (cartId: string) => {
  const url = fetchGetCartApi;
  const headers = {
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    query: `
     query GetCart($cartId: ID!) {
  cart(id: $cartId) {
    id
    checkoutUrl
    createdAt
    updatedAt
    lines(first: 50) { # Increase the limit or use pagination if needed
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              sku
              price {
                amount
                currencyCode
              }
              product {
                id
                title
                descriptionHtml
                vendor
                tags
                images(first: 1) { # Fetch the first 5 images
                  edges {
                    node {
                      id
                      url
                    }
                  }
                }
                variants(first: 10) { # Fetch up to 10 variants
                  edges {
                    node {
                      id
                      title
                      sku
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          attributes {
            key
            value
          }
        }
      }
    }
    estimatedCost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    attributes {
      key
      value
    }
  }
}
    `,
    variables: {
      cartId,
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error: any) {
    console.error('Error:', error.message);
  }
};

export const updateItemInCart = async (
  cartId: any,
  cartLineId: any,
  quantity: number,
) => {
  const url = fetchUpdateCartApi;
  const headers = {
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    query: `
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      id
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
              }
            }
            attributes {
              key
              value
            }
          }
        }
      }
      estimatedCost {
        totalAmount {
          amount
          currencyCode
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}

    `,
    variables: {
      cartId,
      lines: [
        {
          id: cartLineId,
          quantity,
          attributes: [
            {
              key: 'note',
              value: 'Urgent order',
            },
          ],
        },
      ],
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
    }

    return data.data.cartLinesRemove;
  } catch (error: any) {
    console.error('Error:', error.message);
  }
};

export const removeCartItem = async (lineItemId: any, cartId: any) => {
  const url = fetchRemoveCartItemApi;
  const headers = {
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    query: `
      mutation RemoveCartItem($lineItemId: ID!, $cartId: ID!) {
        cartLinesRemove(cartId: $cartId, lineIds: [$lineItemId]) {
          cart {
            id
            lines {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    id
                    title
                  }
                }
              }
            }
            estimatedCost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      lineItemId,
      cartId,
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
    }

    return data.data.cartLinesRemove;
  } catch (error: any) {
    console.error('Error:', error.message);
  }
};

export const recoverCustomerAccount = async (email: string) => {
  const url = fetchCustomerRecoverApi;
  const headers = {
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    query: `
     mutation ForgotPassword($email: String!) {
  customerRecover(email: $email) {
    userErrors {
      field
      message
    }
  }
}
    `,
    variables: {email},
  });

  try {
    const response = await fetch(url, {method: 'POST', headers, body});
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const {data} = await response.json();
    const errors = data.customerRecover.userErrors;
    if (errors.length) console.error('GraphQL Errors:', errors);

    return data.customerRecover;
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;
  }
};

export const fetchItineraryMetaobject = async (gid: string) => {
  const query = `
    query GetMetaobject($gid: ID!) {
      metaobject(id: $gid) {
        id
        type
        fields {
          key
          value
        }
      }
    }
  `;

  const variables = {
    gid,
  };

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: fetchItineraryMetaobjectApi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Access-Token': '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',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query,
      variables,
    }),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching itinerary data:', error);
    console.error('Error Login User', error);
    throw error;
  }
};

export const uploadFeedImageApi = async (
  title: any,
  imagePath: any,
  customer_id: any,
) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('customer_id', customer_id);
  formData.append('image', {
    uri: imagePath.path,
    name: imagePath.path,
    type: imagePath.mime,
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: FEED_API,
    data: formData,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('Error uploading image:', error.message);
    throw error;
  }
};

export const uploadDeleteFeedImageApi = async (feedId: any) => {
  const formData = new FormData();
  formData.append('id', feedId);
  const config = {
    method: 'post',
    url: DELETE_FEED_API,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting image:', error.message);
    throw error;
  }
};

export const uploadWaverApi = async (data: any) => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: WAVER_API,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('Error uploading waver:', error);
    throw error;
  }
};

export const fetchFeedApi = async () => {
  const config = {
    method: 'GET',
    url: GET_FEED_API,
    // headers: myHeaders,
    redirect: 'follow',
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('Error uploading image:', error.message);
    throw error;
  }
};

export const fetchAdmiApi = async () => {
  const config = {
    method: 'GET',
    url: GET_ADMIN_FEED_API,
    // headers: myHeaders,
    redirect: 'follow',
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('Error uploading image:', error.message);
    throw error;
  }
};

export const addCustomerAddres = async (
  token: any,
  address: {
    address1: string;
    address2: string;
    city: string;
    country: string;
  },
) => {
  const url = addCustomerAddresApi;
  const headers = {
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    query: `mutation createCustomerAddress(
  $customerAccessToken: String!,
  $address: MailingAddressInput!
) {
  customerAddressCreate(
    customerAccessToken: $customerAccessToken,
    address: $address
  ) {
    customerUserErrors {
      field
      message
    }
    customerAddress {
      id
      address1
      address2
      city
      country
      province
      zip
    }
  }
}`,
    variables: {
      customerAccessToken: token,
      address: address,
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
    }

    return data;
  } catch (error: any) {
    console.error('Error:', error.message);
  }
};

export const updateCustomerAddres = async (
  token: any,
  address: {
    address1: string;
    address2: string;
    city: string;
    country: string;
  },
  id: string,
) => {
  const url = updateCustomerAddresApi;
  const headers = {
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    query:
      'mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) { customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) { customerAddress { id address1 address2 city province country zip } customerUserErrors { field message } } }',
    variables: {
      customerAccessToken: token,
      id: id,
      address: address,
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
    }

    return data;
  } catch (error: any) {
    console.error('Error:', error.message);
  }
};

export const updateAllItemInCartwithWaiverLink = async (
  cartId: any,
  linIds: any,
  waiverId: string,
) => {
  const url = fetchUpdateCartApi;
  const headers = {
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    query: `
mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      id
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
              }
            }
            attributes {
              key
              value
            }
          }
        }
      }
      estimatedCost {
        totalAmount {
          amount
          currencyCode
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
    `,
    variables: {
      cartId,
      lines: linIds.map((id: string) => ({
        id,
        attributes: [
          {
            key: 'waiver',
            value: `https://httpsevolution35app.com/downloadPDF/${waiverId}`,
          },
        ],
      })),
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL Errors:', JSON.stringify(data.errors));
    }

    return data.data;
  } catch (error: any) {
    console.error('Error:', JSON.stringify(error));
  }
};

export const getMediaImageById = async (mediaId: string) => {
  const url = fetchUpdateCartApi;
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
  };

  const body = JSON.stringify({
    query: `
      query getMediaImage($mediaId: ID!) {
        node(id: $mediaId) {
          ... on MediaImage {
            id
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    `,
    variables: {
      mediaId,
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.errors) {
      console.error('GraphQL Errors:', JSON.stringify(data.errors));
    }

    // Optional: Return just the image object or full response
    return data?.data?.node?.image || null;
  } catch (error: any) {
    console.error('Error fetching media image:', error);
    return null;
  }
};

export const fetchOptionalTour = async (
  first: number = 40,
  after: string | null = null,
  handle: string = 'optional-tours',
) => {
  const query = `
query collectionByHandle($handle: String!, $first: Int!, $after: String) {
  collectionByHandle(handle: $handle) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          images(first: 40) {
            edges {
              node {
                altText
                url
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                presentmentPrices(first: 1) {
                  edges {
                    node {
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          countryMetafield: metafield(namespace:"custom", key:"country") {
                id
                namespace
                key
                value
            }
            durationMetafield: metafield(namespace:"custom", key:"duration_of_days") {
                id
                namespace
                key
                value
            }
            yearMetafield: metafield(namespace:"custom", key:"filter_of_year") {
                id
                namespace
                key
                value
            }
            eventsMetafield: metafield(namespace:"custom", key:"special_events") {
                id
                namespace
                key
                value
            }
            selfDriveMetafield: metafield(namespace:"custom", key:"filter_self_drive") {
                id
                namespace
                key
                value
            }
                tourFeatureMetafield: metafield(namespace:"custom", key:"tour_features") {
                id
                namespace
                key
                value
            }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
  `;

  const variables = {
    first,
    after,
    handle,
  };

  const config = {
    method: 'post',
    url: FetchProductsApi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Access-Token': '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',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query,
      variables,
    }),
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchHomeDataByFilter = async (
  collectionHandle: string,
  country: any,
  year: any,
  event: any,
  duration: any,
  drive: any,
  city: any,
) => {
  const data: any = {
    handle: collectionHandle,
  };

  // Conditionally add parameters to the payload if they have values
  if (country) data.country = country;
  if (year) data.year = year;
  if (event) data.event = event;
  if (duration) data.duration = duration;
  if (drive) data.drive = drive;
  if (city) data.city = city;

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://httpsevolution35app.com/api/collection-products', // Replace with your API URL
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data), // Convert the object to JSON
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.log(error);
    console.error('Error fetching data:', error.message);
    throw error;
  }
};

export const fetchMultipleMetaData = async (ids: string[]) => {
  const query = `query GetMultipleMetaobjects($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Metaobject {
      id
      type
      fields {
        key
        value
        type
        reference {
          ... on MediaImage {
            image {
              url
              altText
            }
          }
          ... on Metaobject {
            id
            type
            fields {
              key
              value
            }
          }
        }
      }
    }
  }
}
`;

  const variables = {
    ids,
  };

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: FetchProductsApi,
    headers: {
      Accept: 'application/json',
      'X-Shopify-Access-Token': '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',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query,
      variables,
    }),
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching multiple metaobjects:', error);
    throw error;
  }
};

// Get  Multiple Product Detail
export const GetMultipleProductsDetail = async (productIds: string[]) => {
  const data = JSON.stringify({
    query: `query ProductsByIds($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          featuredImage {
            id
            url
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                 presentmentPrices(first: 10) {
                edges {
                  node {
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              }
            }
          }
        }
      }
    }`,
    variables: {ids: productIds},
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: FetchProductsApi, // Replace with your Shopify GraphQL endpoint
    headers: {
      Accept: 'application/json',
      'X-Shopify-Access-Token': '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',
      'Content-Type': 'application/json',
    },
    data,
  };

  try {
    const response = await axios.request(config);

    return response.data?.data?.nodes || [];
  } catch (error: any) {
    console.error('Error fetching products by IDs:', error);
    throw error;
  }
};
