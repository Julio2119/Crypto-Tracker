import { useState } from "react";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc`
      );
      const data = await response.json();
      setData(data);
      console.log(data);
    }
    fetchData();
  }, []);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "N/A";

    if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  };

  return (
    <>
      <table className="table container table-striped table-hover shadow home">
        <thead className="table-dark">
          <tr>
            <th>Coin</th>
            <th>Price</th>
            <th>24h Change</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody className="table-group-divider table-dark">
          {data.map((coin) => (
            <tr key={coin.id}>
              <td className="coin-image">
                <img src={coin.image} alt={coin.name} width="20" /> {coin.name}
              </td>
              <td>{formatPrice(coin.current_price)}</td>
              <td
                style={{
                  color: coin.price_change_percentage_24h > 0 ? "green" : "red",
                }}
              >
                {coin.price_change_percentage_24h !== null
                  ? `${
                      coin.price_change_percentage_24h > 0 ? "+" : ""
                    }${coin.price_change_percentage_24h.toFixed(2)}%`
                  : "N/A"}
              </td>
              <td>${coin.market_cap?.toLocaleString() ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Home;
