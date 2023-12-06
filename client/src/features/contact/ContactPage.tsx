import {
  Button,
  ButtonGroup,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";

const ContactPage = () => {
  const dispatch = useAppDispatch();
  const { data, title } = useAppSelector((state) => state.counter);

  return (
    <Container component={Paper} style={{ height: 400, marginTop: "1em" }}>
      <br />
      <Typography gutterBottom variant="h3">
        {title}
      </Typography>
      <Typography variant="h5">The Data is: {data}</Typography>
      <ButtonGroup>
        <Button
          onClick={() => dispatch(decrement(1))}
          variant="contained"
          color="error"
        >
          Decrement
        </Button>
        <Button
          onClick={() => dispatch(increment(1))}
          variant="contained"
          color="secondary"
        >
          Increment
        </Button>
        <Button
          onClick={() => dispatch(increment(5))}
          variant="contained"
          color="primary"
        >
          Increment by 5
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default ContactPage;
