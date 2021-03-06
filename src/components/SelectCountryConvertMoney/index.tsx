import React, { useEffect, useState, useCallback, ChangeEvent } from "react";

import fx from "../../services/money";
import api from "../../services/api";

import { FiRefreshCcw } from "react-icons/fi";

import { Container, SelectionsDiv, ConvertedMoneyDiv } from "./styles";

import Axios from "axios";

interface CountryData {
  label: string;
  id: string;
  value: string;
  flag: string;
}

interface DataCountryConvertMoney {
  selectedCountryFrom: CountryData;
  selectedCountryTo: CountryData;
  valueToBeConverted: number;
  convertedValue: number;
}

interface Props {
  countryAndConvertedMoney: (data: DataCountryConvertMoney) => void;
  onClick: () => void;
}

/**
 * Select the country from/to, and convert money from/to
 * @constructor
 * @param {(DataCountryConvertMoney) => void} countryAndConvertedMoney -  Pass all data already formatted
 * @param {() => void} onClick - Just to know if this container was clicked (To close the calendar)
 */
const SelectCountryConvertMoney: React.FC<Props> = ({
  countryAndConvertedMoney,
  onClick,
}) => {
  const [countries, setCountries] = useState<CountryData[]>([]);

  const defaultCountryValue = {
    label: "Canada",
    id: "CAD",
    value: "CAD",
    flag: "https://www.countryflags.io/ca/flat/64.png",
  };

  const [selectedCountryFrom, setSelectedCountryFrom] = useState<CountryData>(
    defaultCountryValue
  );

  const [selectedCountryTo, setSelectedCountryTo] = useState<CountryData>(
    defaultCountryValue
  );

  const [valueToBeConverted, setValueToBeConverted] = useState(0);
  const [convertedValue, setConvertedValue] = useState(0);

  useEffect(() => {
    api.get("/currencies").then((response) => {
      setCountries(response.data);
    });
  }, []);

  useEffect(() => {
    Axios.get(
      "https://openexchangerates.org/api/latest.json?app_id=f2d55242a75a4a8685d5c1c4c3c40bef"
    ).then((response) => {
      fx.rates = response.data.rates;
      fx.base = response.data.base;
    });
  }, []);

  useEffect(() => {
    try {
      setConvertedValue(
        fx
          .convert(valueToBeConverted, {
            from: selectedCountryFrom?.value,
            to: selectedCountryTo?.value,
          })
          .toFixed(2)
      );
    } catch (err) {}
  }, [selectedCountryFrom, selectedCountryTo, valueToBeConverted]);

  useEffect(() => {
    countryAndConvertedMoney({
      selectedCountryFrom,
      selectedCountryTo,
      valueToBeConverted,
      convertedValue,
    });
  }, [
    convertedValue,
    countryAndConvertedMoney,
    selectedCountryFrom,
    selectedCountryTo,
    valueToBeConverted,
  ]);

  /**
   * Function to handle with select country 'from'
   * @function
   * @param {ChangeEvent<HTMLSelectElement>} event - Take the value that was selected
   */
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

  /**
   * Function to handle with select country 'to'
   * @function
   * @param {ChangeEvent<HTMLSelectElement>} event - Take the value that was selected
   */
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

  /**
   * Take the value that will be convert
   * @function
   * @param {ChangeEvent} e - The value that will be convert
   */
  const handleInputValueSent = useCallback((e) => {
    if (e.target.value < 0) {
      setValueToBeConverted(0);
    } else setValueToBeConverted(e.target.value);
  }, []);

  return (
    <Container onClick={onClick}>
      <SelectionsDiv>
        <div id="selectionCountryDiv">
          <p>From:</p>
          <div>
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
        </div>

        <ConvertedMoneyDiv>
          <div>
            <span>You send</span>
            <h2>
              <input
                placeholder="22,124"
                type="number"
                min={0}
                onChange={handleInputValueSent}
                value={valueToBeConverted}
              />
              {selectedCountryFrom.value}
            </h2>
          </div>
        </ConvertedMoneyDiv>
      </SelectionsDiv>

      <FiRefreshCcw size={18} color="#f364a2" />

      <SelectionsDiv>
        <div id="selectionCountryDiv">
          <p>To:</p>
          <div>
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
        </div>

        <ConvertedMoneyDiv>
          <div>
            <span>Recipient gets</span>
            <h2>
              <input readOnly value={convertedValue}></input>{" "}
              {selectedCountryTo.value}
            </h2>
          </div>
        </ConvertedMoneyDiv>
      </SelectionsDiv>
    </Container>
  );
};

export default SelectCountryConvertMoney;
