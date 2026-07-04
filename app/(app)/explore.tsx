import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Avatar } from '../../src/components/Avatar';
import { Card } from '../../src/components/Card';
import { Chip } from '../../src/components/Chip';
import { GradeChip } from '../../src/components/GradeChip';
import { Icon } from '../../src/components/Icon';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { climbers, gyms, routes, type Route } from '../../src/data/mock';
import { colors, radius, spacing, typography } from '../../src/theme';

const FILTERS = ['All', 'Routes', 'Gyms', 'Climbers', 'Nearby'];

export default function ExploreScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');

  return (
    <Screen scroll padded={false} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Routes, gyms & climbers near you.</Text>

        <View style={styles.searchBar}>
          <Icon name="search" size={18} color={colors.textSubtle} />
          <TextInput
            placeholder="Search routes, gyms, climbers"
            placeholderTextColor={colors.textSubtle}
            style={styles.searchInput}
          />
          <Icon name="options-outline" size={18} color={colors.textMuted} />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map((f) => (
          <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
        ))}
      </ScrollView>

      <View style={styles.padded}>
        <SectionHeader title="Gym spotlight" action="See all" />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gymRow}
      >
        {gyms.map((gym) => (
          <LinearGradient
            key={gym.id}
            colors={[`${gym.accent}40`, colors.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gymCard}
          >
            <View style={[styles.gymBadge, { backgroundColor: gym.accent }]}>
              <Icon name="business" size={18} color={colors.bg} />
            </View>
            <Text style={styles.gymName} numberOfLines={1}>
              {gym.name}
            </Text>
            <Text style={styles.gymCity} numberOfLines={1}>
              {gym.city}
            </Text>
            <View style={styles.gymStats}>
              <View style={styles.gymStat}>
                <Icon name="people" size={13} color={colors.textMuted} />
                <Text style={styles.gymStatText}>{gym.climbersHere} here now</Text>
              </View>
              <View style={styles.gymStat}>
                <Icon name="sparkles" size={13} color={colors.textMuted} />
                <Text style={styles.gymStatText}>{gym.newRoutes} new sets</Text>
              </View>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      <View style={styles.padded}>
        <View style={styles.sectionSpacer} />
        <SectionHeader title="Trending routes" action="Filters" />
        <View style={styles.routeList}>
          {routes.map((route) => (
            <RouteRow
              key={route.id}
              route={route}
              onPress={() => router.push(`/route/${route.id}`)}
            />
          ))}
        </View>

        <View style={styles.sectionSpacer} />
        <SectionHeader title="Climbers to follow" action="See all" />
        <View style={styles.climberList}>
          {climbers.slice(0, 4).map((c) => (
            <Card key={c.id} style={styles.climberRow}>
              <Avatar initials={c.initials} color={c.avatarColor} size={46} />
              <View style={styles.climberCopy}>
                <Text style={styles.climberName}>{c.name}</Text>
                <Text style={styles.climberMeta} numberOfLines={1}>
                  {c.handle} · {c.homeGym}
                </Text>
              </View>
              <GradeChip grade={c.topGrade} size="sm" />
              <Pressable style={styles.followBtn}>
                <Text style={styles.followText}>Follow</Text>
              </Pressable>
            </Card>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const RouteRow: React.FC<{ route: Route; onPress: () => void }> = ({ route, onPress }) => (
  <Pressable onPress={onPress}>
    <Card style={styles.routeCard} padded={false}>
      <View style={[styles.routeSwatch, { backgroundColor: route.color }]} />
      <View style={styles.routeBody}>
        <View style={styles.routeTop}>
          <Text style={styles.routeName}>{route.name}</Text>
          <GradeChip grade={route.grade} size="sm" />
        </View>
        <Text style={styles.routeMeta} numberOfLines={1}>
          {route.gym} · {route.wall}
        </Text>
        <View style={styles.routeTags}>
          {route.style.slice(0, 3).map((s) => (
            <View key={s} style={styles.tag}>
              <Text style={styles.tagText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.routeStats}>
        <Text style={styles.routeSends}>{route.sends}</Text>
        <Text style={styles.routeSendsLabel}>sends</Text>
      </View>
    </Card>
  </Pressable>
);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    height: 48,
    marginTop: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    padding: 0,
  },
  filters: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  padded: {
    paddingHorizontal: spacing.xl,
  },
  sectionSpacer: {
    height: spacing['2xl'],
  },
  gymRow: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  gymCard: {
    width: 220,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  gymBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  gymName: {
    ...typography.h2,
    fontSize: 18,
    color: colors.text,
  },
  gymCity: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  gymStats: {
    gap: 6,
  },
  gymStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gymStatText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  routeList: {
    gap: spacing.md,
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  routeSwatch: {
    width: 6,
    alignSelf: 'stretch',
  },
  routeBody: {
    flex: 1,
    padding: spacing.lg,
    gap: 6,
  },
  routeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  routeName: {
    ...typography.bodyStrong,
    fontSize: 17,
    color: colors.text,
  },
  routeMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  routeTags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  tag: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  tagText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  routeStats: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  routeSends: {
    ...typography.h2,
    color: colors.text,
  },
  routeSendsLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSubtle,
  },
  climberList: {
    gap: spacing.md,
  },
  climberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  climberCopy: {
    flex: 1,
    gap: 2,
  },
  climberName: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  climberMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  followBtn: {
    backgroundColor: colors.accentMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  followText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '700',
  },
});
