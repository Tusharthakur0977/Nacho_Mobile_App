export interface Root {
  HomeScreenData: {
    countries: Node[];
    others: Node[];
  } | null;
  suggestedTours: SuggestedTour[] | null;
  filtersData: FiltersData | null;
  productsCache: ProductsCache;
}

export interface ProductsCache {
  'flight-and-land-packages': CachedProducts;
  'no-flights': CachedProducts;
}

export interface CachedProducts {
  products: Product[];
  hasMore: boolean;
  endCursor: string | null;
}

export interface Product {
  id: string;
  title: string;
  type?: string;
  image?: string;
  imageUrl?: string | null;
  duration: string | null;
  country: string | null;
  year: string | null;
  event?: string | null;
  specialEvent?: string | null;
  selfDrive?: string | null;
  city?: string | null;
  description?: string;
  price?: string | number;
  tourFeatureMetafield?: string[] | null;
  isBestSeller?: boolean;
  handle?: string;
  otherFields?: any;
}

export interface FiltersData {
  countries?: string[];
  durations?: string[];
  years?: string[];
  events?: string[];
  self_drives?: string[];
  cities?: string[];
}

export interface Collections {
  nodes: Node[];
  pageInfo: PageInfo;
}

export interface Node {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  image?: Image;
}

export interface Image {
  originalSrc: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface Extensions {
  cost: Cost;
}

export interface Cost {
  requestedQueryCost: number;
  actualQueryCost: number;
  throttleStatus: ThrottleStatus;
}

export interface ThrottleStatus {
  maximumAvailable: number;
  currentlyAvailable: number;
  restoreRate: number;
}

// --------------------------------------

export interface SuggestedToursData {
  collectionByHandle: CollectionByHandle;
}

export interface CollectionByHandle {
  products: Products;
}

export interface Products {
  edges: Edge[];
  pageInfo: PageInfo;
}

export interface Edge {
  node: SuggestedTour;
  cursor: string;
}

export interface SuggestedTour {
  id: string;
  title: string;
  status: string;
  images: Images;
  variants: Variants;
  countryMetafield?: CountryMetafield;
  durationMetafield: DurationMetafield;
  yearMetafield?: YearMetafield;
  eventsMetafield?: EventsMetafield;
  selfDriveMetafield: any;
}

export interface Images {
  edges: Edge2[];
}

export interface Edge2 {
  node: Node2;
}

export interface Node2 {
  altText: string;
  url: string;
}

export interface Variants {
  edges: Edge3[];
}

export interface Edge3 {
  node: Node3;
}

export interface Node3 {
  id: string;
  title: string;
  presentmentPrices: PresentmentPrices;
}

export interface PresentmentPrices {
  edges: Edge4[];
}

export interface Edge4 {
  node: Node4;
}

export interface Node4 {
  price: Price;
}

export interface Price {
  amount: string;
  currencyCode: string;
}

export interface CountryMetafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
}

export interface DurationMetafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
}

export interface YearMetafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
}

export interface EventsMetafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface Extensions {
  cost: Cost;
}

export interface Cost {
  requestedQueryCost: number;
  actualQueryCost: number;
  throttleStatus: ThrottleStatus;
}

export interface ThrottleStatus {
  maximumAvailable: number;
  currentlyAvailable: number;
  restoreRate: number;
}
