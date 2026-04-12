"""
Generate OG image (1200x630) — clean: just the chart + brand name.
"""
import matplotlib.pyplot as plt
import matplotlib
import numpy as np
from pathlib import Path

matplotlib.use('Agg')

OUT = Path('/Users/luisabrantes/ridingtowealth-/og-image.png')

# Data
years = list(range(2006, 2027))
momR = [13.41,24.49,-43.96,39.37,38.14,2.79,25.24,49.86,35.52,-0.63,17.49,31.95,-1.20,68.96,65.8,40.16,6.93,3.14,35.47,42.07]
spR = [15.81,5.17,-36.97,26.70,15.06,1.79,15.90,32.53,13.45,1.19,12.00,21.83,-4.38,31.49,18.40,28.71,-18.11,26.29,25.02,10.00]

def equity(r):
    e = [100000]
    for x in r:
        e.append(e[-1] * (1 + x/100))
    return e

mom_eq = equity(momR)
sp_eq = equity(spR)

# Create figure — full bleed chart
fig, ax = plt.subplots(figsize=(12, 6.3), dpi=100)
fig.patch.set_facecolor('#0a0a0a')
ax.set_facecolor('#0a0a0a')

# Remove all spines
for spine in ax.spines.values():
    spine.set_visible(False)

# S&P line
ax.plot(years, sp_eq, color='#333333', linewidth=2.5, zorder=2, solid_capstyle='round')

# Momentum line with glow effect
ax.plot(years, mom_eq, color='#4ade80', linewidth=3, zorder=3, solid_capstyle='round')
ax.plot(years, mom_eq, color='#4ade80', linewidth=8, alpha=0.15, zorder=2, solid_capstyle='round')

# Subtle fill under momentum
ax.fill_between(years, mom_eq, alpha=0.04, color='#4ade80', zorder=1)

ax.set_yscale('log')

# Minimal ticks
ax.set_xticks([2006, 2010, 2014, 2018, 2022, 2026])
ax.set_xticklabels(['2006', '', '', '', '', '2025'], fontsize=10, color='#333333', fontfamily='sans-serif')
ax.set_yticks([])
ax.tick_params(axis='x', colors='#222222', length=0, pad=8)

# Subtle grid
ax.grid(False)

# End value labels
ax.text(2026.3, mom_eq[-1], '$5.05M', fontsize=14, fontweight='bold',
        color='#4ade80', va='center', fontfamily='sans-serif')
ax.text(2026.3, sp_eq[-1], '$747K', fontsize=12, fontweight='bold',
        color='#555555', va='center', fontfamily='sans-serif')

# Brand name — centered top
ax.text(0.5, 0.92, 'R I D I N G   T O   W E A L T H', transform=ax.transAxes,
        fontsize=16, fontweight='bold', color='#ffffff', ha='center', va='top',
        fontfamily='sans-serif')

# Subtitle
ax.text(0.5, 0.84, 'Systematic Investing  ·  Updated Daily', transform=ax.transAxes,
        fontsize=10, color='#555555', ha='center', va='top', fontfamily='sans-serif')

# Padding
ax.set_xlim(2005.5, 2028.5)
ax.margins(y=0.15)

plt.subplots_adjust(left=0.03, right=0.92, top=0.95, bottom=0.08)
plt.savefig(OUT, dpi=100, facecolor='#0a0a0a', pad_inches=0)
print(f"Saved: {OUT} ({OUT.stat().st_size / 1024:.0f} KB)")
