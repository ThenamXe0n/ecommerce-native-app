import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons, MaterialIcons } from "@expo/vector-icons"

const TabLayout = () => {
    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#0a0a0a',
                        borderTopColor: '#1a1a1a',
                        height: 60,
                        paddingBottom: 8,
                    },
                    tabBarActiveTintColor: '#1DB954',
                    tabBarInactiveTintColor: '#666',
                }}

            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ size, color }) => (
                            <Ionicons
                                name="home-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="returns"
                    options={{
                        title: "Returns",
                        tabBarIcon: ({ size, color }) => (
                            <Ionicons
                                name="return-down-back-sharp"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="checkout"
                    options={{
                        title: "Checkoutt",
                        tabBarIcon: ({ size, color }) => (
                            <MaterialIcons
                                name="shopping-cart-checkout"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="cart"
                    options={{
                        title: "Cart",
                        tabBarIcon: ({ size, color }) => (
                            <Ionicons
                                name="cart-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="order"
                    options={{
                        title: "orders",
                        tabBarIcon: ({ size, color }) => (
                            <Ionicons
                                name="logo-dropbox"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ size, color }) => (
                            <Ionicons
                                name="person-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </View>

    )
}

export default TabLayout