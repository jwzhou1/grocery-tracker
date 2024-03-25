import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryLegend, VictoryTheme, VictoryLabel } from 'victory-native';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function LineChartManager({ selectedDuration }) {
  const [expenseData, setExpenseData] = useState({});
  const [accumulatedExpenseData, setAccumulatedExpenseData] = useState({});

  // Mock expense data for demonstration
  useEffect(() => {
    // Mock data for 1 month
    const oneMonthData = {
      "03-01": 150,
      "03-02": 200,
      "03-03": 180,
      // Add more data as needed
    };

    // Mock data for 3 months
    const threeMonthsData = {
      "01-01": 500,
      "01-02": 450,
      "01-03": 600,
      // Add more data as needed
    };

    // Mock data for 6 months
    const sixMonthsData = {
      "10-01": 800,
      "10-02": 750,
      "10-03": 900,
      // Add more data as needed
    };

    // Set expense data based on selected duration
    switch (selectedDuration) {
      case '1 Month':
        setExpenseData(oneMonthData);
        break;
      case '3 Months':
        setExpenseData(threeMonthsData);
        break;
      case '6 Months':
        setExpenseData(sixMonthsData);
        break;
      default:
        setExpenseData({});
        break;
    }

  }, [selectedDuration]);


  // Legend data
  const legendData = [
    { name: "1 month", symbol: { fill: "#4c97ff", type: "circle" }, labels: { fill: "#4c97ff" } },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.legendContainer}>
        <VictoryLegend
          x={windowWidth * 0.1}
          y={0}
          orientation="horizontal"
          gutter={20}
          style={{ labels: styles.legendLabels }}
          data={legendData}
        />
      </View>
      <View style={styles.LineChartContainer}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={windowWidth}
          height={windowWidth * 0.45}
          padding={{ top: 20, bottom: 30, left: 65, right: 40 }}
        >
          {/* X Axis */}
          <VictoryAxis
            tickLabelComponent={
              <VictoryLabel style={{ fontSize: 12 }} />
            }
          />
          {/* Y Axis */}
          {Object.keys(expenseData).length > 1 && (
            <VictoryAxis
              dependentAxis
              tickLabelComponent={
                <VictoryLabel style={{ fontSize: 12 }} />
              }
            />
          )}
          {/* Accumulated Expense Line */}
          <VictoryLine
            animate={{ duration: 100 }}
            data={Object.entries(accumulatedExpenseData).map(([key, value]) => ({ x: key, y: value }))}
            style={{
              data: { stroke: "#008170", strokeWidth: 2 },
              parent: { border: "1px solid #ccc" }
            }}
          />
          {/* Expense Line */}
          <VictoryLine
            animate={{ duration: 100 }}
            data={Object.entries(expenseData).map(([key, value]) => ({ x: key, y: value }))}
            style={{
              data: { stroke: "#4c97ff", strokeWidth: 2 },
              parent: { border: "1px solid #ccc" }
            }}
          />
        </VictoryChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    width: '90%',
    alignSelf: "center",
    backgroundColor: '#FFFBF5',
    padding: 10,
    shadowColor: 'gray',
    shadowOffset: { width: 5, height: 5 }, // Shadow offset
    shadowOpacity: 0.8, // Shadow opacity
    shadowRadius: 8, // Shadow radius
    elevation: 10, // Android shadow elevation
  },
  legendContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: "center",
    marginBottom: 10,
  },
  legendLabels: {
    fill: "black",
    fontSize: 10.5,
    // fontFamily: "Roboto",
    fontWeight: "bold",
  },
});
