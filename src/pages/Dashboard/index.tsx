import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import { NavLink } from "react-router-dom";

import api from "../../services/api";
import fx from "../../services/money";

import DayPicker from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

import { DatePicker, Space } from "antd";
import "antd/dist/antd.css";

import {
  FiGrid,
  FiRepeat,
  FiShuffle,
  FiCreditCard,
  FiDatabase,
  FiSettings,
  FiLogOut,
  FiRefreshCcw,
  FiCalendar,
  FiArrowRight,
  FiFileText,
  FiHelpCircle,
  FiDollarSign,
  FiCheck,
} from "react-icons/fi";

import {
  Container,
  LeftSideContainer,
  ProfileInfo,
  ServicesButtons,
  MiddleSideContainer,
  MiddleHeader,
  SelectionsDiv,
  ConvertedMoneyDiv,
  CalendarHeader,
  ListOfPlans,
  InputRadio,
  RightSideContainer,
  RightSideButtons,
  PaymentDetails,
  MoneyConverted,
  TransactionInfos,
} from "./styles";
import Axios from "axios";

interface CountryData {
  label: string;
  id: string;
  value: string;
  flag: string;
}

const Dashboard: React.FC = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);

  const [selectedCountryFrom, setSelectedCountryFrom] = useState<CountryData>({
    label: "Canada",
    id: "CAD",
    value: "CAD",
    flag: "https://www.countryflags.io/ca/flat/64.png",
  });

  const [selectedCountryTo, setSelectedCountryTo] = useState<CountryData>({
    label: "Canada",
    id: "CAD",
    value: "CAD",
    flag: "https://www.countryflags.io/ca/flat/64.png",
  });

  const [valueTobeConverted, setValueToBeConverted] = useState(0);
  const [convertedValue, setConvertedValue] = useState(0);

  useEffect(() => {
    api.get("/currencies").then((response) => {
      setCountries(response.data);
    });
  }, []);

  // useEffect(() => {
  //   Axios.get(
  //     "https://openexchangerates.org/api/latest.json?app_id=f2d55242a75a4a8685d5c1c4c3c40bef"
  //   ).then((response) => {
  //     fx.rates = response.data.rates;
  //     fx.base = response.data.base;
  //   });
  // }, []);

  useEffect(() => {
    try {
      setConvertedValue(
        fx
          .convert(valueTobeConverted, {
            from: selectedCountryFrom?.value,
            to: selectedCountryTo?.value,
          })
          .toFixed(2)
      );
    } catch (err) {}
  }, [selectedCountryFrom, selectedCountryTo, valueTobeConverted]);

  const handleSelectedCountryFrom = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const country = event.target.value;

      api
        .get("/currencies", { params: { label: country } })
        .then((response) => {
          setSelectedCountryFrom(response.data[0]);
        });
    },
    []
  );

  const handleSelectedCountryTo = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const country = event.target.value;

      api
        .get("/currencies", { params: { label: country } })
        .then((response) => {
          setSelectedCountryTo(response.data[0]);
        });
    },
    []
  );

  return (
    <Container>
      <LeftSideContainer>
        <ProfileInfo>
          <img
            src="https://avatars0.githubusercontent.com/u/57776263?s=460&u=0492ca374347582300b38a8665c05574b329fec6&v=4"
            alt="perfil"
          />
          <h2>Marcus Martins</h2>
          <p>1231T233</p>
        </ProfileInfo>

        <ServicesButtons>
          <div>
            <NavLink to="/">
              <FiGrid size={18} />
              Services
            </NavLink>
            <NavLink to="/">
              <FiRepeat size={18} />
              Transaction
            </NavLink>
            <NavLink
              activeStyle={{
                color: "#E8368F",
                borderCollapse: "separate",
                borderSpacing: "115px 0",
                borderLeft: "3px solid #E8368F",
              }}
              to="/"
            >
              <FiShuffle size={18} />
              Send Money
            </NavLink>
            <NavLink to="/">
              <FiCreditCard size={18} />
              Cards
            </NavLink>
            <NavLink to="/">
              <FiDatabase size={18} />
              History
            </NavLink>
          </div>

          <div>
            <NavLink to="/">
              <FiSettings size={18} />
              Settings
            </NavLink>
            <NavLink to="/">
              <FiLogOut size={18} />
              Log Out
            </NavLink>
          </div>
        </ServicesButtons>
      </LeftSideContainer>

      <MiddleSideContainer>
        <MiddleHeader>
          <h1>Send Money</h1>
          <div>
            <p>
              <strong>22,124</strong> available
            </p>
          </div>
        </MiddleHeader>

        <SelectionsDiv>
          <div>
            <p>from:</p>
            {selectedCountryFrom && (
              <img src={selectedCountryFrom.flag} alt="flag" />
            )}
            <select onChange={handleSelectedCountryFrom}>
              {countries.map((country) => (
                <option key={country.id} value={country.label}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p>to:</p>
            {selectedCountryTo && (
              <img src={selectedCountryTo.flag} alt="flag" />
            )}
            <select onChange={handleSelectedCountryTo}>
              {countries.map((country) => (
                <option key={country.id} value={country.label}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>
        </SelectionsDiv>

        <ConvertedMoneyDiv>
          <div>
            <span>You send</span>
            <h2>
              <input
                placeholder="22,124"
                value={valueTobeConverted}
                type="number"
                onChange={(e) => setValueToBeConverted(Number(e.target.value))}
              />
              {selectedCountryFrom.value}
            </h2>
          </div>

          <FiRefreshCcw size={18} color="#f364a2" />

          <div>
            <span>Recipient gets</span>
            <h2>
              <input value={convertedValue}></input> {selectedCountryTo.value}
            </h2>
          </div>
        </ConvertedMoneyDiv>

        <CalendarHeader>
          <h2>Choose a plan:</h2>
          <span>
            <p>Choose the date:</p>
            <FiCalendar size={24} />
            <DatePicker
              bordered={false}
              placeholder=""
              style={{
                position: "absolute",
                color: "transparent",
                marginLeft: "18px",
              }}
            />
          </span>
        </CalendarHeader>

        <ListOfPlans>
          <InputRadio>
            <input type="radio" name="option" id="option1" />
            <label htmlFor="option1">
              <FiCheck />

              <div>
                <p>Get 27 July 2020 till 12pm</p>
                <span>Express</span>
              </div>

              <strong>$ 0.99</strong>
            </label>
          </InputRadio>

          <InputRadio>
            <input type="radio" name="option" id="option2" />
            <label htmlFor="option2">
              <FiCheck />

              <div>
                <p>Get 27 July 2020 till 12pm</p>
                <span>Express</span>
              </div>

              <strong>$ 0.99</strong>
            </label>
          </InputRadio>

          <InputRadio>
            <input type="radio" name="option" id="option3" />
            <label htmlFor="option3">
              <FiCheck />

              <div>
                <p>Get 27 July 2020 till 12pm</p>
                <span>Express</span>
              </div>

              <strong>$ 0.99</strong>
            </label>
          </InputRadio>
        </ListOfPlans>
      </MiddleSideContainer>

      <RightSideContainer>
        <RightSideButtons>
          <button>
            <FiFileText size={24} color="#1F2933" />
          </button>
          <button>
            <FiHelpCircle size={24} color="#1F2933" />
          </button>
        </RightSideButtons>

        <PaymentDetails>
          <h2>Payment Details</h2>

          <MoneyConverted>
            <div>
              <p>{valueTobeConverted}</p>
              <span>
                <img src={selectedCountryFrom.flag} alt="flag" />
                {selectedCountryFrom.value}
              </span>
            </div>
            <button>
              <FiArrowRight size={24} color="#1F2933" />
            </button>
            <div>
              <p>{convertedValue}</p>
              <span>
                <img src={selectedCountryTo.flag} alt="flag" />
                {selectedCountryTo.value}
              </span>
            </div>
          </MoneyConverted>

          <TransactionInfos>
            <div>
              <p>
                <FiCalendar size={24} /> Delivery
              </p>
              <strong>27 July till 12pm</strong>
            </div>
            <div>
              <p>
                <FiDollarSign size={24} /> Conversion rate
              </p>
              <strong>{valueTobeConverted}</strong>
            </div>
            <div>
              <p>
                <FiShuffle size={24} /> Recipient gets
              </p>
              <strong>{convertedValue}</strong>
            </div>

            <button>Confirm</button>
          </TransactionInfos>
        </PaymentDetails>
      </RightSideContainer>
    </Container>
  );
};

export default Dashboard;
