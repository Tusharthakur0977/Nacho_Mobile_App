export type metaData = Root2[];

export interface Root2 {
  id: string;
  type: string;
  fields: Field[];
}

export interface Field {
  key: string;
  value: string;
  type: string;
  reference?: Reference;
}

export interface Reference {
  image: Image;
}

export interface Image {
  url: string;
  altText: string;
}
