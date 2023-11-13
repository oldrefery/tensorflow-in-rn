import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  resultContainer: {
    flex: 1,
    gap: 10,
    marginTop: 30,
  },
  status: {
    color: "white",
    fontSize: 24,
  },
});
