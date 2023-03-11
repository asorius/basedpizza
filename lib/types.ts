export interface ImageObject {
  creator: string;
  imageRef: string;
  timeStamp: string;
}
export interface PizzaObject {
  pizzaName: string;
  pizzaCreator: string;
  price: number;
  imageList: ImageObject[] | [];
}
export interface BrandData {
  brandName: string;
  rating?: number;
}
export interface BrandObject {
  brandInfo: BrandData;
  pizzaList: PizzaObject[];
}
export interface SinglePizza extends BrandObject {
  pizzaIndex: number;
}
