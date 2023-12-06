import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";

interface Props extends UseControllerProps {
  label: string;
  items: string[];
}

export default function AppSelectList({ label, items, ...props }: Props) {
  const { fieldState, field } = useController({ ...props, defaultValue: "" });

  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel>{label}</InputLabel>
      <Select value={field.value} label={label} onChange={field.onChange}>
        {items.map((item, index) => (
          <MenuItem value={item} key={index}>
            {item}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}
