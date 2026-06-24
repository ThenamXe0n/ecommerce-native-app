import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
};

const products: Product[] = [
    {
        id: "1",
        name: "Running Shoes",
        price: 2999,
        image:
            "https://image.shutterstock.com/image-photo/white-sneakers-on-white-background-260nw-2527660141.jpg",
    },
    {
        id: "2",
        name: "Leather Backpack",
        price: 1999,
        image:
            "https://image.shutterstock.com/image-photo/stylish-leather-backpack-isolated-on-260nw-2460524125.jpg",
    },
    {
        id: "3",
        name: "Smart Watch",
        price: 4999,
        image:
            "https://image.shutterstock.com/image-photo/smart-watch-isolated-on-white-260nw-2470304229.jpg",
    },
    {
        id: "4",
        name: "Wireless Headphones",
        price: 3499,
        image:
            "https://image.shutterstock.com/image-photo/modern-wireless-headphones-isolated-on-260nw-2448326127.jpg",
    },
];

export default function HomeScreen() {
    const router = useRouter()
    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />

            <View style={styles.productContent}>
                <Text numberOfLines={1} style={styles.productName}>
                    {item.name}
                </Text>

                <Text style={styles.productPrice}>₹{item.price}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}

                <View style={styles.header}>
                    <Text style={styles.logo}>ShopEase</Text>
                </View>

                {/* Search */}

                <View style={styles.searchContainer}>
                    <Ionicons name="search-circle" size={20} color="#777" />
                    <TextInput
                        placeholder="Search products..."
                        style={styles.searchInput}
                        underlineColorAndroid="transparent"

                    />
                </View>

                {/* Banner */}

                <View style={styles.banner}>
                    <View>
                        <Text style={styles.bannerSubtitle}>Summer Sale</Text>
                        <Text style={styles.bannerTitle}>Up to 50% OFF</Text>
                        <Text style={styles.bannerText}>
                            Discover the latest trends
                        </Text>
                    </View>
                </View>

                {/* Categories */}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categories}
                >
                    {["Shoes", "Bags", "Watches", "Electronics", "Fashion"].map(
                        (item) => (
                            <TouchableOpacity onPress={()=>router.push({
                                pathname:"/returns",
                                params:{
                                    category:item
                                }
                            })} key={item} style={styles.categoryChip}>
                                <Text style={styles.categoryText}>{item}</Text>
                            </TouchableOpacity>
                        )
                    )}
                </ScrollView>

                {/* Products */}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Popular Products</Text>
                </View>

                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    renderItem={renderProduct}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
    },

    header: {
        marginTop: 10,
        marginBottom: 20,
    },

    logo: {
        fontSize: 28,
        fontWeight: "700",
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 20,
    },

    searchInput: {
        flex: 1,
        height: 50,
        marginLeft: 10,
        borderWidth: 0,
        outlineWidth: 0,
    },

    banner: {
        backgroundColor: "#111",
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
    },

    bannerSubtitle: {
        color: "#ccc",
        marginBottom: 8,
    },

    bannerTitle: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "700",
    },

    bannerText: {
        color: "#ddd",
        marginTop: 8,
    },

    sectionHeader: {
        marginBottom: 14,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
    },

    categories: {
        paddingBottom: 20,
    },

    categoryChip: {
        backgroundColor: "#f3f3f3",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 50,
        marginRight: 10,
    },

    categoryText: {
        fontWeight: "500",
    },

    productCard: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#f0f0f0",
    },

    productImage: {
        width: "100%",
        height: 180,
        resizeMode: "cover",
    },

    productContent: {
        padding: 12,
    },

    productName: {
        fontSize: 15,
        fontWeight: "500",
    },

    productPrice: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 8,
    },
});