#!/usr/bin/env node
/**
 * Paylasilan paketleri build edip apps/mobile icine tarball olarak paketler.
 *
 * Mobil taraf pnpm workspace'ine dahil degil: React Native / Metro, pnpm'in
 * symlink + strict hoisting yapisiyla ve CocoaPods autolinking ile sorun
 * cikariyor. Bu yuzden paketler mobile'a `file:*.tgz` olarak baglaniyor.
 *
 * Uretilen tarball'lar repoya commit'leniyor -- boylece temiz bir clone'da
 * `npm install` ve `npm ci` ek bir adim olmadan calisiyor. `npm pack` ayni
 * kaynak icin deterministik oldugundan, kaynak degismedikce git diff olusmaz.
 *
 * Kullanim:
 *   node scripts/sync-mobile.mjs            # build + pack
 *   node scripts/sync-mobile.mjs --install  # ayrica apps/mobile'da npm install
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, unlinkSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const MOBILE = join(ROOT, 'apps', 'mobile')
const PACKAGES = ['gotham', 'gotham-native', 'ui-native']

const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: 'inherit', env: process.env })

// Eski tarball'lari temizle, yoksa surum degisince artiklar birikir.
for (const file of readdirSync(MOBILE)) {
  if (file.startsWith('vyve-') && file.endsWith('.tgz')) {
    unlinkSync(join(MOBILE, file))
  }
}

const tarballs = []

for (const name of PACKAGES) {
  const dir = join(ROOT, 'packages', name)
  const { version } = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))

  console.log(`\n▸ @vyve/${name}@${version}`)
  run('pnpm', ['--filter', `@vyve/${name}`, 'run', 'build'], ROOT)
  run('npm', ['pack', '--pack-destination', MOBILE, '--silent'], dir)

  tarballs.push(`./vyve-${name}-${version}.tgz`)
  console.log(`  → apps/mobile/vyve-${name}-${version}.tgz`)
}

if (process.argv.includes('--install')) {
  // Duz `npm install` YETMEZ: lockfile zaten karsilanmis gorundugu icin npm
  // tarball'in diskte degistigini fark etmez ve "up to date" deyip gecer.
  // Tarball yollarini acikca vermek npm'i yeniden cozmeye zorlar; lockfile'daki
  // integrity hash'i da boylece guncellenir.
  console.log('\n▸ apps/mobile: npm install ' + tarballs.join(' '))
  run('npm', ['install', ...tarballs, '--no-audit', '--no-fund'], MOBILE)
}

console.log('\n✓ Paketler senkronlandi.')
console.log('  Tarball degistiyse apps/mobile/*.tgz ve package-lock.json commit edilmeli.')
