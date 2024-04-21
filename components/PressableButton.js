import { StyleSheet, Pressable } from 'react-native'
import React from 'react'

export default function PressableButton({ customStyle, pressedFunction, disabled, children }) {
  return (
    <Pressable 
      style={({ pressed }) => {
        return [customStyle, pressed && styles.pressed, disabled && styles.disabled]
      }}
      onPress={pressedFunction}
      disabled={disabled}
    >
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressed: {
    //backgroundColor: "#fff",
    opacity: 0.5
  },
  disabled: {
    //backgroundColor: 'grey'
  }
})