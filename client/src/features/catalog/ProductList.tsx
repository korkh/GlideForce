import { Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";
import { useAppSelector } from "../../app/store/configureStore";
import ProductCardSceleton from "./ProductCardSceleton";

interface Props {
  products: Product[];
}

export default function ProductList({ products }: Props) {
  const { productsLoaded } = useAppSelector((state) => state.catalog);
  return (
    <Grid container spacing={4}>
      {products.map((product: Product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          {!productsLoaded ? (
            <ProductCardSceleton />
          ) : (
            <ProductCard key={product.id} product={product} />
          )}
        </Grid>
      ))}
    </Grid>
  );
}
