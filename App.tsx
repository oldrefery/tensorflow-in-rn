import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Image, View } from "react-native";
import { styles } from "./App.styles";
import { useState } from "react";
import { Button } from "./src/components/Button";
import * as ImagePicker from "expo-image-picker";
import * as tensorflow from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as FileSystem from "expo-file-system";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import {
  Classification,
  ClassificationProps,
} from "./src/components/Classification";

export default function App() {
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ClassificationProps[]>([]);

  const handleSelectImage = async () => {
    setIsLoading(true);
    setResults([]);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        setSelectedImageUri(uri);
        await imageClassification(uri);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setIsLoading(false);
    }
  };

  const imageClassification = async (imageUri: string) => {
    await tensorflow.ready();
    const model = await mobilenet.load();

    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const imgBuffer = tensorflow.util.encodeString(
      imageBase64,
      "base64"
    ).buffer;
    const raw = new Uint8Array(imgBuffer);
    const imageTensor = decodeJpeg(raw);
    const classificationResult = await model.classify(imageTensor);
    setResults(classificationResult);
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
      <View style={styles.resultContainer}>
        {results.map((result) => (
          <Classification data={result} key={result.className} />
        ))}
      </View>
      {isLoading ? (
        <ActivityIndicator color={"#5F1BBF"} />
      ) : (
        <Button title={"Select Image"} onPress={handleSelectImage} />
      )}
    </View>
  );
}
