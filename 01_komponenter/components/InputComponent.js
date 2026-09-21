import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

const InputComponent = () => {
    const [inputValue, setInputValue] = useState("");

    return (
        <View>
            <TextInput
                placeholder="Skriv noget..."
                onChangeText={(txt) => setInputValue(txt)}
                value={inputValue}
            />
            <Text>Du har skrevet: {inputValue}</Text>
        </View>
    )
}

export default InputComponent;
