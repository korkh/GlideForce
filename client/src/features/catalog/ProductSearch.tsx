import { debounce, TextField } from "@mui/material";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";

export default function Search() {
  const { productParams } = useAppSelector((state) => state.catalog);
  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);
  const dispatch = useAppDispatch();

  const debouncedSearch = debounce(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      dispatch(setProductParams({ searchTerm: event.target.value }));
    },
    2000
  );

  return (
    <TextField
      label="Search products"
      variant="outlined"
      fullWidth
      value={searchTerm || ""}
      onChange={(
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      ) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event);
      }}
    />
  );
}
