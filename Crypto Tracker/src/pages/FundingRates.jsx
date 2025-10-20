import { useEffect, useState } from "react";
import Loading from "../components/Loading";

export default function FundingRates() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [
          binanceResponse,
          bybitResponse,
          bitgetResponse,
          coinGeckoResponse,
        ] = await Promise.all([
          fetch("https://fapi.binance.com/fapi/v1/premiumIndex"),
          fetch("https://api.bybit.com/v5/market/tickers?category=linear"),
          fetch(
            "https://api.bitget.com/api/v2/mix/market/tickers?productType=USDT-FUTURES"
          ),
          fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1"
          ),
        ]);

        const binanceData = await binanceResponse.json();
        const bybitData = await bybitResponse.json();
        const bitgetData = await bitgetResponse.json();
        const coinGeckoData = await coinGeckoResponse.json();

        const marketCapMap = {};
        coinGeckoData.forEach((coin) => {
          const symbol = coin.symbol.toUpperCase() + "USDT";
          marketCapMap[symbol] = coin.market_cap;
        });

        const organized = {};

        binanceData.forEach((item) => {
          const symbol = item.symbol;
          if (!organized[symbol]) {
            organized[symbol] = {
              marketCap: marketCapMap[symbol] || 0,
            };
          }
          organized[symbol].binance = parseFloat(item.lastFundingRate) * 100;
        });

        bybitData.result.list.forEach((item) => {
          const symbol = item.symbol;
          if (!organized[symbol]) {
            organized[symbol] = {
              marketCap: marketCapMap[symbol] || 0,
            };
          }
          organized[symbol].bybit = parseFloat(item.fundingRate) * 100;
        });

        bitgetData.data.forEach((item) => {
          const symbol = item.symbol;
          if (!organized[symbol]) {
            organized[symbol] = {
              marketCap: marketCapMap[symbol] || 0,
            };
          }
          organized[symbol].bitget = parseFloat(item.fundingRate) * 100;
        });

        const sortedData = Object.entries(organized)
          .sort((a, b) => b[1].marketCap - a[1].marketCap)
          .map(([symbol, values]) => ({
            symbol,
            ...values,
          }));

        setData(sortedData);
        console.log(sortedData);
      } catch (error) {
        setError(error.message);
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="container text-center mt-5">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="container text-center mt-5 text-danger">
        Error: {error}
      </div>
    );

  return (
    <>
      <table className="table container table-striped table-hover shadow home">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Binance (%)</th>
            <th>Bybit (%)</th>
            <th>Bitget (%)</th>
          </tr>
        </thead>
        <tbody className="table-group-divider table-dark">
          {data.map((item, index) => (
            <tr key={item.symbol}>
              <td>{index + 1}</td>
              <td className="fw-bold">{item.symbol}</td>
              <td
                className={item.binance >= 0 ? "text-success" : "text-danger"}
              >
                {item.binance !== undefined ? item.binance.toFixed(4) : "-"}
              </td>
              <td className={item.bybit >= 0 ? "text-success" : "text-danger"}>
                {item.bybit !== undefined ? item.bybit.toFixed(4) : "-"}
              </td>
              <td className={item.bitget >= 0 ? "text-success" : "text-danger"}>
                {item.bitget !== undefined ? item.bitget.toFixed(4) : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
