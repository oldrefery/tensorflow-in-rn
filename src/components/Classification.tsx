import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#292728",
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
  },
  probability: {
    color: "white",
    fontSize: 18,
    backgroundColor: "#621AC1",
    padding: 10,
  },
  className: {
    color: "white",
    fontSize: 18,
    padding: 10,
  },
});

export type ClassificationProps = {
  className: string;
  probability: number;
};

interface IClassification {
  data: ClassificationProps;
}

export const Classification = ({ data }: IClassification) => {
  return (
    <View style={styles.container}>
      <Text style={styles.probability}>{data.probability.toFixed(4)}</Text>
      <Text style={styles.className}>{data.className}</Text>
    </View>
  );
};
