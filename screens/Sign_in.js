import {
  View,
  Image,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { styles } from "../styles/login_page";
import Logo from "../assets/images/logo.png";
import Women from "../assets/images/woman-writing.jpg";
import { Entypo } from "@expo/vector-icons";
import Custom_input from "../components/Custom_input";
import Custom_button from "../components/Custom_button";
import Btn_link from "../components/Btn_link";

const initialUser = {
  ids: "",
  pass: "",
};

export default function Sign_in({ navigation }) {
  const { height } = useWindowDimensions();

  const [user, setUser] = useState(initialUser);

  const handleChange = (name, text) => {
    setUser({
      ...user,
      [name]: text,
    });
  };

  const openDrawer = () => {
    navigation.toggleDrawer();
  };

  function verifyData() {
    if (!user.ids.trim() || !user.pass.trim()) {
      Alert.alert("Adevertencia", "Complete los campos y intentelo de nuevo");
    } else {
      Alert.alert("Exito", "Completaste los campos", [{ text: "Ok" }]);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root_container}>
        <View style={{ position: "relative", width: "100%" }}>
          <Entypo name="menu" size={26} color="#239B56" onPress={openDrawer} />
        </View>
        <Image
          source={Logo}
          style={[styles.logo, { height: height * 0.2 }]}
          resizeMode="contain"
        />

        <Custom_input
          placeholder={"Cedula"}
          name="ids"
          iconName={"person-outline"}
          onChange={handleChange}
        />
        <Custom_input
          placeholder={"Constraseña"}
          name="pass"
          iconName={"key-outline"}
          onChange={handleChange}
          secure={true}
        />
        <Custom_button onPress={verifyData} />
        <Btn_link
          onPress={() => console.log("Pressed")}
          text={"¿Tiene Problemas para iniciar sesion?"}
        />
        <Image
          source={Women}
          style={[styles.footer_image, { height: height * 0.4 }]}
          resizeMode="contain"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}