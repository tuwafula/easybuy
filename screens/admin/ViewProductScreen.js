import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import ProductList from "../../components/ProductList/ProductList";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomInput from "../../components/CustomInput/";
import ProgressDialog from "react-native-progress-dialog";

const ViewProductScreen = ({ navigation, route }) => {
  const { authUser } = route.params;
  const [isloading, setIsloading] = useState(false);
  const [refeshing, setRefreshing] = useState(false);
  const [alertType, setAlertType] = useState("error");

  const [label, setLabel] = useState("Loading...");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [filterItem, setFilterItem] = useState("");

  var myHeaders = new Headers();
  myHeaders.append("x-auth-token", authUser.token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  var ProductListRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  //method call on pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchProduct();
    setRefreshing(false);
  };

  //method to delete the specific order
  const handleDelete = (id) => {
    setIsloading(true);
    fetch(`${network.serverip}api/products/${id}/`, {
      method: "DELETE",
      redirect: "follow",
    })
      .then((res) => {
        if (!res.ok) {
          setAlertType("error");
          setIsloading(false);
          throw new Error("Could not delete product, try again later");
        }
        fetchProduct();
        setAlertType("success");
      })

      .catch((error) => {
        setIsloading(false);
        setError(error.message);
        console.log("error", error);
      });
  };

  //method for alert
  const showConfirmDialog = (id) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete the category?",
      [
        {
          text: "Yes",
          onPress: () => {
            handleDelete(id);
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  //method the fetch the product data from server using API call

  const fetchProduct = async () => {
    setIsloading(true);
    try {
      const res = await fetch(
        `${network.serverip}api/products/`,
        ProductListRequestOptions
      );

      console.log(res);

      if (!res.ok) {
        throw new Error("There was an error");
      }

      const data = await res.json();

      setProducts(data);
      setFoundItems(data);

      setError("");
      setIsloading(false);
    } catch (error) {
      console.log("error", error.message);
      setError(error.message);
      console.log("error", error);
      setIsloading(false);
    }
  };

  // const fetchProduct = () => {
  //   setIsloading(true);
  //   fetch(`${network.serverip}api/products/`, ProductListRequestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       if (result) {
  //         console.log(result);
  //         setProducts(result.data);
  //         setFoundItems(result.data);
  //         setError("");
  //         setIsloading(false);
  //       } else {
  //         setError(result.message);
  //         setIsloading(false);
  //       }
  //     })
  //     .catch((error) => {
  //       setError(error.message);
  //       console.log("error", error);
  //       setIsloading(false);
  //     });
  // };

  //method to filer the orders for by title [search bar]
  const filter = () => {
    const keyword = filterItem;
    if (keyword !== "") {
      const results = products?.filter((product) => {
        return product?.name.toLowerCase().includes(keyword.toLowerCase());
      });
      setFoundItems(results);
    } else {
      setFoundItems(products);
    }
  };

  //filter the data whenever filteritem value change
  useEffect(() => {
    filter();
  }, [filterItem]);

  //fetch the categories on initial render
  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <View style={styles.container}>
      <ProgressDialog visible={isloading} label={label} />
      <StatusBar></StatusBar>
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("addproduct", { authUser: authUser });
          }}
        >
          <AntDesign name="plussquare" size={30} color={colors.muted} />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>View Product</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>View all products</Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      <CustomInput
        radius={5}
        placeholder={"Search..."}
        value={filterItem}
        setValue={setFilterItem}
      />
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refeshing} onRefresh={handleOnRefresh} />
        }
      >
        {foundItems && foundItems.length == 0 ? (
          <Text>{`No product found with the name of ${filterItem}!`}</Text>
        ) : (
          foundItems.map((product, index) => {
            return (
              <ProductList
                key={index}
                image={`https://res.cloudinary.com/dz9wzvgbd/${product.image}`}
                title={product?.name}
                category={product?.category?.name}
                price={product?.price}
                onPressView={() => {
                  console.log("view is working " + product.id);
                }}
                onPressEdit={() => {
                  navigation.navigate("editproduct", {
                    product: product,
                    authUser: authUser,
                  });
                }}
                onPressDelete={() => {
                  showConfirmDialog(product.id);
                }}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default ViewProductScreen;

const styles = StyleSheet.create({
  container: {
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formContainer: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    flexDirecion: "row",
    padding: 5,
  },

  buttomContainer: {
    width: "100%",
  },
  bottomContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 5,
    fontSize: 15,
  },
});
