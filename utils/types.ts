export interface ImageObject {
  creator: string;
  imageRef: string;
  timeStamp: string;
}
export interface PizzaObject {
  name: string;
  creator: string;
  price: number;
  imageList: ImageObject[];
}

export interface BrandData {
  name: string;
  rating?: number;
}
export interface CountryData {
  name: string;
  rating?: number;
}
export interface PizzasList {
  [name: string]: PizzaObject;
}
export interface BrandObject {
  info: BrandData;
  pizzaList: PizzasList;
}
export interface BrandsList {
  [name: string]: BrandObject;
}
export interface CountryObject {
  info: CountryData;
  brandsList: BrandsList;
}
export interface SinglePizza extends BrandObject {
  pizzaIndex: number;
}
export interface PizzaFormInput {
  pizzaName: string;
  price: number;
  brandName: string;
  countryName: string;
  pizzaCreator: string;
  imageList: ImageObject[];
}
