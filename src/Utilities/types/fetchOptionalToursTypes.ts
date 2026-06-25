export interface OptionalTours {
  id: string;
  title: string;
  featuredImage: FeaturedImage;
  variants: Variants;
}

export interface FeaturedImage {
  id: string;
  url: string;
}

export interface Variants {
  edges: Edge[];
}

export interface Edge {
  node: Node;
}

export interface Node {
  id: string;
  title: string;
  presentmentPrices: PresentmentPrices;
}

export interface PresentmentPrices {
  edges: Edge2[];
}

export interface Edge2 {
  node: Node2;
}

export interface Node2 {
  price: Price;
}

export interface Price {
  amount: string;
  currencyCode: string;
}
