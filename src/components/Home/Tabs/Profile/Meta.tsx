import React from 'react';
import {StyleSheet, View, Text} from "react-native";

type Props = {
    name: string
    count: number
};
export const Meta = ({name, count}: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.count}>{count}</Text>
            <Text style={styles.name}>{name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 20,
        alignItems: 'center'
    },
    count: {
        fontFamily: 'SegoeUISemiBold',
        fontSize: 20,
        color: '#000'
    },
    name: {
        fontFamily: 'SegoeUI',
        fontSize: 15,
        color: '#000'
    }
})
