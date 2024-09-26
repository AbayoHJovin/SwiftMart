import { useContext } from "react";
import { ThemeContext } from "../../constants/ThemeContext";

const Loader3 = () => {
  const { theme } = useContext(ThemeContext);

  const fillColor = theme === "light" ? "#000000" : "#ffffff";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width="50"
      height="50"
      style={{
        shapeRendering: "auto",
        display: "block",
      }}
    >
      <g>
        {[0, 51.43, 102.86, 154.29, 205.71, 257.14, 308.57].map((rotate, index) => (
          <g key={index} transform={`rotate(${rotate} 50 50)`}>
            <rect
              fill={fillColor} // Dynamically set the fill color
              height="15"
              width="10"
              ry="7.5"
              rx="5"
              y="30"
              x="45"
            >
              <animate
                repeatCount="indefinite"
                begin={`-${index * 0.137}s`}
                dur="0.9615384615384615s"
                keyTimes="0;1"
                values="1;0"
                attributeName="opacity"
              />
            </rect>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default Loader3;
