import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import OptionList from "../../components/OptionList/OptionList";
import { network } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyAccountScreen = ({ navigation, route }) => {
  const [showBox, setShowBox] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState("");
  // const { user } = route.params;
  // const userID = user["id"];

  useEffect(() => {
    (async function () {
      const value = await AsyncStorage.getItem("authUser"); // get authUser from async storage
      token = JSON.parse(value);
      console.log("VALUE", value);

      if (value) {
        try {
          const res = await fetch(`${network.serverip}auth/get-user/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("RESPONSE", res);

          if (!res.ok) {
            throw new Error("Could not get user");
          }

          const data = await res.json();
          setUser(data);
          // console.log("USERID", data.id);
        } catch (error) {
          console.log("error", error.message);
        }
      }
    })();
  }, []);

  console.log("USERID", user);

  //method for alert
  const showConfirmDialog = (id) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove your account?",
      [
        {
          text: "Yes",
          onPress: () => {
            setShowBox(false);
            DeleteAccontHandle(id);
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  //method to delete the account using API call
  const DeleteAccontHandle = (userID) => {
    let fetchURL = network.serverip + "/delete-user?id=" + String(userID);
    console.log(fetchURL);
    fetch(fetchURL, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success == true) {
          console.log(result.data);
          navigation.navigate("login");
        } else {
          setError(result.message);
        }
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto"></StatusBar>
      <View style={styles.TopBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>My Account</Text>
      </View>
      <View style={styles.UserProfileCardContianer}>
        <UserProfileCard
          Icon={Ionicons}
          name={user["name"]}
          email={user["email"]}
        />
      </View>
      <View style={styles.OptionsContainer}>
        <OptionList
          text={"Change Password"}
          Icon={Ionicons}
          iconName={"key-sharp"}
          onPress={
            () =>
              navigation.navigate("updatepassword", {
                userID: user.id,
              }) // navigate to updatepassword
          }
        />
        <OptionList
          text={"Delete My Account"}
          Icon={MaterialIcons}
          iconName={"delete"}
          type={"danger"}
          onPress={() => showConfirmDialog(userID)}
        />
      </View>
    </View>
  );
};

export default MyAccountScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  UserProfileCardContianer: {
    width: "100%",
    height: "25%",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  OptionsContainer: {
    width: "100%",
  },
});
