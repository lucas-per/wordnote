import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Copy({ width, height, fill, ...props }) {
  return (
    <Svg
      width={width ? width : 15}
      height={height ? height : 15}
      viewBox="0 0 15 15"
      fill="none"
      {...props}
    >
      <Path
        d="M5.5 2A1.5 1.5 0 004 3.5v7A1.5 1.5 0 005.5 12h5A1.5 1.5 0 0012 10.5v-7A1.5 1.5 0 0010.5 2h-5zM5 3.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-5a.5.5 0 01-.5-.5v-7zM2.5 5a.5.5 0 00-.5.5v7A1.5 1.5 0 003.5 14h5a.5.5 0 000-1h-5a.5.5 0 01-.5-.5v-7a.5.5 0 00-.5-.5z"
        fill={fill ? fill : "#000"}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default Copy;
