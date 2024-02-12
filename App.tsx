import { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "./src/components/Header";
import { CurrentRestEnum } from "./src/enums/CurrentRestEnum";
import Timer from "./src/components/Timer";
import { Audio } from "expo-av";
import { StatusBar } from "expo-status-bar";

const colors = ["#F7DC6F", "#A2D9CE", "#D7BDE2"];

export default function App() {
  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState<CurrentRestEnum>(
    CurrentRestEnum.POMO
  );
  const [isActive, setIsActive] = useState(false);

  const handleChangeCurrentTime = (value: CurrentRestEnum) => {
    let newTime: number;
    if (value === CurrentRestEnum.POMO) {
      newTime = 25;
    } else if (value === CurrentRestEnum.BREAK) {
      newTime = 15;
    } else {
      newTime = 5;
    }
    setTime(newTime * 60);
    setCurrentTime(value);
    console.log(value);
  };

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined = undefined;

    if (isActive) {
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (time === 0) {
      handleRestart();
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const handleStartStop = () => {
    playSound();
    setIsActive(!isActive);
  };

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("./assets/click.mp3")
      );

      await sound.playAsync();

      await sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error al reproducir el sonido:", error);
    }
  };

  const handleRestart = () => {
    setIsActive(false);
    setIsWorking((prev) => !prev);
    setTime(
      currentTime == CurrentRestEnum.POMO
        ? 1500
        : currentTime == CurrentRestEnum.SHORT
        ? 300
        : 900
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colors[
              currentTime == CurrentRestEnum.POMO
                ? 0
                : currentTime == CurrentRestEnum.SHORT
                ? 1
                : 2
            ],
        },
      ]}
    >
      <StatusBar style="auto" />
      <View style={styles.view}>
        <Text style={styles.text}>Pomodoro</Text>
        <Header
          setTime={setTime}
          handleChangeCurrentTime={handleChangeCurrentTime}
          currentTime={currentTime}
        />

        <Timer time={time} />
        <TouchableOpacity style={styles.button} onPress={handleStartStop}>
          <Text style={styles.titleButton}>{isActive ? "STOP" : "START"}</Text>
        </TouchableOpacity>
        {time !== 1500 && time !== 900 && time !== 300 && (
          <TouchableOpacity style={styles.button} onPress={handleRestart}>
            <Text style={styles.titleButton}>RESTART</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  text: { fontSize: 32, fontWeight: "bold", textAlign: "center" },
  view: {
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "android" ? 30 : 0,
    flex: 1,
  },
  titleButton: {
    color: "#fff",
    fontWeight: "bold",
    alignContent: "center",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#333333",
    padding: 15,
    marginTop: 15,
    borderRadius: 15,
    alignContent: "center",
    textAlign: "center",
  },
});
