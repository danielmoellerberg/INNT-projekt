import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';

const ButtonComponent = () => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <View>
            <Text>{isPressed ? "Ja til kode!" : "Nej til kode"}</Text>
            <Button
                title="Tryk her"
                onPress={() => setIsPressed((prev) => !prev)}
            />
        </View>
    );
}

export default ButtonComponent;
