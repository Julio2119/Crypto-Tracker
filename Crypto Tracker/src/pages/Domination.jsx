import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export default function Domination() {
  const [globalData, setGlobalData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://api.coingecko.com/api/v3/global");
      const result = await response.json();
      setGlobalData(result.data);
      console.log(result.data);
    }
    fetchData();
  }, []);

  if (!globalData)
    return (
      <div className="text-center mt-5">
        <Loading />
      </div>
    );

  const chartData = [
    {
      name: "Bitcoin",
      value: parseFloat(globalData.market_cap_percentage.btc.toFixed(2)),
    },
    {
      name: "Ethereum",
      value: parseFloat(globalData.market_cap_percentage.eth.toFixed(2)),
    },
    {
      name: "Others",
      value: parseFloat(
        (
          100 -
          globalData.market_cap_percentage.btc -
          globalData.market_cap_percentage.eth
        ).toFixed(2)
      ),
    },
  ];

  const COLORS = ["#F7931A", "#627EEA", "#8B5CF6"];

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <h5 className="card-title text-center mb-4">Market Dominance</h5>
              <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <table className="table table-dark table-striped table-hover shadow h-100">
            <thead>
              <tr>
                <th>Dominance Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span style={{ color: COLORS[0], fontWeight: "bold" }}>
                    ●
                  </span>{" "}
                  Bitcoin Dominance:{" "}
                  <strong>
                    {globalData.market_cap_percentage.btc.toFixed(2)}%
                  </strong>
                </td>
              </tr>
              <tr>
                <td>
                  <span style={{ color: COLORS[1], fontWeight: "bold" }}>
                    ●
                  </span>{" "}
                  Ethereum Dominance:{" "}
                  <strong>
                    {globalData.market_cap_percentage.eth.toFixed(2)}%
                  </strong>
                </td>
              </tr>
              <tr>
                <td>
                  <span style={{ color: COLORS[2], fontWeight: "bold" }}>
                    ●
                  </span>{" "}
                  Other Cryptos Dominance:{" "}
                  <strong>
                    {(
                      100 -
                      globalData.market_cap_percentage.btc -
                      globalData.market_cap_percentage.eth
                    ).toFixed(2)}
                    %
                  </strong>
                </td>
              </tr>
              <tr>
                <td>
                  Total Market Cap:{" "}
                  <strong>
                    ${globalData.total_market_cap.usd.toLocaleString()}
                  </strong>
                </td>
              </tr>
              <tr>
                <td>
                  24h Volume:{" "}
                  <strong>
                    ${globalData.total_volume.usd.toLocaleString()}
                  </strong>
                </td>
              </tr>
              <tr>
                <td>
                  Active Cryptocurrencies:{" "}
                  <strong>
                    {globalData.active_cryptocurrencies.toLocaleString()}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
