import { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import Loading from "../components/Loading";

export default function FearGreed() {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const apiKey = "Your Api Key";
      try {
        const response = await fetch(
          "https://openapiv1.coinstats.app/insights/fear-and-greed",
          {
            headers: {
              "X-API-KEY": apiKey,
            },
          }
        );
        const data = await response.json();
        setData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching Fear & Greed data:", error);
      }
    }
    fetchData();
  }, []);

  const RADIAN = Math.PI / 180;

  const needle = ({ value, data, cx, cy, iR, oR, color }) => {
    const total = data.reduce((sum, entry) => sum + entry.value, 0);
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [
      <circle
        key="needle-circle"
        cx={x0}
        cy={y0}
        r={r}
        fill={color}
        stroke="none"
      />,
      <path
        key="needle-path"
        d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
        stroke="#none"
        fill={color}
      />,
    ];
  };

  if (!data)
    return (
      <div className="container text-center mt-5">
        <Loading />
      </div>
    );

  const chartData = [
    { name: "Extreme Fear", value: 20, color: "#ff0000" },
    { name: "Fear", value: 20, color: "#ffa500" },
    { name: "Nötr", value: 20, color: "#ffff00" },
    { name: "Greed", value: 20, color: "#a5ff00" },
    { name: "Extreme Greed", value: 20, color: "#00ff00" },
  ];

  const cx = 150;
  const cy = 200;
  const iR = 50;
  const oR = 100;
  const value = data.now.value;

  const getNeedleColor = (value) => {
    return "#ffffffff";
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center fear-greed">
      <div className="row w-100 justify-content-center align-items-center">
        <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-center">
          <div className="position-relative">
            <div
              className="position-relative"
              style={{ width: "300px", height: "300px" }}
            >
              <div
                className="position-absolute top-0 start-0 w-100 h-100 rounded-circle"
                style={{
                  background:
                    "radial-gradient(circle, rgba(30,30,30,0.9) 0%, rgba(15,15,15,0.95) 100%)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              ></div>

              <PieChart width={300} height={300}>
                <Pie
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  data={chartData}
                  cx={150}
                  cy={150}
                  innerRadius={80}
                  outerRadius={110}
                  fill="#8884d8"
                  stroke="none"
                  cornerRadius={10}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                {needle({
                  value,
                  data: chartData,
                  cx: 150,
                  cy: 150,
                  iR: 80,
                  oR: 110,
                  color: "#ffffff",
                })}

                <circle
                  cx={150}
                  cy={150}
                  r={60}
                  fill="rgba(255,255,255,0.05)"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />

                <text
                  x={150}
                  y={185}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: "42px",
                    fontWeight: "800",
                    fill: "#ffffff",
                    fontFamily: "'Inter', sans-serif",
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  {value}
                </text>

                <text
                  x={150}
                  y={230}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    fill: getNeedleColor(value),
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  {data.now.value_classification}
                </text>

                {[0, 25, 50, 75, 100].map((point, index) => {
                  const angle = 180 * (1 - point / 100);
                  const radian = ((angle - 180) * Math.PI) / 180;
                  const x1 = 150 + 120 * Math.cos(radian);
                  const y1 = 150 + 120 * Math.sin(radian);
                  const x2 = 150 + 130 * Math.cos(radian);
                  const y2 = 150 + 130 * Math.sin(radian);

                  return (
                    <g key={`scale-${index}`}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                      />
                      <text
                        x={150 + 145 * Math.cos(radian)}
                        y={150 + 145 * Math.sin(radian)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          fontSize: "10px",
                          fill: "rgba(255,255,255,0.6)",
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: "500",
                        }}
                      >
                        {point}
                      </text>
                    </g>
                  );
                })}
              </PieChart>

              <div
                className="position-absolute top-0 start-0 w-100 h-100 rounded-circle"
                style={{
                  boxShadow: `0 0 60px ${getNeedleColor(value)}30`,
                  pointerEvents: "none",
                }}
              ></div>
            </div>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle"
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#ff0000",
                  }}
                ></div>
                <span className="text-white-50 small">Fear</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle"
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#ffff00",
                  }}
                ></div>
                <span className="text-white-50 small">Neutral</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle"
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#00ff00",
                  }}
                ></div>
                <span className="text-white-50 small">Greed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-center sentiment">
          <div className="w-100 px-4">
            <h3
              className="text-white text-center mb-4 fw-light"
              style={{ letterSpacing: "2px" }}
            >
              MARKET SENTIMENT
            </h3>

            <div className="d-flex flex-column gap-3">
              <div className="modern-card p-4 position-relative overflow-hidden">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div
                      className="metric-label text-uppercase small fw-bold"
                      style={{
                        color: "#8b9cb3",
                        letterSpacing: "1px",
                        fontSize: "0.75rem",
                      }}
                    >
                      Yesterday
                    </div>
                    <div
                      className="metric-value fw-bold mt-1"
                      style={{
                        fontSize: "2rem",
                        color: getNeedleColor(data.yesterday.value),
                        textShadow: `0 0 20px ${getNeedleColor(
                          data.yesterday.value
                        )}40`,
                      }}
                    >
                      {data.yesterday.value}
                    </div>
                    <div
                      className="metric-classification mt-1 fw-semibold"
                      style={{
                        color: "#c8d3e0",
                        fontSize: "0.9rem",
                      }}
                    >
                      {data.yesterday.value_classification}
                    </div>
                  </div>
                  <div className="trend-indicator">
                    <div
                      className={`trend-badge ${
                        data.yesterday.value < data.now.value ? "up" : "down"
                      } rounded-pill px-3 py-1 small fw-bold`}
                    >
                      {data.yesterday.value < data.now.value ? "↗" : "↘"}
                      {Math.abs(data.now.value - data.yesterday.value)}
                    </div>
                  </div>
                </div>

                <div
                  className="progress-bar-bg mt-3 rounded-pill"
                  style={{
                    height: "4px",
                    background: "rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="progress-fill rounded-pill h-100"
                    style={{
                      width: `${data.yesterday.value}%`,
                      background: `linear-gradient(90deg, ${getNeedleColor(
                        data.yesterday.value
                      )}80, ${getNeedleColor(data.yesterday.value)})`,
                      boxShadow: `0 0 10px ${getNeedleColor(
                        data.yesterday.value
                      )}40`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="modern-card p-4 position-relative overflow-hidden">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div
                      className="metric-label text-uppercase small fw-bold"
                      style={{
                        color: "#8b9cb3",
                        letterSpacing: "1px",
                        fontSize: "0.75rem",
                      }}
                    >
                      Last Week
                    </div>
                    <div
                      className="metric-value fw-bold mt-1"
                      style={{
                        fontSize: "2rem",
                        color: getNeedleColor(data.lastWeek.value),
                        textShadow: `0 0 20px ${getNeedleColor(
                          data.lastWeek.value
                        )}40`,
                      }}
                    >
                      {data.lastWeek.value}
                    </div>
                    <div
                      className="metric-classification mt-1 fw-semibold"
                      style={{
                        color: "#c8d3e0",
                        fontSize: "0.9rem",
                      }}
                    >
                      {data.lastWeek.value_classification}
                    </div>
                  </div>
                  <div className="trend-indicator">
                    <div
                      className={`trend-badge ${
                        data.lastWeek.value < data.now.value ? "up" : "down"
                      } rounded-pill px-3 py-1 small fw-bold`}
                    >
                      {data.lastWeek.value < data.now.value ? "↗" : "↘"}
                      {Math.abs(data.now.value - data.lastWeek.value)}
                    </div>
                  </div>
                </div>

                <div
                  className="progress-bar-bg mt-3 rounded-pill"
                  style={{
                    height: "4px",
                    background: "rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="progress-fill rounded-pill h-100"
                    style={{
                      width: `${data.lastWeek.value}%`,
                      background: `linear-gradient(90deg, ${getNeedleColor(
                        data.lastWeek.value
                      )}80, ${getNeedleColor(data.lastWeek.value)})`,
                      boxShadow: `0 0 10px ${getNeedleColor(
                        data.lastWeek.value
                      )}40`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="modern-card p-4">
                <div
                  className="metric-label text-uppercase small fw-bold text-center"
                  style={{
                    color: "#8b9cb3",
                    letterSpacing: "1px",
                    fontSize: "0.75rem",
                  }}
                >
                  Last Updated
                </div>
                <div className="text-center mt-2">
                  <div
                    className="update-time fw-semibold"
                    style={{
                      fontSize: "1.1rem",
                      color: "#ffffff",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {new Date(data.now.update_time).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </div>
                  <div
                    className="update-date small mt-1"
                    style={{ color: "#8b9cb3" }}
                  >
                    {new Date(data.now.update_time).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
