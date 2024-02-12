import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CurrentRestEnum } from "../enums/CurrentRestEnum";

const CurrentRest = [
  CurrentRestEnum.POMO,
  CurrentRestEnum.SHORT,
  CurrentRestEnum.BREAK,
];

const Header = ({
  setTime,
  handleChangeCurrentTime,
  currentTime,
}: {
  setTime: Dispatch<SetStateAction<number>>;
  handleChangeCurrentTime: (value: CurrentRestEnum) => void;
  currentTime: CurrentRestEnum;
}) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {CurrentRest.map((item) => {
        return (
          <TouchableOpacity
            key={item}
            style={[
              styles.itemStyle,
              currentTime !== item && { borderColor: "transparent" },
            ]}
            onPress={() => {
              handleChangeCurrentTime(item);
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  itemStyle: {
    width: "33%",
    borderWidth: 3,
    padding: 5,
    borderColor: "#fff",
    marginVertical: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default Header;
