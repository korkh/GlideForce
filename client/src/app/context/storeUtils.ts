import { createContext, useContext } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue {
  removeItem: (productId: number, quantity: number) => void;
  setBasket: (basket: Basket) => void;
  basket: Basket | null;
}

export const StoreContext = createContext<StoreContextValue | undefined>(
  undefined
);

export function useStoreContext() {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw Error("Oops - we do not seem to be inside the provider");
  }

  return context;
}
