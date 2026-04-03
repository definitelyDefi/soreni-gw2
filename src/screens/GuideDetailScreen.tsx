import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {GUIDES, GUIDE_CATEGORIES, GuideSection} from '../constants/guides';
import {colors, fontSize, spacing, radius} from '../constants/theme';

const DIFFICULTY_COLORS = {
  beginner:     '#4caf50',
  intermediate: '#ff9800',
  advanced:     '#f44336',
};
const DIFFICULTY_LABELS = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
};
const DIFFICULTY_ICONS = {
  beginner:     '🌱',
  intermediate: '⚡',
  advanced:     '💀',
};

export default function GuideDetailScreen({route, navigation}: any) {
  const {guideId} = route.params;
  const guide = GUIDES.find(g => g.id === guideId);
  const [tocOpen, setTocOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<number[]>([]);

  if (!guide) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.notFoundBack} onPress={() => navigation.goBack()}>
          <Text style={styles.notFoundBackText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.notFound}>Guide not found.</Text>
      </View>
    );
  }

  const cat = GUIDE_CATEGORIES.find(c => c.id === guide.categoryId);
  const catColor = cat?.color ?? colors.gold;
  const diffColor = DIFFICULTY_COLORS[guide.difficulty];

  const scrollToSection = (idx: number) => {
    const y = sectionOffsets.current[idx];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({y: y - 16, animated: true});
    }
    setTocOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Category color accent bar */}
      <View style={[styles.accentBar, {backgroundColor: catColor}]} />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroIconWrap, {backgroundColor: catColor + '18'}]}>
            <Text style={styles.heroIcon}>{guide.icon}</Text>
          </View>
          <View style={styles.heroMeta}>
            {cat && (
              <Text style={[styles.heroCat, {color: catColor}]}>
                {cat.icon} {cat.label}
              </Text>
            )}
            <Text style={styles.heroTitle}>{guide.title}</Text>
            <View style={styles.heroTags}>
              <View style={[styles.diffBadge, {backgroundColor: diffColor + '20', borderColor: diffColor + '70'}]}>
                <Text style={[styles.diffText, {color: diffColor}]}>
                  {DIFFICULTY_ICONS[guide.difficulty]} {DIFFICULTY_LABELS[guide.difficulty]}
                </Text>
              </View>
              <Text style={styles.readTime}>📖 {guide.readTime} min read</Text>
              <Text style={styles.sectionCount}>· {guide.sections.length} sections</Text>
            </View>
          </View>
        </View>

        {/* Header image */}
        {guide.image && (
          <Image
            source={{uri: guide.image}}
            style={styles.headerImage}
            resizeMode="cover"
          />
        )}

        {/* Summary box */}
        <View style={[styles.summaryBox, {borderLeftColor: catColor}]}>
          <Text style={styles.summaryLabel}>OVERVIEW</Text>
          <Text style={styles.summaryText}>{guide.summary}</Text>
        </View>

        {/* Table of Contents */}
        {guide.sections.some(s => s.title) && (
          <TouchableOpacity
            style={[styles.tocToggle, {borderColor: catColor + '55', backgroundColor: catColor + '0A'}]}
            onPress={() => setTocOpen(v => !v)}
            activeOpacity={0.7}>
            <Text style={[styles.tocToggleText, {color: catColor}]}>
              📋 Table of Contents
            </Text>
            <Text style={[styles.tocArrow, {color: catColor}]}>{tocOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>
        )}
        {tocOpen && (
          <View style={[styles.tocBox, {borderColor: catColor + '33'}]}>
            {guide.sections.map((section, idx) =>
              section.title ? (
                <TouchableOpacity
                  key={idx}
                  style={styles.tocItem}
                  onPress={() => scrollToSection(idx)}
                  activeOpacity={0.65}>
                  <Text style={[styles.tocNum, {color: catColor}]}>{idx + 1}</Text>
                  <Text style={styles.tocItemText}>{section.title}</Text>
                  <Text style={styles.tocItemArrow}>›</Text>
                </TouchableOpacity>
              ) : null,
            )}
          </View>
        )}

        {/* Divider */}
        <View style={[styles.divider, {backgroundColor: catColor + '33'}]} />

        {/* Sections */}
        {guide.sections.map((section, idx) => (
          <SectionBlock
            key={idx}
            section={section}
            index={idx}
            catColor={catColor}
            onLayout={e => {
              sectionOffsets.current[idx] = e.nativeEvent.layout.y;
            }}
          />
        ))}

        {/* Footer */}
        <View style={[styles.footer, {borderTopColor: catColor + '33'}]}>
          <Text style={[styles.footerCat, {color: catColor}]}>{cat?.icon} {cat?.label}</Text>
          <Text style={styles.footerTitle}>{guide.title}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Section Block ────────────────────────────────────────────────────────────

function SectionBlock({
  section, index, catColor, onLayout,
}: {
  section: GuideSection;
  index: number;
  catColor: string;
  onLayout: (e: any) => void;
}) {
  return (
    <View style={styles.section} onLayout={onLayout}>
      {section.title && (
        <View style={styles.sectionTitleRow}>
          <View style={[styles.sectionNum, {backgroundColor: catColor}]}>
            <Text style={styles.sectionNumText}>{index + 1}</Text>
          </View>
          <Text style={[styles.sectionTitle, {color: catColor}]}>{section.title}</Text>
        </View>
      )}

      {!!section.content && (
        <Text style={styles.sectionContent}>{section.content}</Text>
      )}

      {section.list && section.list.length > 0 && (
        <View style={styles.listBlock}>
          {section.list.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <View style={[styles.listDot, {backgroundColor: catColor}]} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {section.tips && section.tips.length > 0 && (
        <View style={styles.tipsBox}>
          <View style={styles.tipsHeader}>
            <Text style={styles.tipsHeaderIcon}>💡</Text>
            <Text style={styles.tipsHeaderText}>Tips</Text>
          </View>
          {section.tips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={styles.tipBullet}>›</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      {section.warnings && section.warnings.length > 0 && (
        <View style={styles.warningBox}>
          <View style={styles.warningHeader}>
            <Text style={styles.warningHeaderIcon}>⚠️</Text>
            <Text style={styles.warningHeaderText}>Watch Out</Text>
          </View>
          {section.warnings.map((w, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={styles.warnBullet}>›</Text>
              <Text style={styles.warningText}>{w}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  accentBar: {height: 3, width: '100%'},
  scroll: {flex: 1},
  content: {padding: spacing.md, paddingBottom: spacing.xl},
  notFound: {color: colors.textMuted, fontSize: fontSize.sm, padding: spacing.md},
  notFoundBack: {padding: spacing.md, paddingBottom: 0},
  notFoundBackText: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '700'},

  // Hero
  hero: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    paddingBottom: spacing.md,
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroIcon: {fontSize: 36},
  heroMeta: {flex: 1, gap: 4},
  heroCat: {fontSize: fontSize.xs, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8},
  heroTitle: {color: colors.text, fontSize: fontSize.xl, fontWeight: '800', lineHeight: 26},
  heroTags: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4, flexWrap: 'wrap'},
  diffBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  diffText: {fontSize: 11, fontWeight: '700'},
  readTime: {color: colors.textMuted, fontSize: fontSize.xs},
  sectionCount: {color: colors.textMuted, fontSize: fontSize.xs},

  // Header image
  headerImage: {
    width: '100%',
    height: 180,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },

  // Summary
  summaryBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderLeftWidth: 4,
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  summaryText: {color: colors.text, fontSize: fontSize.sm, lineHeight: 22},

  // TOC
  tocToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
  tocToggleText: {fontSize: fontSize.sm, fontWeight: '700'},
  tocArrow: {fontSize: fontSize.xs, fontWeight: '800'},
  tocBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  tocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tocNum: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    width: 20,
    textAlign: 'center',
  },
  tocItemText: {color: colors.text, fontSize: fontSize.sm, flex: 1},
  tocItemArrow: {color: colors.textMuted, fontSize: fontSize.md},

  // Divider
  divider: {height: 2, borderRadius: 1, marginBottom: spacing.md},

  // Section
  section: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  sectionNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionNumText: {color: '#000', fontSize: 11, fontWeight: '900'},
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '800',
    flex: 1,
    lineHeight: 22,
  },
  sectionContent: {
    color: colors.text,
    fontSize: fontSize.sm,
    lineHeight: 22,
  },

  // List
  listBlock: {gap: 6, paddingLeft: 4},
  listItem: {flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start'},
  listDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    flexShrink: 0,
  },
  listText: {color: colors.text, fontSize: fontSize.sm, lineHeight: 22, flex: 1},

  // Tips box
  tipsBox: {
    backgroundColor: '#4caf5010',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#4caf5040',
    padding: spacing.sm,
    gap: 6,
  },
  tipsHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 2},
  tipsHeaderIcon: {fontSize: 14},
  tipsHeaderText: {color: '#4caf50', fontSize: fontSize.xs, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5},
  tipRow: {flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start'},
  tipBullet: {color: '#4caf50', fontSize: fontSize.md, flexShrink: 0, lineHeight: 20, marginTop: 1},
  tipText: {color: colors.text, fontSize: fontSize.xs, lineHeight: 20, flex: 1},

  // Warning box
  warningBox: {
    backgroundColor: '#ff980010',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#ff980040',
    padding: spacing.sm,
    gap: 6,
  },
  warningHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 2},
  warningHeaderIcon: {fontSize: 14},
  warningHeaderText: {color: '#ff9800', fontSize: fontSize.xs, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5},
  warnBullet: {color: '#ff9800', fontSize: fontSize.md, flexShrink: 0, lineHeight: 20, marginTop: 1},
  warningText: {color: colors.text, fontSize: fontSize.xs, lineHeight: 20, flex: 1},

  // Footer
  footer: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    marginTop: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  footerCat: {fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5},
  footerTitle: {color: colors.textMuted, fontSize: fontSize.xs, textAlign: 'center'},
});
