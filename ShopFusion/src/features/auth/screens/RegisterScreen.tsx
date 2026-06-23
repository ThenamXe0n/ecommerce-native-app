import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    RegisterFormData, registerSchema
} from "../schemas/register.schema";
import { login } from "@/api/auth.service";
import { useAuthStore } from "../store/auth.store";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
    const router = useRouter()
    const { setAuth } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        console.log(data);
        const response = await login(data);

        setAuth({
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
        });

        // API Call
        // await authService.login(data);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register here</Text>

            {/* name */}

            <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange, onBlur } }) => (
                    <>
                        <TextInput
                            placeholder="name"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            autoCapitalize="none"
                            style={styles.input}
                        />

                        {errors.name && (
                            <Text style={styles.error}>
                                {errors.name.message}
                            </Text>
                        )}
                    </>
                )}
            />
            {/* Email */}

            <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange, onBlur } }) => (
                    <>
                        <TextInput
                            placeholder="Email"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                        />

                        {errors.email && (
                            <Text style={styles.error}>
                                {errors.email.message}
                            </Text>
                        )}
                    </>
                )}
            />

            {/* Password */}

            <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange, onBlur } }) => (
                    <>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Password"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                secureTextEntry={!showPassword}
                                style={styles.passwordInput}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setShowPassword((prev) => !prev)
                                }
                            >
                                <Text>
                                    {showPassword ? "Hide" : "Show"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {errors.password && (
                            <Text style={styles.error}>
                                {errors.password.message}
                            </Text>
                        )}
                    </>
                )}
            />

            {/* Login Button */}

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>
                    {isSubmitting ? "Loading..." : "Login"}
                </Text>
            </TouchableOpacity>

            {/* Footer */}

            <View style={styles.footer}>
                <Text>Already have an account? </Text>

                <TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
                    <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 30,
        textAlign: "center",
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 14,
        marginBottom: 6,
    },

    passwordContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
    },

    passwordInput: {
        flex: 1,
        paddingVertical: 14,
    },

    error: {
        color: "red",
        marginBottom: 8,
        marginTop: 4,
    },

    button: {
        backgroundColor: "#000",
        padding: 16,
        borderRadius: 10,
        marginTop: 20,
    },

    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "600",
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },

    link: {
        fontWeight: "700",
    },
});