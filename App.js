import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import uuid from "react-native-uuid";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Vibration,
} from "react-native";
import { getValueFor, save } from "./helpers/secureStore";

const Item = ({ title, id, removeTask, isEdit, handleChange }) => {
  return (
    <TouchableOpacity onLongPress={handleChange}>
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
        {isEdit ? (
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "#ed6484", margin: 0 }}
            onPress={() => removeTask(id)}
          >
            <Text style={styles.text}>X</Text>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function App() {
  const [text, onChangeText] = useState("");
  const [list, addList] = useState([]);
  const [isEdit, setEdit] = useState(false);

  const renderItem = ({ item }) => (
    <Item
      title={item.title}
      id={item.id}
      removeTask={removeTask}
      handleChange={handleChange}
      isEdit={isEdit}
    />
  );

  const addTask = () => {
    if (!text) {
      Alert.alert("Empty input", "Type text of todo");
      return;
    }

    const task = {
      id: uuid.v4(),
      title: text,
    };

    setEdit(false);

    addList([...list, task]);
    save("list", JSON.stringify([...list, task]));
    onChangeText("");
  };

  const removeTask = (id) => {
    const updatedList = list.filter((item) => item.id !== id);
    addList(updatedList);
    save("list", JSON.stringify(updatedList));
  };

  const handleChange = () => {
    // Alert.alert("Empty input", "Type text of todo");
    Vibration.vibrate();
    setEdit(!isEdit);
  };

  useEffect(() => {
    getValueFor("list").then(
      (data) => data.length > 0 && addList(JSON.parse(data))
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="New todo"
        />
        <TouchableOpacity style={styles.button} onPress={addTask}>
          <Text>Add Todo</Text>
        </TouchableOpacity>
      </View>
      {list?.length > 0 ? (
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.emptyText}>No task</Text>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3e3e3",
    alignItems: "stretch",
    justifyContent: "flex-start",
    paddingVertical: 50,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    flex: 1,
    borderRadius: 8,
  },
  button: {
    justifyContent: "center",
    backgroundColor: "#7ad6f0",
    margin: 12,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontWeight: 900,
  },
  item: {
    backgroundColor: "white",
    padding: 15,
    paddingVertical: 15,
    marginVertical: 8,
    marginHorizontal: 14,
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    color: "#3d3d3d",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { fontWeight: "bold", color: "white" },
  emptyText: {
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 30,
  },
});
