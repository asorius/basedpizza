import mongoose from 'mongoose';
interface PizzaObject {
  name: string;
  brand: string;
  type: string;
  price: number;
  ingredients: {
    main: string[];
    secondary?: string[];
  };
}
const PizzaSchema = new mongoose.Schema<PizzaObject>({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  ingredients: {
    main: [String],
    secondary: [String],
  },
});
// const Pizza = mongoose.model<PizzaObject>('Pizza', PizzaSchema);
export default mongoose.models.Pizza ||
  mongoose.model<PizzaObject>('Pizza', PizzaSchema);
