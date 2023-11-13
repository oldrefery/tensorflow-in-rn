export type EEGDataPoint = [value: string, time: string];

export type EEGChannelData = EEGDataPoint[];

export interface EEGData {
  Fp1: EEGChannelData;
  Fp2: EEGChannelData;
  F5: EEGChannelData;
  AFZ: EEGChannelData;
  F6: EEGChannelData;
  T7: EEGChannelData;
  Cz: EEGChannelData;
  T8: EEGChannelData;
  P7: EEGChannelData;
  P3: EEGChannelData;
  PZ: EEGChannelData;
  P4: EEGChannelData;
  P8: EEGChannelData;
  O1: EEGChannelData;
  Oz: EEGChannelData;
  O2: EEGChannelData;
}

export const parseEEGData = (eegData: EEGData) => {
  const amplitudeData = [];
  const timeData = [];

  // Перебор всех каналов в данных EEG
  for (let channel in eegData) {
    const eegChannelData = eegData[channel] as unknown as EEGChannelData;
    eegChannelData.forEach((dataPoint) => {
      // Преобразование строковых значений в числа и добавление их в соответствующие массивы
      let [amplitude, time] = dataPoint.map((value) =>
        parseFloat(value.replace(",", "."))
      );
      amplitudeData.push(amplitude);
      timeData.push(time);
    });
  }

  return {
    amplitudeData,
    timeData,
  };
};

export const reshapeEEGData = (eegData: EEGData) => {
  let reshapedData = [];
  const totalChannels = 16;
  const channelLength = eegData.Fp1.length; // Assuming all channels have the same length.

  // For each data point in a channel...
  for (let i = 0; i < channelLength; i++) {
    let example = [];
    // ...grab the corresponding amplitude from each of the 16 channels.
    for (let channel in eegData) {
      // Convert the string amplitude value (e.g., "-229,74") to float.
      let amplitude = parseFloat(eegData[channel][i][0].replace(",", "."));
      example.push(amplitude);
    }
    reshapedData.push(example);
  }

  return reshapedData;
};
