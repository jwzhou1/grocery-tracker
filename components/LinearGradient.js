import { LinearGradient } from "expo-linear-gradient";
import StyleHelper from "../styles/StylesHelper";

export default function LinearGradientComp({ children }) {
  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#edfaf8", "#e1f7f4", "#edfaf8"]}
      style={StyleHelper.linearGradient}
    >
      {children}
    </LinearGradient>
  );
}