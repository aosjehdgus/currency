import React, { useEffect, useState } from "react";
import { MenuItem, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import koImg from "../images/ko.png";
import jpImg from "../images/jp.png";
import euImg from "../images/eu.png";
import usImg from "../images/us.png";
import twImg from "../images/tw.png";

type Nation = "krw" | "jpy" | "eur" | "usd" | "twd";

type Example = { title: string; label: string; img: any };

type CurrencyMap = Record<Nation, Example>;

const currencyMap: CurrencyMap = {
  krw: {
    title: "krw",
    label: "원",
    img: koImg,
  },
  jpy: {
    title: "jpy",
    label: "￥(엔)",
    img: jpImg,
  },
  eur: {
    title: "eur",
    label: "€(유로)",
    img: euImg,
  },
  usd: {
    title: "usd",
    label: "＄(달러)",
    img: usImg,
  },
  twd: {
    title: "twd",
    label: "NT$(대만 달러)",
    img: twImg,
  },
};

const Home = () => {
  const [fromValue, setFromValue] = useState<number>(0);
  const [toValue, setToValue] = useState<number>(0);

  const [criteria, setCriteria] = useState<number>(0);

  const [fromCurrency, setFromCurrency] = useState<Nation>("jpy");
  const [toCurrency, setToCurrency] = useState<Nation>("krw");
  const [currencyData, setCurrencyData] = useState<{
    date: any;
    [key: string]: number;
  }>();

  const handleFromValue = (e: any) => {
    const val = parseInt(e.target.value);

    if (isNaN(val)) return setFromValue(0);

    setFromValue(val);
  };

  useEffect(() => {
    axios
      .get(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${fromCurrency}/${toCurrency}.min.json`
      )
      .then((res) => {
        setCurrencyData(res.data);
      });
  }, [fromValue, toValue, fromCurrency, toCurrency]);

  useEffect(() => {
    if (!currencyData) return;

    const currency = currencyData[toCurrency];

    setCriteria(parseFloat(currency?.toFixed(2)));
    setToValue(
      currency
        ? parseFloat((fromValue * parseFloat(currency.toFixed(2))).toFixed(2))
        : 0
    );
  }, [fromValue, currencyData]);

  return (
    <Stack
      width={"100vw"}
      height={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Stack
        zIndex={1}
        sx={{
          gap: 5,
          border: 1,
          borderRadius: 2,
          padding: 4,
          borderColor: "#d3d3d3",
          background: "rgba(0, 0, 0, 0.01)",
          boxShadow:
            "inset -3px -3px 5px rgba(0, 0, 0, 0.03), inset 3px 3px 5px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={4}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: "24px" }}>
            {"Currency Converter"}
          </Typography>
          <Stack gap={2} direction={"column"} alignItems={"flex-start"}>
            <Stack direction={"row"} alignItems={"center"} gap={2}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  color: "rgba(0, 0, 0, 0.9)",
                  fontSize: "14px",
                }}
              >
                기준 날짜
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 300,
                  color: "rgba(0, 0, 0, 0.9)",
                  fontSize: "14px",
                }}
              >
                {currencyData?.date}
              </Typography>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} gap={2}>
              <Typography
                variant="body1"
                color={"primary"}
                sx={{
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {`1 ${fromCurrency.toUpperCase()} = ${criteria} ${toCurrency.toUpperCase()}`}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack
          direction={"column"}
          alignItems={"center"}
          gap={2}
          justifyContent={"space-between"}
        >
          <TextField
            fullWidth
            value={fromValue}
            onChange={handleFromValue}
            InputProps={{
              endAdornment: (
                <TextField
                  sx={{ width: "145px" }}
                  select
                  variant="standard"
                  value={fromCurrency}
                  onChange={(e: any) => {
                    setFromCurrency(e.target.value);
                    setFromValue(0);
                    setToValue(0);
                  }}
                >
                  {Object.values(currencyMap).map(({ title, img }: Example) => {
                    return (
                      <MenuItem value={title}>
                        <Stack flexDirection={"row"} gap={1}>
                          <img src={img} width={24} />
                          <Typography>{title.toUpperCase()}</Typography>
                        </Stack>
                      </MenuItem>
                    );
                  })}
                </TextField>
              ),
            }}
          />
          <ArrowDownwardIcon color="action" />

          <TextField
            fullWidth
            value={toValue}
            InputProps={{
              endAdornment: (
                <TextField
                  sx={{ width: "145px" }}
                  select
                  variant="standard"
                  value={toCurrency}
                  onChange={(e: any) => {
                    setToCurrency(e.target.value);
                    setFromValue(0);
                    setToValue(0);
                  }}
                >
                  {Object.values(currencyMap).map(({ title, img }: Example) => {
                    return (
                      <MenuItem value={title}>
                        <Stack flexDirection={"row"} gap={1}>
                          <img src={img} width={24} />
                          <Typography>{title.toUpperCase()}</Typography>
                        </Stack>
                      </MenuItem>
                    );
                  })}
                </TextField>
              ),
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
