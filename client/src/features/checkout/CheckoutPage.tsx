import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import {
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeElementType } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import agent from "../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { clearBasket } from "../basket/basketSlice";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { validationSchema } from "./checkoutValidation";
import { Card } from "../../app/models/card";

const steps = ["Shipping address", "Review your order", "Payment details"];

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [cardState, setCardState] = useState<{
    elementError: { [key in StripeElementType]?: string };
  }>({ elementError: {} });

  // const [cardComplete, setCardComplete] = useState<any>({
  //   cardNumber: false,
  //   cardExpiry: false,
  //   cardCvc: false,
  // });
  const [cardComplete, setCardComplete] = useState<Card>(new Card());
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const { basket } = useAppSelector((state) => state.basket);
  const stripe = useStripe();
  const elements = useElements();

  // is used to validate PaymentInputs in PaymentForm
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onCardInputChange(event: any) {
    setCardState({
      ...cardState,
      elementError: {
        ...cardState.elementError,
        [event.elementType]: event.error?.message,
      },
    });
    setCardComplete({ ...cardComplete, [event.elementType]: event.complete });
  }

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <AddressForm />;
      case 1:
        return <Review />;
      case 2:
        return (
          <PaymentForm
            cardState={cardState}
            onCardInputChange={onCardInputChange}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }

  const currentValidationSchema = validationSchema[activeStep];

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(currentValidationSchema),
  });

  useEffect(() => {
    agent.Account.fetchAddress().then((response) => {
      if (response) {
        methods.reset({
          // resetting form with new received values
          ...methods.getValues(), // existing values of the form
          ...response, // adding new values from response
          saveAddress: false,
        });
      }
    });
  }, [methods]);

  async function submitOrder(data: FieldValues) {
    setLoading(true);
    const { nameOnCard, saveAddress, ...address } = data;
    //checking if we have a stripe and elements
    if (!stripe || !elements || !basket?.clientSecret) return; // stripe not ready
    try {
      const cardElement = elements.getElement(CardNumberElement);
      const paymentResult = await stripe.confirmCardPayment(
        basket?.clientSecret,
        {
          payment_method: {
            card: cardElement!,
            billing_details: {
              name: nameOnCard,
            },
          },
        }
      );
      console.log(paymentResult);
      if (paymentResult.paymentIntent?.status === "succeeded") {
        const orderNumber = await agent.Orders.create({
          saveAddress,
          shippingAddress: address,
        }); // saveAddress & shippingAddress names as per API !!!
        setOrderNumber(orderNumber);
        setPaymentSucceeded(true);
        setPaymentMessage("Thank you - we have received your payment");
        setActiveStep(activeStep + 1);
        dispatch(clearBasket());
        setLoading(false);
      } else {
        setPaymentMessage(paymentResult.error?.message || "Payment failed");
        setPaymentSucceeded(false);
        setLoading(false);
        setActiveStep(activeStep + 1);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const handleNext = async (data: FieldValues) => {
    if (activeStep === steps.length - 1) {
      await submitOrder(data);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function submitDisabled(): boolean {
    if (activeStep === steps.length - 1) {
      return (
        !cardComplete.cardCvc ||
        !cardComplete.cardExpiry ||
        !cardComplete.cardNumber ||
        !methods.formState.isValid
      );
    } else {
      return !methods.formState.isValid;
    }
  }

  return (
    <FormProvider {...methods}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <>
          {activeStep === steps.length ? (
            <>
              <Typography variant="h5" gutterBottom>
                {paymentMessage}
              </Typography>
              {paymentSucceeded ? (
                <Typography variant="subtitle1">
                  Your order number is #{orderNumber}. We have not emailed your
                  order confirmation, and will not send you an update when your
                  order has shipped as this is a fake store!
                </Typography>
              ) : (
                <Button variant="contained" onClick={handleBack}>
                  Go back and try again
                </Button>
              )}
            </>
          ) : (
            <form onSubmit={methods.handleSubmit(handleNext)}>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <LoadingButton
                  loading={loading}
                  disabled={submitDisabled()}
                  variant="contained"
                  type="submit"
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Place order" : "Next"}
                </LoadingButton>
              </Box>
            </form>
          )}
        </>
      </Paper>
    </FormProvider>
  );
}
