import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { removeBasketItemAsync, addBasketItemAsync } from "./basketSlice";
import { BasketItem } from "../../app/models/basket";
import { currencyFormat } from "../../app/utils/util";

interface Props {
  items: BasketItem[];
  isBasket?: boolean;
}

export default function BasketTable({ items, isBasket = true }: Props) {
  const { status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            {isBasket && <TableCell align="right"></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.productId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box display="flex" alignItems="center">
                  <img
                    style={{ height: 50, marginRight: 20 }}
                    src={item.pictureUrl}
                    alt={item.name}
                  />
                  <span>{item.name}</span>
                </Box>
              </TableCell>
              <TableCell align="right">
                {currencyFormat(item.price)}
              </TableCell>
              <TableCell align="center">
                {isBasket && (
                  <LoadingButton
                    loading={status.includes(
                      `pendingRemoveItem${item.productId}remove`
                    )}
                    onClick={() =>
                      dispatch(
                        removeBasketItemAsync({
                          productId: item.productId,
                          quantity: 1,
                          name: "remove",
                        })
                      )
                    }
                    color="error"
                  >
                    <Remove />
                  </LoadingButton>
                )}
                {item.quantity}
                {isBasket && (
                  <LoadingButton
                    loading={status.includes(`pendingAddItem${item.productId}add`)}
                    onClick={() =>
                      dispatch(
                        addBasketItemAsync({ productId: item.productId, name: "add" })
                      )
                    }
                    color="secondary"
                  >
                    <Add />
                  </LoadingButton>
                )}
              </TableCell>
              <TableCell align="right">
                {currencyFormat((item.price) * item.quantity)}
              </TableCell>
              {isBasket && (
                <TableCell align="right">
                  <LoadingButton
                    loading={status.includes(
                      `pendingRemoveItem${item.productId}delete`
                    )}
                    onClick={() =>
                      dispatch(
                        removeBasketItemAsync({
                          productId: item.productId,
                          quantity: item.quantity,
                          name: "delete",
                        })
                      )
                    }
                    color="error"
                  >
                    <Delete />
                  </LoadingButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
