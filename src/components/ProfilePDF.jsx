// src/components/ProfilePDF.jsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica"
  },
  section: {
    marginBottom: 10,
    padding: 10,
    border: "1 solid #ccc",
    borderRadius: 4
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center"
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: "50",
    marginBottom: 10,
    alignSelf: "center"
  },
  label: {
    fontWeight: "bold"
  },
  row: {
    marginBottom: 5
  }
});

const ProfilePDF = ({ user }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.heading}>User Profile</Text>
        <Image src={user.profile_image_url} style={styles.image} />

        <View style={styles.section}>
          <Text style={styles.row}>
            <Text style={styles.label}>Full Name: </Text>
            {user.firstname} {user.lastname}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Email: </Text>
            {user.email}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Phone: </Text>
            {user.phone_number}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Unique ID: </Text>
            {user.unique_id}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Tier: </Text>
            {user.tier}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Admin: </Text>
            {user.isAdmin ? "Yes" : "No"}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ProfilePDF;
