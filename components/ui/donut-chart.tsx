import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { ThemedText } from '@/components/themed-text';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DataItem[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

export const DonutChart = ({
  data,
  size = 200,
  strokeWidth = 20,
  centerLabel = 'Total',
  centerValue = '0',
}: DonutChartProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const total = data.reduce((acc, item) => acc + item.value, 0);

  let currentOffset = 0;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E5E530"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {total > 0 &&
            data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDashoffset = circumference - (circumference * percentage) / 100;
              
              const segment = (
                <Circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  rotation={(currentOffset / total) * 360}
                  origin={`${size / 2}, ${size / 2}`}
                />
              );
              currentOffset += item.value;
              return segment;
            })}
        </G>
      </Svg>
      <View style={styles.labelContainer}>
        <ThemedText style={styles.centerValue}>{centerValue}</ThemedText>
        <ThemedText style={styles.centerLabel}>{centerLabel}</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 2,
  },
  centerLabel: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.5,
  },
});
