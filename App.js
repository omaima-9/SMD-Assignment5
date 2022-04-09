import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TaskItem from "./components/TaskItem";
import { MaterialIcons } from "@expo/vector-icons";
import { openDatabase, SQLResultSet, SQLTransaction } from "expo-sqlite";
let db = openDatabase("db.todos"); // returns Database object

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [txt, setTxt] = useState("");

  const [forceUpdate, onforceUpdate] = React.useState("");
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists todoL (id integer primary key AUTOINCREMENT not null, Name text, Done int);"
      );
    });

    getTODO();
  }, []);

  const addTask = async (value) => {
    if (!value || value === " ") {
      alert("You Can't Enter Empry Task");

      return false;
    }

    db.transaction(async (tx) => {
      tx.executeSql(
        "INSERT INTO todoL (Name, Done) VALUES (?,0)",
        [value],
        (_, { rows }) => {
          getTODO();
          setTxt(" ");
        }
      );
      tx.executeSql("select * from todoL", [], (_, { rows }) => {
        console.log(JSON.stringify(rows));
        getTODO();
        onforceUpdate();
      });
    });
  };

  const update = () => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM todoL where id= ?", [id], (_, { rows }) => {
        getTODO();
      });
      tx.executeSql("select * from todoL", [], (_, { rows }) => {
        getTODO();
      });
    });
  };

  const getTODO = () => {
    db.transaction((txn) => {
      txn.executeSql("select * from todoL", [], (_, { rows }) => {
        console.log("Tasks retrieved successfully");
        setTasks(rows._array);
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>TODO LIST</Text>
      <ScrollView style={styles.scrollView}>
        {tasks.map((task, index) => {
          return (
            <View key={task.id} style={styles.taskContainer}>
              <TaskItem index={task.id} task={index + 1} />
            </View>
          );
        })}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containerinput}
      >
        <TextInput
          style={styles.inputField}
          value={txt}
          onChangeText={setTxt}
          placeholder={"Write a task"}
          placeholderTextColor={"#fff"}
        />
        <TouchableOpacity
          onPress={() => {
            addTask(txt);
            onforceUpdate();
          }}
        >
          <View style={styles.button}>
            <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#263238",
  },
  heading: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "600",
    marginTop: 70,
    marginBottom: 10,
    marginLeft: 20,
  },
  scrollView: {
    marginBottom: 30,
  },
  taskContainer: {
    marginTop: 40,
  },
  checked: {
    textDecorationLine: "line-through",
  },
  containerinput: {
    borderColor: "#fff",
    backgroundColor: "#37474F",
    borderWidth: 1,
    marginHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 40,
  },
  inputField: {
    color: "#fff",
    height: 50,
    flex: 1,
  },
  button: {
    height: 30,
    width: 30,
    borderRadius: 5,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
