import { Text } from 'react-native';
import { router } from 'expo-router';

import { useEffect } from 'react';
function Index() {

    useEffect(() => {
        router.replace('/home');
    }, []);

    return (
        <Text className="text-white"> Soy la pagina principal, no deberias estar aqui</Text>
    )
}

export default Index
