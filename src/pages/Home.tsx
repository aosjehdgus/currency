import { Box, Stack, TextField } from "@mui/material";
import React, { useState } from "react";

const Home = () => {
  const [jpCurrency, setJpCurrency] = useState<number>(0);
  const [koCurrency, setKoCurrency] = useState<number>(0);

  const handleChange = (e: any) => {
    const val = e.target.value;

    setJpCurrency(val);
    setKoCurrency(parseInt((val * 8.71).toFixed()));
  };

  return (
    <Stack
      width={"100vw"}
      height={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Stack gap={4}>
        <TextField
          label="엔"
          variant="standard"
          type="number"
          value={jpCurrency}
          onChange={handleChange}
        />
        <TextField
          label="원"
          variant="standard"
          type="number"
          value={koCurrency}
          InputProps={{
            readOnly: true,
          }}
        />
      </Stack>
    </Stack>
  );
};

export default Home;
