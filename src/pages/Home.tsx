import React, { useEffect, useState } from "react";
import {
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
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

  const [currency, setCurrency] = useState<{ value: number; date: string }>({
    value: 0,
    date: "",
  });

  const [fromCurrency, setFromCurrency] = useState<Nation>("jpy");
  const [toCurrency, setToCurrency] = useState<Nation>("krw");

  const [isFirstField, setIsFirstField] = useState<boolean | null>(true);

  const handleFromValue = (e: any) => {
    setIsFirstField(true);

    const val = parseInt(e.target.value);

    if (isNaN(val)) return setFromValue(0);

    setFromValue(val);
  };

  const handleToValue = (e: any) => {
    setIsFirstField(false);

    const val = parseInt(e.target.value);

    if (isNaN(val)) return setToValue(0);

    setToValue(val);
  };

  useEffect(() => {
    const url = isFirstField
      ? `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${fromCurrency}/${toCurrency}.min.json`
      : `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${toCurrency}/${fromCurrency}.min.json`;

    axios.get(url).then((res) => {
      const currency = parseFloat(
        res.data[isFirstField ? toCurrency : fromCurrency]?.toFixed(6)
      );

      if (isFirstField) {
        setToValue(parseFloat((fromValue * currency).toFixed(6)));
      } else {
        setFromValue(parseFloat((toValue * currency).toFixed(6)));
      }

      setCurrency({ value: currency, date: res.data.date });
    });
  }, [isFirstField, fromValue, toValue, fromCurrency, toCurrency]);

  return (
    <Stack
      width={"100vw"}
      height={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Stack
        zIndex={1}
        width={"270px"}
        sx={{
          gap: 3,
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
          direction={"column"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={3}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: "26px" }}>
            {"Currency Converter"}
          </Typography>
          <Stack
            gap={2}
            direction={"column"}
            width={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Stack direction={"row"} alignItems={"center"} gap={2}>
              <Typography
                variant="body1"
                color={"primary"}
                sx={{
                  fontWeight: 700,
                  fontSize: "18px",
                }}
              >
                {`1 ${(isFirstField
                  ? fromCurrency
                  : toCurrency
                ).toUpperCase()} = ${currency?.value} ${(isFirstField
                  ? toCurrency
                  : fromCurrency
                ).toUpperCase()}`}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack
          direction={"column"}
          alignItems={"center"}
          gap={1}
          justifyContent={"space-between"}
        >
          <TextField
            fullWidth
            value={fromValue}
            onChange={handleFromValue}
            InputProps={{
              endAdornment: (
                <Stack gap={0.5} direction={"row"} alignItems={"center"}>
                  {fromValue !== 0 && (
                    <IconButton
                      size="small"
                      sx={{ opacity: 0.5 }}
                      onClick={() => setFromValue(0)}
                    >
                      <HighlightOffRoundedIcon />
                    </IconButton>
                  )}

                  <TextField
                    sx={{ minWidth: "80px" }}
                    select
                    variant="standard"
                    value={fromCurrency}
                    onChange={(e: any) => {
                      setFromCurrency(e.target.value);
                      setFromValue(0);
                      setToValue(0);

                      setIsFirstField(true);
                    }}
                  >
                    {Object.values(currencyMap).map(
                      ({ title, img }: Example) => {
                        return (
                          <MenuItem value={title} key={title}>
                            <Stack
                              flexDirection={"row"}
                              gap={1}
                              alignItems={"center"}
                            >
                              <img src={img} width={16} height={16} />
                              <Typography>{title.toUpperCase()}</Typography>
                            </Stack>
                          </MenuItem>
                        );
                      }
                    )}
                  </TextField>
                </Stack>
              ),
            }}
          />

          <ImportExportIcon color="action" />

          <TextField
            fullWidth
            value={toValue}
            onChange={handleToValue}
            InputProps={{
              endAdornment: (
                <Stack gap={0.5} direction={"row"} alignItems={"center"}>
                  {fromValue !== 0 && (
                    <IconButton
                      size="small"
                      sx={{ opacity: 0.5 }}
                      onClick={() => setToValue(0)}
                    >
                      <HighlightOffRoundedIcon />
                    </IconButton>
                  )}
                  <TextField
                    sx={{ minWidth: "80px" }}
                    select
                    variant="standard"
                    value={toCurrency}
                    onChange={(e: any) => {
                      setToCurrency(e.target.value);
                      setFromValue(0);
                      setToValue(0);
                      setIsFirstField(false);
                    }}
                  >
                    {Object.values(currencyMap).map(
                      ({ title, img }: Example) => {
                        return (
                          <MenuItem value={title} key={title}>
                            <Stack
                              flexDirection={"row"}
                              gap={1}
                              alignItems={"center"}
                            >
                              <img src={img} width={16} height={16} />
                              <Typography>{title.toUpperCase()}</Typography>
                            </Stack>
                          </MenuItem>
                        );
                      }
                    )}
                  </TextField>
                </Stack>
              ),
            }}
          />
        </Stack>
        <Stack
          width={"100%"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          gap={2}
        >
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
              fontWeight: 500,
              color: "rgba(0, 0, 0, 0.9)",
              fontSize: "14px",
            }}
          >
            {currency?.date}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
