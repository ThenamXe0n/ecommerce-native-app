import { View, Text ,FlatList, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { api } from '@/api/axios';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

const returns = () => {
    const { category } = useLocalSearchParams();
    const [product, setProducts] = useState([])

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

    useEffect(() => {
        async function fetchFilteredProducts() {
            let res = await api.get(`/product?category=${category}`)
            if (res?.data?.success) {
                setProducts(res?.data?.data)
            }
        }
        fetchFilteredProducts()
    }, [category])
    console.log(product)

    return (
        <View style={{ flex: 1 }}>
            <Text>returns</Text>
            <View style={{ "backgroundColor": "black", "margin": 8 }}>
                <Text style={{ "color": "white", "textAlign": "center", "padding": 6 }}>{category}</Text>
            </View>
            <FlatList
                data={product}
                keyExtractor={(i) => i?._id}
                renderItem={renderProduct}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
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

export default returns