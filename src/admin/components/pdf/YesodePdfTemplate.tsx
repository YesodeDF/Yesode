import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font
} from '@react-pdf/renderer';

// Register Inter font from Google Fonts CDN
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyAZ9hiA.ttf', fontWeight: 'medium' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.ttf', fontWeight: 'bold' }
  ]
});

export interface ProposalPdfSection {
  title: string;
  subtitle?: string;
  content: string[]; // List of paragraphs
  items?: string[];  // Optional bullet points
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface YesodePdfTemplateProps {
  clientName: string;
  clientSubtitle?: string;
  accentColor: string; // Hex color for highlighting
  presentedBy?: string[];
  date?: string;
  sections: ProposalPdfSection[];
}

export const YesodePdfTemplate: React.FC<YesodePdfTemplateProps> = ({
  clientName,
  clientSubtitle = 'Proposta de Solução e Arquitetura Digital',
  accentColor,
  presentedBy = ['Filipe Nogueira', 'Davi Ribeiro'],
  date = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
  sections
}) => {
  const styles = StyleSheet.create({
    // Page layouts
    pageCover: {
      backgroundColor: '#0A0F1C',
      padding: 50,
      fontFamily: 'Inter',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    pageContent: {
      backgroundColor: '#0A0F1C',
      paddingTop: 70,
      paddingBottom: 60,
      paddingLeft: 60,
      paddingRight: 50,
      fontFamily: 'Inter',
      position: 'relative',
    },
    // Decorative Gold Line on content pages (Left sidebar accent)
    sidebarAccent: {
      position: 'absolute',
      left: 30,
      top: 70,
      bottom: 60,
      width: 3,
      backgroundColor: '#C4A962',
    },
    // Cover elements
    coverTop: {
      marginTop: 60,
    },
    coverBadge: {
      color: '#C4A962',
      fontSize: 10,
      fontWeight: 'bold',
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: 20,
    },
    logoY: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#0A0F1C',
      backgroundColor: '#C4A962',
      width: 46,
      height: 46,
      borderRadius: 10,
      textAlign: 'center',
      lineHeight: 1.3,
      marginBottom: 30,
    },
    coverTitle: {
      fontSize: 36,
      color: '#FFFFFF',
      fontWeight: 'bold',
      letterSpacing: -1,
      lineHeight: 1.15,
      marginBottom: 10,
    },
    coverClient: {
      fontSize: 42,
      color: accentColor,
      fontWeight: 'bold',
      letterSpacing: -1.5,
      marginBottom: 20,
    },
    coverSubtitle: {
      fontSize: 14,
      color: '#9CA3AF',
      lineHeight: 1.5,
      maxWidth: 400,
    },
    coverBottom: {
      marginBottom: 30,
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      paddingTop: 20,
    },
    metaLabel: {
      color: '#9CA3AF',
      fontSize: 9,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
    metaValue: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'medium',
      marginBottom: 12,
    },
    metaTeam: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'medium',
    },
    // Content Header/Footer
    header: {
      position: 'absolute',
      top: 30,
      left: 60,
      right: 50,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      paddingBottom: 8,
    },
    headerLogo: {
      color: '#C4A962',
      fontWeight: 'bold',
      fontSize: 11,
    },
    headerTitle: {
      color: '#9CA3AF',
      fontSize: 9,
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 60,
      right: 50,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      paddingTop: 8,
      fontSize: 8,
      color: '#6B7280',
    },
    // Section Typography
    sectionHeader: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      color: accentColor,
      fontWeight: 'bold',
      marginBottom: 6,
    },
    sectionSubtitle: {
      fontSize: 11,
      color: '#9CA3AF',
      lineHeight: 1.4,
    },
    paragraph: {
      fontSize: 11,
      color: '#D1D5DB',
      lineHeight: 1.6,
      marginBottom: 12,
    },
    bulletContainer: {
      marginTop: 5,
      marginBottom: 15,
      paddingLeft: 10,
    },
    bulletItem: {
      fontSize: 10.5,
      color: '#D1D5DB',
      lineHeight: 1.5,
      marginBottom: 6,
      display: 'flex',
      flexDirection: 'row',
    },
    bulletPoint: {
      color: '#C4A962',
      width: 12,
    },
    bulletText: {
      flex: 1,
    },
    // Table styling
    table: {
      marginTop: 15,
      marginBottom: 15,
      borderRadius: 6,
      border: '1px solid rgba(255, 255, 255, 0.08)',
      overflow: 'hidden',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      minHeight: 28,
      alignItems: 'center',
    },
    tableHeaderRow: {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
    },
    tableCell: {
      fontSize: 9,
      color: '#D1D5DB',
      padding: 8,
      flex: 1,
    },
    tableHeaderCell: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 9,
    },
    tableCol1: {
      flex: 1.2,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    tableColAccentA: {
      color: '#FFFFFF',
      backgroundColor: 'rgba(99, 102, 241, 0.04)',
    },
    tableColAccentB: {
      color: '#FFFFFF',
      backgroundColor: 'rgba(16, 185, 129, 0.04)',
    }
  });

  return (
    <Document>
      {/* Page 1: Cover */}
      <Page size="A4" style={styles.pageCover}>
        <View style={styles.coverTop}>
          <View style={styles.logoY}>
            <Text>Y</Text>
          </View>
          <Text style={styles.coverBadge}>Apresentação Exclusiva</Text>
          <Text style={styles.coverTitle}>Transformação Digital</Text>
          <Text style={styles.coverClient}>{clientName}</Text>
          <Text style={styles.coverSubtitle}>{clientSubtitle}</Text>
        </View>

        <View style={styles.coverBottom}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.metaLabel}>Elaborado por</Text>
              <Text style={styles.metaTeam}>{presentedBy.join(' • ')}</Text>
              <Text style={{ color: '#C4A962', fontSize: 10, marginTop: 2, fontWeight: 'medium' }}>Yesode Soluções Digitais</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.metaLabel}>Data de Emissão</Text>
              <Text style={styles.metaValue}>{date}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* Pages 2+: Content */}
      {sections.map((section, idx) => (
        <Page key={idx} size="A4" style={styles.pageContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerLogo}>Yesode</Text>
            <Text style={styles.headerTitle}>{clientName} — Proposta de Engenharia</Text>
          </View>

          {/* Golden Sidebar Line decoration */}
          <View style={styles.sidebarAccent} />

          {/* Section Body */}
          <View style={{ marginTop: 20 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.subtitle && <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>}
            </View>

            {/* Paragraphs */}
            {section.content.map((p, pIdx) => (
              <Text key={pIdx} style={styles.paragraph}>{p}</Text>
            ))}

            {/* Bullet points if any */}
            {section.items && section.items.length > 0 && (
              <View style={styles.bulletContainer}>
                {section.items.map((item, itemIdx) => (
                  <View key={itemIdx} style={styles.bulletItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Tabela Comparativa if any */}
            {section.table && (
              <View style={styles.table}>
                {/* Header Row */}
                <View style={[styles.tableRow, styles.tableHeaderRow]}>
                  {section.table.headers.map((h, hIdx) => (
                    <Text
                      key={hIdx}
                      style={[
                        styles.tableCell,
                        styles.tableHeaderCell,
                        hIdx === 0 ? styles.tableCol1 : {}
                      ]}
                    >
                      {h}
                    </Text>
                  ))}
                </View>
                {/* Data Rows */}
                {section.table.rows.map((row, rIdx) => (
                  <View key={rIdx} style={styles.tableRow}>
                    {row.map((cell, cIdx) => (
                      <Text
                        key={cIdx}
                        style={[
                          styles.tableCell,
                          cIdx === 0 ? styles.tableCol1 : {},
                          cIdx === 1 ? styles.tableColAccentA : {},
                          cIdx === 2 ? styles.tableColAccentB : {}
                        ]}
                      >
                        {cell}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>Yesode © {new Date().getFullYear()} • Soluções de Engenharia sob Medida</Text>
            <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
          </View>
        </Page>
      ))}
    </Document>
  );
};
