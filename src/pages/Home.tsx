import React, { useEffect, useState } from "react";
import { MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";

type nation = "jpy" | "eur" | "usd";

const currencyMap = {
  jpy: {
    label: "￥(엔)",
  },
  eur: {
    label: "€(유로)",
  },
  usd: {
    label: "＄(달러)",
  },
};

const Home = () => {
  const [fromCurrency, setFromCurrency] = useState<nation>("jpy");
  const [toCurrency, setToCurrency] = useState<string>("krw");
  const [currencyData, setCurrencyData] = useState<{
    date: any;
    [key: string]: number;
  }>();

  const [value, setValue] = useState<number>(0);

  const convertCurrency = () => {
    if (!currencyData) return;

    return `${(value * currencyData[toCurrency]).toFixed(2)} 원`;
  };

  const handleChange = (e: any) => {
    const val = e.target.value;

    setValue(val);
  };

  useEffect(() => {
    axios
      .get(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${fromCurrency}/${toCurrency}.min.json`
      )
      .then((res) => {
        setCurrencyData(res.data);
      });
  }, [value]);

  return (
    <Stack
      width={"100vw"}
      height={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Stack
        gap={5}
        border={1}
        borderRadius={2}
        p={4}
        borderColor={"#d3d3d3"}
        sx={{ boxShadow: "0 8px 15px -4px rgba(0, 0, 0, 0.6)" }}
      >
        <Typography variant="h5">{"Currency Converter"}</Typography>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-around"}
        >
          <Select
            value={fromCurrency}
            onChange={(e: any) => {
              setFromCurrency(e.target.value);
              setValue(0);
            }}
            sx={{ width: "85px" }}
          >
            <MenuItem value="jpy">JPY</MenuItem>
            <MenuItem value="usd">USD</MenuItem>
            <MenuItem value="eur">EUR</MenuItem>
          </Select>
          <Select
            value={toCurrency}
            onChange={(e: any) => setToCurrency(e.target.value)}
            inputProps={{ readOnly: true }}
            sx={{ width: "85px" }}
          >
            <MenuItem value="krw">KRW</MenuItem>
          </Select>
        </Stack>
        <TextField
          label={currencyMap[fromCurrency]?.label}
          variant="standard"
          type="number"
          value={value}
          onChange={handleChange}
        />
        <Stack gap={4} flexDirection={"column"} alignItems={"flex-start"}>
          <Typography variant="body2">{`환전 금액 : ${convertCurrency()}`}</Typography>
          <Typography variant="body2">{`기준 날짜 : ${currencyData?.date} `}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
