import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Close({ width, height, fill, ...props }) {
  return (
    <Svg
      width={width ? width : 15}
      height={height ? height : 15}
      viewBox="0 0 15 15"
      fill="none"
      {...props}
    >
      <Path
        d="M3.64 3.64a.5.5 0 01.707 0L7.5 6.793l3.152-3.153a.5.5 0 11.707.707L8.207 7.5l3.152 3.152a.5.5 0 01-.707.707L7.5 8.207l-3.152 3.152a.5.5 0 01-.708-.707L6.793 7.5 3.64 4.347a.5.5 0 010-.707z"
        fill={fill ? fill : "#000"}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default Close;
