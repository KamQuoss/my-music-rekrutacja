import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  FormHelperText,
  Modal,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";

import { pesel, nip } from "../utils/validators";

const schema = yup.object().shape({
  picture: yup
    .mixed()
    .test("required", "You need to provide a file", (value) => {
      return value && value.length;
    })
    .test("fileSize", "The file is too large", (value, context) => {
      return value && value[0] && value[0].size <= 200000;
    })
    .test("type", "We only support jpeg", function (value) {
      return value && value[0] && value[0].type === "image/jpeg";
    })
});

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4
};

const defaultValues = {
  firstfirstName: "",
  lastName: "",
  idNumber: "",
  type: "private"
};

export default function Form() {
  const [open, setOpen] = useState(false);
  const [isPesel, setIsPesel] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpen = () => {
    setOpen(true);
    reset(defaultValues);
  };
  const handleClose = () => {
    setOpen(false);
    reset(defaultValues);
  };

  const {
    control,
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { ...defaultValues },
    mode: "onBlur",
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    setIsPesel((value) => !value);
  }, [watch("type", "private")]);

  const onSubmit = (data) => {
    console.log(data);
    fetch("https://localhost:60001/Contractor/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data
    })
      .then((response) => {
        setMessage("Konrahent dodany poprawnie");
      })
      .catch((error) => {
        setMessage("Nie znaleziono metody zapisu");
      });
    handleOpen();
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        sx={{
          bgcolor: "background.paper",
          boxShadow: 1,
          borderRadius: 1,
          p: 3,
          mt: 3
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              rules={{
                required: "Pole nie może być puste",
                maxLength: {
                  value: 80,
                  message: "Wpisane dane są za długie"
                },
                minLength: {
                  value: 3,
                  message: "Wpisane dane są za krótkie"
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Imię"
                  error={errors.firstName ? true : false}
                  helperText={errors.firstName?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"
              control={control}
              rules={{
                required: "Pole nie może być puste",
                maxLength: {
                  value: 80,
                  message: "Sprawdż poprawność danych"
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Nazwisko"
                  error={errors.lastName ? true : false}
                  helperText={errors.lastName?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="type"
              control={control}
              defaultValue="private"
              rules={{ required: "Wybierz odpowiedż" }}
              render={({ field }) => (
                <FormControl
                  component="fieldset"
                  error={errors.type ? true : false}
                >
                  <RadioGroup row aria-label="gender" required {...field}>
                    <FormControlLabel
                      value="private"
                      control={<Radio />}
                      label="osoba prywatna"
                    />
                    <FormControlLabel
                      value="company"
                      control={<Radio />}
                      label="firma"
                    />
                  </RadioGroup>
                  {errors.type && (
                    <FormHelperText>{errors.type?.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="idNumber"
              control={control}
              rules={{
                required: "Pole nie może być puste",
                validate: isPesel
                  ? (v) => pesel(v) || "Nieprawidłowy numer PESEL"
                  : (v) => nip(v) || "Nieprawidłowy numer NIP"
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={isPesel ? "PESEL" : "NIP"}
                  error={errors.idNumber ? true : false}
                  helperText={errors.idNumber?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="picture">Picture</label>
            <input id="picture" {...register("picture")} type="file" />
            {errors.picture && <p>{errors.picture.message}</p>}
          </Grid>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Button variant="contained" type="submit" children="Prześlij" />
          </Grid>
        </Grid>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-description">{message}</Typography>
        </Box>
      </Modal>
    </>
  );
}
