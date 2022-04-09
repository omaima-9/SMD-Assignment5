import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";

import { openDatabase, SQLResultSet, SQLTransaction } from "expo-sqlite";
let db = openDatabase("db.todos"); // returns Database object

export default TaskItem = (id) => {
  const [forceUpdate, onforceUpdate] = React.useState(0);
  const [items, setTask] = React.useState([]);
  const [temp, setTemp] = React.useState([]);

  const [task, setItem] = React.useState("");

  const updateItem = async (id) => {
    db.transaction(async (txn) => {
      txn.executeSql(
        "UPDATE todoL  SET Done  = CASE Done WHEN 0 THEN 1 ELSE 0 END where id = ?",
        [id],
        (_, { rows }) => {
          getTODO();

          console.log("id", id);
        }
      );

      txn.executeSql("select * from todoL where id=?", [id], (_, { rows }) => {
        console.log("Update", JSON.stringify(rows));
        getTODO();
        onforceUpdate(23);
      });
    });
  };
  const deleteTask = async (id) => {
    db.transaction(async (tx) => {
      tx.executeSql("DELETE FROM todoL where id= ?", [id], (_, { rows }) => {
        getTODO();
        console.log("deleted", id);
      });
      tx.executeSql("select * from todoL", [], (_, { rows }) => {
        getTODO();
        onforceUpdate(65);
      });
    });
  };

  const getTODO = () => {
    db.transaction((txn) => {
      txn.executeSql("select * from todoL", [], (_, { rows }) => {
        console.log("Tasks retrieved successfully");
        setTemp(rows._array);
      });
    });
  };
  const getTODObyID = (id) => {
    db.transaction((txn) => {
      txn.executeSql(
        "select * from todoL where id= ? ",
        [id.index],
        (_, { rows }) => {
          console.log("Tasks retrieved successfully");
          console.log("id.index", id.index);
          setItem(rows._array[0]);
          console.log(task);

          onforceUpdate(9);
        }
      );
    });
  };
  useEffect(() => {
    getTODObyID(id);
  }, [forceUpdate]);
  if (task) {
    return (
      <View style={styles.container}>
        <View style={styles.indexContainer}>
          <Text style={styles.index}>{id.task}</Text>
        </View>
        <View style={styles.taskContainer}>
          <Text
            style={(task.Done === 0) ? styles.task : styles.checked}
          >
            {task.Name}
          </Text>
          <TouchableOpacity onPress={() => deleteTask(task.id)}>
            <MaterialIcons
              style={styles.delete}
              name="delete"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateItem(task.id)}>
            {console.log(task.Done)}
            <MaterialIcons
              style={styles.check}
              name={task.Done==0?"check-box-outline-blank":"check-box" }
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return <View>
    </View>;
  }
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 20,
  },
  indexContainer: {
    borderColor: "#fff",
    backgroundColor: "#37474F",
    borderWidth: 1,
    borderRadius: 12,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  index: {
    color: "#fff",
    fontSize: 20,
  },
  taskContainer: {
    borderColor: "#fff",
    backgroundColor: "#37474F",
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minHeight: 50,
  },
  task: {
    color: "#fff",
    fontSize: 16,
    width:"70%"
  },
  delete: {
    marginLeft: 20,
  },
  check: {
    marginLeft: 10,
  },
  checked: {
    textDecorationLine: "line-through",
    color: "#A4A4A4",
    width:"70%"
  },
});
