export type ProductVariants = Root2[];

export interface Root2 {
  node: VariantNode;
}

export interface VariantNode {
  id: string;
  title: string;
  sku: string;
  presentmentPrices: PresentmentPrices;
}

export interface PresentmentPrices {
  edges: Edge[];
}

export interface Edge {
  node: Node2;
}

export interface Node2 {
  price: Price;
}

export interface Price {
  amount: string;
  currencyCode: string;
}
