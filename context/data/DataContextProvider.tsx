import { getAllPizzas } from '../../firebase/application';
import {
  BrandObject,
  BrandsList,
  CountryData,
  CountryObject,
  PizzaObject,
  PizzasList,
} from 'utils/types';
import React, { useEffect, useMemo, useState } from 'react';
import { createContext, useReducer, useContext } from 'react';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase/application';
interface Action {
  type: 'INIT' | 'UPDATE';
  payload: any;
}

type State = CountryObject[] | null;
interface UpdateFnProps {
  originalList: CountryObject[];
  countryInputValue?: string;
  brandInputValue?: string;
  pizzaInputValue?: string;
}
interface Dispatch {
  dispatch?: React.Dispatch<Action>;
}

interface DisplayState {
  countries: CountryObject[];
  brands?: BrandsList[];
  pizzas?: PizzasList[];
}

const DataContext = createContext<State | null>(null);
const DisplayContext = createContext<(DisplayState & Dispatch) | null>(null);

const initialData: State = [];
const initialDisplayState: DisplayState = {
  countries: [],
};

export const updateDisplay = ({
  originalList,
  countryInputValue,
  brandInputValue,
  pizzaInputValue,
}: UpdateFnProps) => {
  const displayData: DisplayState = {
    countries: originalList,
    brands: [],
    pizzas: [],
  };
  if (!originalList) {
    return displayData;
  }
  if (countryInputValue) {
    const foundCountry = originalList.find(
      (country: CountryObject) =>
        country.info.name.toLowerCase() === countryInputValue.toLowerCase()
    );

    displayData.countries = foundCountry ? [foundCountry] : originalList;
  }
  if (brandInputValue) {
    const filteredByBrand = displayData.countries.filter(
      (country: CountryObject) =>
        country.brandsList.hasOwnProperty(brandInputValue)
    );

    displayData.countries = filteredByBrand;
  }
  if (pizzaInputValue) {
    const filteredByPizza = displayData.countries.filter(
      (country: CountryObject) => {
        const brands = country.brandsList;
        const pizzasInBrand = Object.values(brands).map(
          (brand: BrandObject) => brand.pizzaList
        );
        const pizzaNames = pizzasInBrand.map(
          (pizzas: PizzasList) => Object.keys(pizzas)[0]
        );
        return pizzaNames.includes(pizzaInputValue);
      }
    );
    displayData.countries = filteredByPizza;
  }
  const allBrands = displayData.countries.map(
    (country: CountryObject) => country.brandsList
  );
  const allPizzas = allBrands.map((brand) => Object.values(brand)[0].pizzaList);
  displayData.brands = allBrands;
  displayData.pizzas = allPizzas;
  return displayData;
};

const displayDataReducer = (
  state: DisplayState,
  action: Action
): DisplayState => {
  switch (action.type) {
    case 'INIT': {
      const countriesList: CountryObject[] = action.payload;
      if (!countriesList) return state;
      const generatedDisplayState = updateDisplay({
        originalList: countriesList,
      });
      return { ...state, ...generatedDisplayState };
    }
    case 'UPDATE': {
      const updatedDisplayState = updateDisplay(action.payload);
      return { ...state, ...updatedDisplayState };
    }
    default: {
      // throw Error('Unknown action: ' + action.type);
      return state;
    }
  }
};
export function DataContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [displayState, dispatch] = useReducer(
    displayDataReducer,
    initialDisplayState
  );
  const [state, updateState] = useState(initialData);
  const contextValue = useMemo(
    () => ({
      ...displayState,
      dispatch,
    }),
    [displayState.countries.length]
  );
  useEffect(() => {
    const getAllData = async () => {
      const countriesList = await getAllPizzas();
      if (!countriesList) return;
      updateState(countriesList);
      dispatch({ type: 'INIT', payload: countriesList });
    };
    getAllData();
    const q = query(collection(db, 'pizzas'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updated: any = [];
      snapshot.forEach((doc) => updated.push(doc.data()));
      dispatch({ type: 'INIT', payload: updated });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <DataContext.Provider value={state}>
      <DisplayContext.Provider value={contextValue}>
        {children}
      </DisplayContext.Provider>
    </DataContext.Provider>
  );
}
export function useData() {
  return useContext(DataContext);
}
export function useDisplayData() {
  return useContext(DisplayContext);
}
