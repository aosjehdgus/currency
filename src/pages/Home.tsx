import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import koImg from "../images/ko.png";
import jpImg from "../images/jp.png";
import euImg from "../images/eu.png";
import usImg from "../images/us.png";
import twImg from "../images/tw.png";
import dayjs from "dayjs";

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

const conversationMap = {
  실례합니다: {
    label: "시츠레이시마스",
  },
  "한국 서울에서 왔어요": {
    label: "칸코쿠노 소우루카라 키마시타",
  },
  "정말 큰 도움이 됐어요": {
    label: "혼토니 다스카리마시타",
  },
  "몇 살이세요?": {
    label: "오이쿠츠데스까 ",
  },
  "저는 서른살입니다": {
    label: "와따시와 산주사이 데스",
  },
  "일본어는 조금밖에 못합니다": {
    label: "니혼고와 스코시 시카 데키마세",
  },
  "당신의 이름은 무엇입니까?": {
    label: "아마따노 나마에와 난데스까",
  },
  잘먹었습니다: {
    label: "고치소 사마데시타",
  },
  "카드 계산 가능한가요?": {
    label: "카아도켓사이데키마스카",
  },
  "조금 생각해볼게요.": {
    label: "초쯔토 칸가에마스",
  },
  "실례지만 계산해주세요": {
    label: "스미마셍 오카이케에 오네가이시마스",
  },
  "영수증 부탁드립니다.": {
    label: "레시-토 오네가이시마스",
  },
  "사진 좀 찍어주실래요?": {
    label: "오샤신오 톳테 모라에미스까?",
  },
  얼마입니까: {
    label: "이꾸라 데스까",
  },
  "입어봐도 되나요?": {
    label: "키떼 미떼모 이- 데스까 ",
  },
  "딱 맞습니다.": {
    label: "핍따리데스",
  },
  "면세 됩니까?": {
    label: "멘제이 데끼마스까",
  },
  "도와줘서 고마워.": {
    label: "데츠닷테쿠레테 아리가토",
  },
  괜찮습니다: {
    label: "다이죠부데스",
  },
  "이것 있습니까": {
    label: "코레와 아리마수까",
  },
  하나: {
    label: "히또쯔",
  },
  둘: {
    label: "후따즈",
  },
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            background: "rgba(0, 0, 0, 0.01)",
            boxShadow:
              "inset -3px -3px 5px rgba(0, 0, 0, 0.05), inset 3px 3px 5px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Home = () => {
  const [value, setValue] = useState(0);

  const [fromValue, setFromValue] = useState<number>(0);
  const [toValue, setToValue] = useState<number>(0);

  const [currency, setCurrency] = useState<{ value: number; date: string }>({
    value: 0,
    date: "",
  });

  const [fromCurrency, setFromCurrency] = useState<Nation>("jpy");
  const [toCurrency, setToCurrency] = useState<Nation>("krw");

  const [isFirstField, setIsFirstField] = useState<boolean>(true);

  const today = dayjs().format("YYYY-MM-DD");

  const [date, setDate] = useState<string>(today);

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

  const initValue = () => {
    setFromValue(0);
    setToValue(0);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const url = isFirstField
      ? `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${date}/currencies/${fromCurrency}/${toCurrency}.min.json`
      : `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${date}/currencies/${toCurrency}/${fromCurrency}.min.json`;

    axios
      .get(url)
      .then((res) => {
        const currency = parseFloat(
          res.data[isFirstField ? toCurrency : fromCurrency]?.toFixed(6)
        );

        if (isFirstField) {
          setToValue(parseFloat((fromValue * currency).toFixed(6)));
        } else {
          setFromValue(parseFloat((toValue * currency).toFixed(6)));
        }

        setCurrency({ value: currency, date: res.data.date });
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 404) {
          setDate("latest");
        }
        console.error(err);
      });
  }, [date, isFirstField, fromValue, toValue, fromCurrency, toCurrency]);

  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth"
        >
          <Tab icon={<CurrencyExchangeOutlinedIcon />} />
          <Tab icon={<SmsOutlinedIcon />} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Stack
          sx={{
            gap: 3,
            borderRadius: 2,
            padding: 4,
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
              <Stack direction={"column"} alignItems={"center"} gap={2}>
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
                        onClick={() => {
                          initValue();
                        }}
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
                        setIsFirstField(true);
                        setFromCurrency(e.target.value);
                        initValue();
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
                        onClick={() => {
                          initValue();
                        }}
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
                        setIsFirstField(false);
                        setToCurrency(e.target.value);
                        initValue();
                      }}
                    >
                      {Object.values(currencyMap).map(
                        ({ title, img }: Example) => {
                          return (
                            <MenuItem value={title} key={title}>
                              <Stack
                                gap={1}
                                flexDirection={"row"}
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
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Stack
          maxHeight={"300px"}
          overflow={"scroll"}
          sx={{
            gap: 3,
            borderRadius: 2,
            padding: 4,
          }}
        >
          <Stack alignItems={"center"}>
            <Typography variant="h4" sx={{ fontWeight: 700, fontSize: "26px" }}>
              {"기본 회화"}
            </Typography>
          </Stack>

          <Stack
            width={"100%"}
            direction={"column"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            gap={2}
          >
            {Object.entries(conversationMap).map(([key, item]) => {
              return (
                <Stack direction={"row"} gap={1}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: "rgba(0, 0, 0, 0.9)",
                      fontSize: "12px",
                    }}
                  >
                    {key}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: "rgba(0, 0, 0, 0.7)",
                      fontSize: "12px",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CustomTabPanel>
    </>
  );
};

export default Home;
