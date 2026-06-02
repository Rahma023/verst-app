import "server-only";

import { Document, Page, Text, View, StyleSheet, Svg, Path, Circle } from "@react-pdf/renderer";

export type CertificateData = {
  fullName: string;
  moduleCode: string;
  moduleTitle: string;
  issuedAt: string; // ISO
  verifyCode: string;
};

const COLORS = {
  paper: "#FFFFFF",
  ink: "#0E1612",
  ink2: "#2A332D",
  ink3: "#5A6259",
  line: "#E5E3DA",
  forest: "#008037",
  forest2: "#003F1B",
  moss: "#589630",
  sand: "#F5EBC4",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.paper,
    padding: 0,
    fontFamily: "Helvetica",
    color: COLORS.ink,
  },
  border: {
    position: "absolute",
    top: 24,
    right: 24,
    bottom: 24,
    left: 24,
    borderWidth: 1,
    borderColor: COLORS.ink,
    borderStyle: "solid",
  },
  inner: {
    flex: 1,
    padding: 60,
    paddingTop: 56,
    flexDirection: "column",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandText: {
    fontSize: 11,
    letterSpacing: 2.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.forest,
  },
  meta: {
    alignItems: "flex-end",
  },
  metaLabel: {
    fontSize: 8,
    letterSpacing: 1.8,
    color: COLORS.ink3,
    fontFamily: "Helvetica-Bold",
  },
  metaValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
    marginTop: 4,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: "Helvetica-Bold",
    color: COLORS.forest,
    marginBottom: 14,
  },
  title: {
    fontSize: 42,
    lineHeight: 1.05,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
    marginBottom: 36,
    letterSpacing: -1,
  },
  awardLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: COLORS.ink3,
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
  },
  awardName: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
    marginBottom: 18,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 1.6,
    color: COLORS.ink2,
    maxWidth: 540,
    marginBottom: 28,
  },
  moduleBlock: {
    backgroundColor: COLORS.forest2,
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  moduleLeft: {
    flexDirection: "column",
  },
  moduleEyebrow: {
    fontSize: 9,
    letterSpacing: 2.4,
    color: COLORS.moss,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  moduleTitle: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Helvetica-Bold",
  },
  moduleCode: {
    fontSize: 48,
    color: COLORS.moss,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -2,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "auto",
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    borderTopStyle: "solid",
  },
  sigCol: {
    flexDirection: "column",
    width: "45%",
  },
  sigLine: {
    height: 1,
    backgroundColor: COLORS.ink,
    marginBottom: 6,
  },
  sigLabel: {
    fontSize: 9,
    letterSpacing: 1.8,
    color: COLORS.ink3,
    fontFamily: "Helvetica-Bold",
  },
  sigName: {
    fontSize: 11,
    color: COLORS.ink,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  verifyBlock: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  verifyLabel: {
    fontSize: 8,
    letterSpacing: 1.8,
    color: COLORS.ink3,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  verifyCode: {
    fontSize: 14,
    fontFamily: "Courier-Bold",
    color: COLORS.ink,
    letterSpacing: 1.5,
  },
  verifyHint: {
    fontSize: 8,
    color: COLORS.ink3,
    marginTop: 4,
  },
});

function VerstMark({ size = 22 }: { size?: number }) {
  // Simple stylised "globe + leaf" mark in forest colour.
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="9" stroke={COLORS.forest} strokeWidth="1.5" fill="none" />
      <Path d="M3 12 H21 M12 3 a14 14 0 0 1 0 18 M12 3 a14 14 0 0 0 0 18" stroke={COLORS.forest} strokeWidth="1.2" fill="none" />
    </Svg>
  );
}

export function VerstCertificate({ data }: { data: CertificateData }) {
  const issuedDate = new Date(data.issuedAt);
  const issuedDisplay = issuedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document title={`Verst Carbon Academy — ${data.moduleCode} — ${data.fullName}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border} />
        <View style={styles.inner}>
          <View style={styles.topRow}>
            <View style={styles.brand}>
              <VerstMark size={26} />
              <Text style={styles.brandText}>VERST CARBON ACADEMY</Text>
            </View>
            <View style={styles.meta}>
              <Text style={styles.metaLabel}>ISSUED</Text>
              <Text style={styles.metaValue}>{issuedDisplay}</Text>
            </View>
          </View>

          <Text style={styles.eyebrow}>· CERTIFICATE OF COMPLETION</Text>
          <Text style={styles.title}>
            For completing a module of the{"\n"}Verst Carbon Academy program.
          </Text>

          <Text style={styles.awardLabel}>AWARDED TO</Text>
          <Text style={styles.awardName}>{data.fullName}</Text>

          <Text style={styles.paragraph}>
            who has successfully completed the module assessment with a passing score and
            demonstrated practitioner-level understanding of the material below.
          </Text>

          <View style={styles.moduleBlock}>
            <View style={styles.moduleLeft}>
              <Text style={styles.moduleEyebrow}>MODULE COMPLETED</Text>
              <Text style={styles.moduleTitle}>{data.moduleTitle}</Text>
            </View>
            <Text style={styles.moduleCode}>{data.moduleCode}</Text>
          </View>

          <View style={styles.footerRow}>
            <View style={styles.sigCol}>
              <View style={styles.sigLine} />
              <Text style={styles.sigName}>Verst Carbon Academy</Text>
              <Text style={styles.sigLabel}>ON BEHALF OF THE PROGRAM</Text>
            </View>

            <View style={styles.verifyBlock}>
              <Text style={styles.verifyLabel}>VERIFY CODE</Text>
              <Text style={styles.verifyCode}>{data.verifyCode}</Text>
              <Text style={styles.verifyHint}>verstacademy.com/verify/{data.verifyCode}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
