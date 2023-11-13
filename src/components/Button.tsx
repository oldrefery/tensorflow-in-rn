import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Status } from "../constants/others";

type ButtonProps = TouchableOpacityProps & {
  title: string;
  status?: Status;
};
export const Button = ({
  title,
  status = Status.READY,
  ...rest
}: ButtonProps) => {
  const isDisabled = status === Status.BUSY;
  return (
    <TouchableOpacity
      {...rest}
      disabled={isDisabled}
      style={
        isDisabled
          ? [styles.container, { backgroundColor: "grey" }]
          : styles.container
      }
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    width: "100%",
    backgroundColor: "#5F1BBF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    color: "#FFF",
  },
});
