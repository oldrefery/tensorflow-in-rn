import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as tensorflow from "@tensorflow/tfjs";
import { asyncStorageIO } from "@tensorflow/tfjs-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "./src/components/Button";
import { styles } from "./App.styles";
import data01 from "./src/data/subject_01-15k-01.json";
import data11 from "./src/data/subject_01-15k-11.json";
import data12 from "./src/data/subject_01-15k-12.json";
import data13 from "./src/data/subject_01-15k-13.json";
import data14 from "./src/data/subject_01-15k-14.json";
import data15 from "./src/data/subject_01-15k-15.json";
import data16 from "./src/data/subject_01-15k-16.json";
import data17 from "./src/data/subject_01-15k-17.json";
import data18 from "./src/data/subject_01-15k-18.json";
import data19 from "./src/data/subject_01-15k-19.json";
import data20 from "./src/data/subject_01-15k-20.json";
import more07 from "./src/data/subject_02-15k-07.json";
import more08 from "./src/data/subject_02-15k-08.json";
import more09 from "./src/data/subject_02-15k-09.json";
import more10 from "./src/data/subject_02-15k-10.json";
import more11 from "./src/data/subject_02-15k-11.json";
import more12 from "./src/data/subject_02-15k-12.json";
import more13 from "./src/data/subject_02-15k-13.json";
import more14 from "./src/data/subject_02-15k-14.json";
import { Status } from "./src/constants/others";

type Model = tensorflow.Sequential | undefined;

