import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../styles/Colors';
import GlobalStyles from '../styles/StylesHelper';

export default function BottomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

      {state.routes.map((route, index) => {
        
        const { options } = descriptors[route.key];
        let label = '';
        let iconName = '';

        // Set label and icon based on route name
        switch(route.name) {
          case 'Home':
            label = 'Home';
            iconName = 'home';
            break;
          case 'Profile':
            label = 'Profile';
            iconName = 'user';
            break;
          default:
            label = 'Shopping List';
            iconName = 'list';
        }

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={GlobalStyles.bottomTabBar}
          >
            <FontAwesome5 name={iconName} size={30} color={isFocused ? Colors.iconFocused : Colors.iconDefault} />
            <Text style={{marginTop:5, fontSize: 12, color: isFocused ? Colors.iconFocused : Colors.iconDefault }}>
              {options.tabBarLabel || label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
