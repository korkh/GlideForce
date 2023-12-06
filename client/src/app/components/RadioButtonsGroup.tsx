import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface Option {
  value: string;
  label: string;
}

type Options = Option[];

interface Props {
  options: Options;
  onChange?: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  selectedValue: string;
}

export default function RadioButtonGroup({
  options,
  onChange,
  selectedValue,
}: Props) {
  return (
    <FormControl component="fieldset">
      <RadioGroup onChange={onChange} value={selectedValue}>
        {options.map(({ value, label }) => (
          <FormControlLabel
            value={value}
            control={<Radio />}
            label={label}
            key={value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