export default function App() {
  const [status, setStatus] = useState<Status>(Status.BUSY);
  const [randomPercent, setRandomPercent] = useState<number>(5);

  let time: Date;

  useEffect(() => {
    const initTF = async () => {
      await tensorflow.ready();
      setStatus(Status.READY);
    };

    initTF()
      .then((d) => console.log("TensorFlow is initialized"))
      .catch((e) => console.log("Error is initialisation of TensorFlow:", e));
  }, []);

  function createModel(): tensorflow.Sequential {
    const model = tensorflow.sequential();

    model.add(
      tensorflow.layers.dense({
        inputShape: [16],
        units: 32,
        activation: "relu",
      })
    );
    model.add(tensorflow.layers.dense({ units: 16, activation: "relu" }));
    model.add(tensorflow.layers.dense({ units: 2, activation: "softmax" }));

    model.compile({
      optimizer: tensorflow.train.adam(),
      loss: "sparseCategoricalCrossentropy",
      metrics: ["accuracy"],
    });

    return model;
  }

  async function trainModel(
    model: tensorflow.Sequential,
    data: number[][],
    labels: number[]
  ): Promise<tensorflow.History> {
    const xs = tensorflow.tensor2d(data);
    const ys = tensorflow.tensor1d(labels, "int32").asType("float32");

    const history = await model.fit(xs, ys, {
      epochs: 10,
      shuffle: true,
      validationSplit: 0.1,
    });

    return history;
  }

  function evaluateModel(
    model: tensorflow.Sequential,
    testData: number[][],
    testLabels: number[]
  ): void {
    const xs = tensorflow.tensor2d(testData);
    const ys = tensorflow.tensor1d(testLabels, "int32").asType("float32");

    const evaluation = model.evaluate(xs, ys) as tensorflow.Tensor[];
    const loss = evaluation[0].dataSync()[0];
    const accuracy = evaluation[1].dataSync()[0];

    console.log(`Test Loss: ${loss}`);
    console.log(`Test Accuracy: ${accuracy}`);
  }

  function predict(model: Model, sampleData: number[][]): tensorflow.Tensor {
    const predictions = model?.predict(
      tensorflow.tensor2d(sampleData)
    ) as tensorflow.Tensor;
    console.log("predictions", predictions);

    return predictions;
  }

  async function saveModel(model: tensorflow.LayersModel) {
    const saveResult = await model.save(asyncStorageIO("eegModel"));
    console.log("Model saved:", saveResult);
  }

  async function loadModel() {
    const model = await tensorflow.loadLayersModel(asyncStorageIO("eegModel"));

    return model;
  }

  const handleTrainModel = async () => {
    setStatus(Status.BUSY);

    const initTime = new Date().getTime();
    console.log("run handleTrainModel");
    let finishTime: number;
    let duration: number;

    await tensorflow.ready();

    const model = createModel();

    const reshapedData: number[][] = [
      // ...data01,
      // ...data02,
      // ...data03,
      // ...data04,
      // ...data05,
      // ...data06,
      // ...data07,
      // ...data08,
      // ...data09,
      // ...data10,
      ...data11,
      ...data12,
      ...data13,
      ...data14,
      ...data15,
      ...data16,
      ...data17,
      ...data18,
      ...data19,
      ...data20,
    ];
    const labels: number[] = Array(reshapedData.length).fill(11);
    console.log("Start training model with:", reshapedData.length, "records");
    await trainModel(model, reshapedData, labels);
    finishTime = new Date().getTime();
    duration = (finishTime - initTime) / 1000;
    console.log("Model was trained:", duration);

    const testReshapedData: number[][] = data01;
    const testLabels: number[] = Array(testReshapedData.length).fill(11);

    evaluateModel(model, testReshapedData, testLabels);
    finishTime = new Date().getTime();
    duration = (finishTime - initTime) / 1000;
    console.log("Model was trained and evaluated:", duration);

    if (
      Array.isArray(testReshapedData) &&
      testReshapedData.length > 0 &&
      Array.isArray(testReshapedData[0])
    ) {
      const predictions = predict(model, testReshapedData);
      predictions.print();

      const predictedClasses = tensorflow.argMax(predictions, 1);
      predictedClasses.print();
    } else {
      console.error("Sample data is not in the correct format.");
    }

    finishTime = new Date().getTime();
    duration = (finishTime - initTime) / 1000;
    console.log("All processes take:", duration, "sec.");
    console.log(reshapedData.length);
    await saveModel(model);
    const modelJSON = await AsyncStorage.getItem(
      "tensorflowjs_models/eegModel/model.json"
    );
    const modelSize = modelJSON ? new Blob([modelJSON]).size : 0;
    console.log("Model size:", modelSize);
    console.log("modelJSON\n", JSON.stringify(modelSize));

    setStatus(Status.READY);
  };

  const handleTrainMoreModel = async () => {
    setStatus(Status.BUSY);
    const initTime = new Date().getTime();
    let finishTime: number;
    let duration: number;

    const model = await loadModel();
    model.compile({
      optimizer: tensorflow.train.adam(),
      loss: "sparseCategoricalCrossentropy",
      metrics: ["accuracy"],
    });

    const newReshapedData: number[][] = [
      // ...more01,
      // ...more02,
      // ...more03,
      // ...more04,
      // ...more05,
      // ...more06,
      ...more07,
      ...more08,
      ...more09,
      ...more10,
      ...more11,
      ...more12,
      ...more13,
      ...more14,
    ];
    const newLabels: number[] = Array(newReshapedData.length).fill(77);
    console.log("Start training with extra", newReshapedData.length, "records");

    await trainModel(model, newReshapedData, newLabels);
    finishTime = new Date().getTime();
    duration = (finishTime - initTime) / 1000;
    console.log("Model was trained with more records:", duration);

    await saveModel(model);
    const modelJSON = await AsyncStorage.getItem(
      "tensorflowjs_models/eegModel/model.json"
    );
    const modelSize = modelJSON ? new Blob([modelJSON]).size : 0;
    console.log("Model size:", modelSize);
    setStatus(Status.READY);
  };

  const handlePredict = async () => {
    setStatus(Status.BUSY);
    const initTime = new Date().getTime();
    let finishTime: number;
    let duration: number;

    const model = await loadModel();
    model.compile({
      optimizer: tensorflow.train.adam(),
      loss: "sparseCategoricalCrossentropy",
      metrics: ["accuracy"],
    });

    const slice = more07.slice();
    const sliceLength = slice.length;
    const startIndex = Math.floor(sliceLength / 4);
    const finishIndex = Math.ceil((sliceLength / 4) * 3);

    const predictData = slice.slice(startIndex, finishIndex);

    const predictions = model.predict(tensorflow.tensor2d(predictData));
    // const predictions = model.predict(tensorflow.tensor2d(more02));
    const predictedClasses = tensorflow.argMax(predictions, 1);
    predictedClasses.print();

    finishTime = new Date().getTime();
    duration = (finishTime - initTime) / 1000;
    console.log("Prediction complete:", duration);

    const uniqueValues = tensorflow.unique(predictedClasses).values;
    uniqueValues.print();
    finishTime = new Date().getTime();
    duration = (finishTime - initTime) / 1000;
    console.log("Uniq selecting complete. All time:", duration);
    setStatus(Status.READY);
  };

  const handlePredictDistortion = async () => {
    setStatus(Status.BUSY);
    const initTime = new Date().getTime();
    let finishTime: number;
    let duration: number;

    const model = await loadModel();
    model.compile({
      optimizer: tensorflow.train.adam(),
      loss: "sparseCategoricalCrossentropy",
      metrics: ["accuracy"],
    });

    const slice = data13.slice();

    const predictData = slice.map((point) =>
      point.map((value) => value * (1 + Math.random() / (100 / randomPercent)))
    );

    console.log("classCounts start");
    const predictions = model.predict(tensorflow.tensor2d(predictData));
    const predictedClasses = tensorflow.argMax(predictions, 1);

    const maxSize = (await predictedClasses.max().data())[0] + 1;
    const weights = tensorflow.onesLike(predictedClasses);
    const classCounts = tensorflow.bincount(predictedClasses, weights, maxSize);
    classCounts.print();

    finishTime = new Date().getTime();
    duration = (finishTime - initTime) / 1000;
    console.log("classCounts complete. All time:", duration);
    setStatus(Status.READY);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={"transparent"} translucent />
      <Button
        title={"Create and Train"}
        onPress={handleTrainModel}
        status={status}
      />
      <Button
        title={"Load and Train more"}
        onPress={handleTrainMoreModel}
        status={status}
      />
      <Button title={"Predict"} onPress={handlePredict} status={status} />
      <TextInput
        value={String(randomPercent)}
        onChangeText={(text) => setRandomPercent(Number(text))}
        style={{
          height: 56,
          color: "white",
          paddingHorizontal: 20,
          borderColor: "grey",
          borderWidth: 1,
        }}
      />
      <Button
        title={"Predict of data with distortion"}
        onPress={handlePredictDistortion}
        status={status}
      />
    </View>
  );
}
