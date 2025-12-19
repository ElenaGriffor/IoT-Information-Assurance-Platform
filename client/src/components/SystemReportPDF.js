import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    color: '#2c3e50',
  },
  text: {
    fontSize: 12,
    margin: 5,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  headerCell: {
    margin: 5,
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
  },
});

// Create Document Component
const SystemReportPDF = () => (
  <PDFViewer style={{ width: '100%', height: '100%' }}>
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>System Analysis Report</Text>
          <Text style={styles.text}>Generated on: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>1. System Overview</Text>
          <Text style={styles.text}>
            This report provides a comprehensive analysis of the system's current state, focusing on key performance indicators and operational metrics.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>2. Key Metrics</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>Metric</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>Value</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>Status</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>System Uptime</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>99.9%</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Optimal</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Response Time</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>150ms</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Good</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Error Rate</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>0.01%</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Acceptable</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>3. Subsystem Analysis</Text>
          <Text style={styles.text}>3.1 Energy Subsystem</Text>
          <Text style={styles.text}>Power efficiency metrics show optimal performance with minimal energy waste.</Text>
          
          <Text style={styles.text}>3.2 Control Subsystem</Text>
          <Text style={styles.text}>Control mechanisms are operating within expected parameters.</Text>
          
          <Text style={styles.text}>3.3 Monitoring Subsystem</Text>
          <Text style={styles.text}>Real-time monitoring is active and providing accurate data.</Text>
          
          <Text style={styles.text}>3.4 Safety Subsystem</Text>
          <Text style={styles.text}>All safety protocols are in place and functioning correctly.</Text>
          
          <Text style={styles.text}>3.5 Maintenance Subsystem</Text>
          <Text style={styles.text}>Predictive maintenance schedules are up to date.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>4. Recommendations</Text>
          <Text style={styles.text}>• Consider upgrading the monitoring system for better data granularity</Text>
          <Text style={styles.text}>• Implement additional safety checks in the control subsystem</Text>
          <Text style={styles.text}>• Schedule maintenance for the energy subsystem in Q3</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>5. Conclusion</Text>
          <Text style={styles.text}>
            The system is operating within acceptable parameters. Regular monitoring and maintenance will ensure continued optimal performance.
          </Text>
        </View>
      </Page>
    </Document>
  </PDFViewer>
);

export default SystemReportPDF; 