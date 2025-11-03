import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

interface NavigationSpeechProps {
  currentInstruction?: string;
}

export default function NavigationSpeech({ currentInstruction }: NavigationSpeechProps) {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const lastInstructionRef = useRef<string>('');
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    if (isInitialMountRef.current && currentInstruction) {
      isInitialMountRef.current = false;
      lastInstructionRef.current = currentInstruction;
      try {
        Speech.speak(currentInstruction, {
          language: 'es-ES',
          pitch: 1.0,
          rate: 0.8,
        });
      } catch (error) {
        console.error('Error with initial text-to-speech:', error);
      }
    }
  }, [currentInstruction]);

  useEffect(() => {
    if (isSpeechEnabled && currentInstruction && currentInstruction !== lastInstructionRef.current && !isInitialMountRef.current) {
      lastInstructionRef.current = currentInstruction;
      try {
        Speech.speak(currentInstruction, {
          language: 'es-ES',
          pitch: 1.0,
          rate: 0.8,
        });
      } catch (error) {
        console.error('Error with text-to-speech:', error);
      }
    }
  }, [currentInstruction, isSpeechEnabled]);

  const toggleSpeech = async () => {
    if (isSpeechEnabled) {
      setIsSpeechEnabled(false);
      Speech.stop();
    } else {
      setIsSpeechEnabled(true);
      if (currentInstruction) {
        lastInstructionRef.current = currentInstruction;
        try {
          await Speech.speak(currentInstruction, {
            language: 'es-ES',
            pitch: 1.0,
            rate: 0.8,
          });
        } catch (error) {
          console.error('Error with text-to-speech:', error);
        }
      }
    }
  };

  const replaySpeech = async () => {
    if (isSpeechEnabled && currentInstruction) {
      try {
        Speech.stop();
        await Speech.speak(currentInstruction, {
          language: 'es-ES',
          pitch: 1.0,
          rate: 0.8,
        });
      } catch (error) {
        console.error('Error replaying text-to-speech:', error);
      }
    }
  };

  return (
    <>
        <TouchableOpacity
          onPress={isSpeechEnabled ? replaySpeech : toggleSpeech}
          onLongPress={toggleSpeech}
          className={`w-12 h-12 rounded-full shadow-lg justify-center items-center border-[#666] border-2 ${
            isSpeechEnabled ? 'bg-primary-500' : 'bg-white'
          }`}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isSpeechEnabled ? 'volume-high' : 'volume-mute'} 
            size={24} 
            color={isSpeechEnabled ? 'white' : '#666'} 
          />
        </TouchableOpacity>
    </>
  );
}