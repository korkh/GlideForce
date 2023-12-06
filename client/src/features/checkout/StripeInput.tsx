import { InputBaseComponentProps } from "@mui/material";
import { forwardRef, Ref, useImperativeHandle, useRef } from "react";

interface Props extends InputBaseComponentProps {}

export const StripeInput = forwardRef(function StripeInput(
  { component: Component, ...props }: Props,
  ref: Ref<unknown>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elementRef = useRef<any>();

  // https://react.dev/reference/react/useImperativeHandle
  useImperativeHandle(ref, () => ({
    focus: () => elementRef.current.focus,
  }));

  return (
    <Component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onReady={(element: any) => (elementRef.current = element)}
      {...props}
    />
  );
});
