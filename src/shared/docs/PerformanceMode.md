# Sistema de Modo de Rendimiento

Este sistema permite desactivar globalmente todas las animaciones de React Native Reanimated cuando el usuario activa el "Modo Rendimiento" para mejorar el performance en dispositivos menos potentes.

## Archivos Creados

### 1. Context - `src/shared/context/AppSettingsContext.tsx`
Contexto global que maneja todas las configuraciones de la aplicación incluyendo el modo de rendimiento.

### 2. Hooks - `src/shared/hooks/usePerformantAnimation.ts`
Hooks personalizados que respetan automáticamente el modo de rendimiento:
- `usePerformantAnimation`: Hook general para animaciones
- `useAnimatedSwitch`: Hook específico para switches animados
- `useButtonScale`: Hook para botones con efecto de escala

## Cómo Usar en Otros Componentes

### Ejemplo 1: Animación Básica
```tsx
import { usePerformantAnimation } from '@shared/hooks/usePerformantAnimation';

const MyComponent = () => {
  const { animatedValue, animateWithSpring } = usePerformantAnimation(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animatedValue.value
  }));

  const handlePress = () => {
    // Se anima normalmente o instantáneamente según el modo rendimiento
    animateWithSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View style={animatedStyle}>
      {/* contenido */}
    </Animated.View>
  );
};
```

### Ejemplo 2: Switch Personalizado
```tsx
import { useAnimatedSwitch } from '@shared/hooks/usePerformantAnimation';

const CustomSwitch = ({ isEnabled, onToggle }) => {
  const { switchAnimation, animateSwitch } = useAnimatedSwitch(isEnabled);

  useEffect(() => {
    animateSwitch(isEnabled);
  }, [isEnabled]);

  // ... resto del componente
};
```

### Ejemplo 3: Botón con Escala
```tsx
import { useButtonScale } from '@shared/hooks/usePerformantAnimation';

const ScaleButton = ({ children, onPress }) => {
  const { scale, scaleDown, scaleUp } = useButtonScale();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <TouchableOpacity
      onPressIn={scaleDown}
      onPressOut={scaleUp}
      onPress={onPress}
    >
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};
```

### Ejemplo 4: Acceder al Estado del Modo Rendimiento
```tsx
import { useAppSettings } from '@shared/context/AppSettingsContext';

const MyComponent = () => {
  const { isPerformanceModeEnabled, settings, updateSetting } = useAppSettings();

  // Verificar si el modo rendimiento está activo
  if (isPerformanceModeEnabled) {
    // Lógica especial para modo rendimiento
    return <SimpleComponent />;
  }

  // Componente con animaciones normales
  return <AnimatedComponent />;
};
```

## Configuraciones Disponibles

El contexto maneja estas configuraciones:
- `performanceMode`: Activa/desactiva el modo rendimiento
- `notifications`: Configuración de notificaciones
- `location`: Compartir ubicación en tiempo real
- `darkMode`: Modo oscuro (preparado para futuro uso)

## Características del Sistema

### ✅ Beneficios
- **Global**: Un switch controla todas las animaciones de la app
- **Automático**: Los hooks detectan automáticamente el modo activo
- **Persistente**: Las configuraciones se guardan en AsyncStorage
- **Performance**: Sin interpolación de colores en modo rendimiento
- **Flexible**: Fácil de implementar en componentes existentes

### 🔧 Implementación
- **Sin Animaciones**: Los valores cambian instantáneamente
- **Con Animaciones**: Se usan spring/timing normalmente
- **Detección Inteligente**: Los hooks manejan ambos casos automáticamente

## Integración en el Layout Principal

El contexto está integrado en `src/app/_layout.tsx`:
```tsx
<AppSettingsProvider>
  <PlacesContextProvider>
    {/* resto de la app */}
  </PlacesContextProvider>
</AppSettingsProvider>
```

## Notas Importantes

1. **Orden de Providers**: AppSettingsProvider debe envolver otros contextos que puedan usar animaciones
2. **Persistencia**: Las configuraciones se cargan automáticamente al iniciar la app
3. **Compatibilidad**: Los hooks son compatibles con cualquier animación de Reanimated
4. **Debug**: Los cambios de modo rendimiento se loggean en consola para desarrollo