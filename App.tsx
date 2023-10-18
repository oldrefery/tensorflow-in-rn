import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Image, View } from "react-native";
import { styles } from "./App.styles";
import { useState } from "react";
import { Button } from "./src/components/Button";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectImage = async () => {
    setIsLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (!result.canceled) {
        setSelectedImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={"transparent"} translucent />
      <Image
        source={{
          uri: selectedImageUri
            ? selectedImageUri
            : "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png",
        }}
        style={styles.image}
      />
      <View style={styles.resultContainer}></View>
      {isLoading ? (
        <ActivityIndicator color={"#5F1BBF"} />
      ) : (
        <Button title={"Select Image"} onPress={handleSelectImage} />
      )}
    </View>
  );
}
