import {
  View,
  Image,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styles } from "../styles/login_page";
import Logo from "../assets/images/logo.png";
import Women from "../assets/images/woman-writing.jpg";
import { Entypo } from "@expo/vector-icons";
import Custom_input from "../components/Custom_input";
import Custom_button from "../components/Custom_button";
import Btn_link from "../components/Btn_link";
import { wifi_Status } from "../hooks/wifiStatus";
import { Colors } from "../styles/styled";
import PostData from "../helpers/postData";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialUser = {
  ids: "",
  pass: "",
};

export default function Sign_in() {
  const { height } = useWindowDimensions();
  const [user, setUser] = useState(initialUser);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const navigation = useNavigation();
  const [token, setToken] = useState();
  const [name, setName] = useState();
  const [loading, setLoading] = useState(true);

  const post = () => {
    PostData("https://coopdgii.com/coopvirtual/App/login", user)
      .then((datos) => {
        if (datos.success) {
          Object.keys(datos).map(function (keys, index) {
            setName(datos?.data.nombre);
            setToken(datos?.data.token);
          });
        } else {
          Alert.alert("Error", "Usuario o clave incorrecta", [{ text: "OK" }]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    wifi_Status().then((res) => {
      setConnectionStatus(res);
    });
  });

  const handleChange = (name, text) => {
    setUser({
      ...user,
      [name]: text,
    });
  };

  function verifyData() {
    if (!connectionStatus) {
      ToastAndroid.show("No hay conexion a internet", ToastAndroid.LONG);
    } else if (!user.ids.trim() || !user.pass.trim()) {
      Alert.alert("Advertencia", "Complete los campos y intentelo de nuevo", [
        { text: "Ok" },
      ]);
    } else if (loading) {
      Alert.alert("Espere", "Cargando datos", [{ text: "Ok" }]);
      post();
    } else {
      getToken();
    }
  }
  const getToken = async () => {
    try {
      var userData = {
        Nombre: name,
        Tokem: token,
      };
      await AsyncStorage.setItem("token", JSON.stringify(userData));
      navigation.navigate({
        name: "Home",
        merge: true,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const openDrawer = () => {
    navigation.toggleDrawer();
  };

  const tokenSet = async () => {
    try {
      await AsyncStorage.getItem("token").then((value) => {
        if (value != null) {
          navigation.replace("Home");
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    tokenSet();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root_container}>
        <View style={{ position: "relative", width: "100%" }}>
          <Entypo
            name="menu"
            size={26}
            color={Colors.third}
            onPress={openDrawer}
          />
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
