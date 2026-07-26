/**
 * TechTag.jsx — Terminal-style technology tag chip
 *
 * This is the signature design element of the app.
 * Each tech tag looks like a code token: `react` `java` `mongodb`
 *
 * File path: Joblisting-Frontend/src/components/TechTag.jsx
 */

import React from 'react';

// Maps common tech names to accent colors for visual variety
const TECH_COLORS = {
  java:        '#FF6B35',
  spring:      '#6DB33F',
  springboot:  '#6DB33F',
  react:       '#61DAFB',
  mongodb:     '#47A248',
  python:      '#3776AB',
  javascript:  '#F7DF1E',
  typescript:  '#3178C6',
  nodejs:      '#339933',
  docker:      '#2496ED',
  kubernetes:  '#326CE5',
  aws:         '#FF9900',
  mysql:       '#4479A1',
  postgresql:  '#336791',
  redis:       '#DC382D',
  git:         '#F05032',
  html:        '#E34F26',
  css:         '#1572B6',
  angular:     '#DD0031',
  vue:         '#42B883',
  graphql:     '#E10098',
  kafka:       '#231F20',
  jenkins:     '#D24939',
  linux:       '#FCC624',
  sql:         '#CC2927',
};

function getColor(tech) {
  if (!tech) return 'var(--teal)';
  const key = tech.toLowerCase().replace(/[^a-z]/g, '');
  return TECH_COLORS[key] || 'var(--teal)';
}

export default function TechTag({ tech, size = 'md' }) {
  const color = getColor(tech);

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
    padding: size === 'sm' ? '2px 8px' : '3px 10px',
    borderRadius: '4px',
    backgroundColor: `${color}18`,
    border: `1px solid ${color}40`,
    color: color,
    whiteSpace: 'nowrap',
    cursor: 'default',
    transition: 'background-color 0.15s',
  };

  return (
    <span style={style} title={tech}>
      {tech}
    </span>
  );
}