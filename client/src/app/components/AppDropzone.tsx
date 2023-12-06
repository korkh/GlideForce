import { UploadFile } from "@mui/icons-material";
import { FormControl, FormHelperText, Typography } from "@mui/material";
import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {}

export default function AppDropzone(props: Props) {
  const { fieldState, field } = useController({ ...props, defaultValue: null });
  const inputRef = useRef<HTMLInputElement>(null);

  const dzStyles = {
    display: "flex",
    border: "dashed 3px #eee",
    borderColor: "#eee",
    borderRadius: "5px",
    paddingTop: "30px",
    alignItems: "center",
    height: 200,
    width: 500,
  };

  const dzActive = {
    borderColor: "green",
    background: "lightgreen",
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles[0] = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      });
      field.onChange(acceptedFiles[0]);
    },
    [field]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      "image/*": [".jpeg", ".png"],
    }, // Set accepted file types if needed
  });

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div {...getRootProps()}>
      <FormControl
        onClick={handleClick}
        style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}
        error={!!fieldState.error}
      >
        <input {...getInputProps()} ref={inputRef} />
        <UploadFile sx={{ fontSize: "100px" }} />
        <Typography variant="h6">Drop image here or click to upload</Typography>
        <FormHelperText>{fieldState.error?.message}</FormHelperText>
      </FormControl>
    </div>
  );
}
